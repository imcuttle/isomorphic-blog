---
title: LinuxC OSX sendfile()
date: 2016-10-19 21:00:46
categories:
tags: [linux, 网络编程]
---

今天，来小结一下纠结我几个小时的linux C。需求是这样的，*用c实现tcp的文件上传与下载*

一开始，很容易想到的上传思路是，直接在内存中开一块`buffer`，得到一个`file description`后，进行一读一发。
<!--more-->
```c
char buffer[1024];
int fd = open(path, O_RDONLY);
int n = read(fd, buffer, 1024);
if(n<0) {
    perror("read");
}
buffer[n] = 0;

write(socket, buffer, n);

//...
```

**然而，其实在linux内核中已经实现了一种更为高效的方法，`sendfile`**  
不需要频繁的调用`read/write`,也不需要开辟buffer，减少了内核函数的调用，提高性能。

## 函数说明

- 定义

        int sendfile(int fd, int s, off_t offset, off_t *len, struct sf_hdtr *hdtr, int flags);

- 解释

|argument name| explantion |
|---|---------|
|fd |需要发送的文件的fd(file description)|
|s |socket的fd|
|offset|文件从那开始发,NULL表示为0|
|len|输出参数，输出一共发送了多少byte,包括后面的hdtr|
|hdtr|额外发送的头和尾|
|flags|设置为0即可|

关于flags, man page原文如下:

> The flags parameter is reserved for future expansion and must be set to 0. Any other value will cause sendfile() to return EINVAL.

意思是，flags是为了后面备用的，现在还没实现，现在传入0即可。

下面着重解释`len`与`hdtr`参数
结构体`sf_hdtr`, 成员如下
```c
struct sf_hdtr {
    struct iovec *headers;  /* pointer to header iovecs */
    int hdr_cnt;            /* number of header iovecs */
    struct iovec *trailers; /* pointer to trailer iovecs */
    int trl_cnt;            /* number of trailer iovecs */
};
```
而，结构体`iovec`
```c
struct iovec {
	void *   iov_base;	/* [XSI] Base address of I/O memory region */
	size_t	 iov_len;	/* [XSI] Size of region iov_base points to */
};
```
可以看到，iovec数据就是表示一段`iov_len`长度的数据区，而sf_hdtr则是2个`iov_len`数组(指针)。

`headers`就是发送文件数据前发送的数据段，`trailers`则是跟在文件数据EOF之后的。

解释完该方法后，其实上传文件，只需要调用该方法即可，而`headers`和`trailers`可以用来界定文件数据，ngnix osx版本中，便有使用该方法。

为了简化文件数据划分的逻辑，我未采用，http协议中类似`Content-Length`字段来表示文件的大小，从而拼接出完整的文件内容，而是简单的在文件数据头尾加上了自定义的字符串。

## 代码

[cpp_src](https://github.com/moyuyc/c_cpp-node_c_cpp_addon/tree/master/cpp_src)

- 发送文件

```c
bool _sendFile(int out_fd, const char* file) {
    int fd = open(file, O_RDONLY);
    char* tmp = strrchr(file, '/');
    const char* filename = tmp!=NULL? tmp+1: file;
    if(fd==-1) {
        char b[1024];
        sprintf(b, "open failed %s", file);
        perror(b);
        return false;
    }
    struct stat state;
    fstat(fd, &state);

    printf("sending File %s ...\n", file);
    off_t offset = 0;
    off_t len = 0; // 必须初始化0, 不然下次重入时，会被旧值覆盖

    char head[1024], sizehd[1024];
    sprintf(head, "---file: %s\r\n", filename); // 拼装头部字符串
//    sprintf(sizehd, "---size: %lld\r\n\r\n", state.st_size);

    struct sf_hdtr hdtr = NULL;
    iovec headers = NULL, trailers = NULL;
    headers.iov_base = head;
    headers.iov_len = strlen(head);
//    trailers.iov_base = (void *)"file---\r\n"; //todo: don't recv sometimes ??
//    trailers.iov_len = 9;
    hdtr.headers = &headers;
    hdtr.hdr_cnt = 1;
    hdtr.trailers = NULL;
    hdtr.trl_cnt = 0;

    if(0 == sendfile(fd, out_fd, offset, &len, &hdtr, 0)) {
        close(fd);
        write(out_fd, "file---\r\n", 9); // 未使用trailers，因为有时候上传大文件，trailers会丢失。
        printf("sendFile %s success, return len: %lld.\n", file, len);
        return true;
    } else {
        close(fd);
        write(out_fd, "file---\r\n", 9);
        perror("sendfile");
        return false;
    }
}
```

- 接收文件

```c
bool _receFile(FILE* &pfsile, char* buffer, ssize_t n, bool& receiveing, char* rfilename, int size) {
    bool run = false;
    char* last = NULL;
    if(!receiveing && isfileHead(buffer)) {
        memset(rfilename, 0, 50);
        strcpy(rfilename, "data/");
        if (stat(rfilename, NULL) == -1) {
            mkdir(rfilename, 0700);
        }

        char name[40];
        sscanf(buffer, "---file: %s\r\n", name);
        int othlen = 11+strlen(name);
        int addonlen = n-othlen;

        strcat(rfilename, name);
        pfile = fopen(rfilename, "wb+"); //!! 以二进制打开文件

        receiveing = true;
        printf("Downloading %s ...\nhead addon: %s\n\n",
               rfilename, buffer+othlen);
        if(addonlen > 0) {
            fwrite(buffer+othlen, addonlen, 1, pfile);
        }
        run= true;
    }
    if(receiveing && (last = fileTail(buffer, n))!=NULL) {
        receiveing = false;
        fwrite(buffer, last-buffer, 1, pfile);
        fclose(pfile);
        printf("Downloaded %s. and saved\n", rfilename);
        run= true;
    } else if(receiveing && !run) {
        printf("download chunk, size: %ld\n", n);
        if(n<size) {
            receiveing = false;
            fclose(pfile);
        }
        fwrite(buffer, n, 1, pfile);
        run= true;
    }
    return run;
}
```

## 最后

其实还是会有bug的，比如`---file: a.png\r\n ... ---file\r\n`的数据，接收方buffer设置较小，不能容纳完整的`---file`标志，可能就不会被认为是file；或者结尾截断了。而对于上诉情况，应用层只能通过更复杂的代码逻辑来控制了。

