---
title: （译）进阶Bash Script指南（一）
date: 2017-01-24 20:42:54
categories:
tags: [bash, 翻译]
cover: http://imglf1.nosdn.127.net/img/TjJNOU5JYkNaSkQ2NTIzRk1BamM0ZkVMZG5PdndpaEY0dnV4TFRsN2xuRXRPaHpKeVU2ay93PT0.jpg?imageView&thumbnail=1680x0&quality=96&stripmeta=0&type=jpg
skip: false
---

原文：[Advanced Bash-Scripting Guide](http://www.tldp.org/LDP/abs/abs-guide.pdf)

部分[学习代码](https://github.com/moyuyc/advanced-bash-scripting-learning)

只做部分翻译，一些个人遗漏的点。


### 关于脚本头

Bash 中头部 `#!` ，如果没有用上 Bash 专用的语法（比如 A=abc，赋值语句），是可以被不加上。

`#!/bin/sh` 调用的是默认的 Shell 解释器，在 Linux 中是 `/bin/bash`


### 参数个数到数组长度

下面脚本中，`$#` 是参数数组的长度，可以用下面脚本判断参数的输入
```sh
#!/bin/sh

E_WRONG_ARGS=85
script_parameters="-a -h -m -z"
Number_of_expected_args=1
# -a = all, -h = help, etc.
if [ $# -ne $Number_of_expected_args ]
then
 echo "Usage: `basename $0` $script_parameters"
 # `basename $0` is the script's filename.
 exit $E_WRONG_ARGS
fi
```

上面例子可以看到`#`可以表示一个数组（字符串）的长度，如下例

    arr=(a b c) && str=string && echo ${#arr}-${#str} # 3-6
    

### 脚本的执行方法

比如有`sh scriptname.sh` `bash scriptname.sh`，当然还有 `sh < scriptname.sh`  ( 这种方法不建议，因为不能在脚本中读 `stdin` )。最方便的方法还是，直接用`chmod`变成可执行（executable）文件。

    chmod 555 scriptname # readable/executable for all
    chmod +rx scriptname # readable/executable for all
    chmod u+rx scriptname # readable/executable for user

### 字符 `#`

1. 普通字符`#`
        echo "hello\n# comment\nworld" | \
        sed -e '/#/d' | # 删除带有`#`字符的行 \  
        tr -d '\n' | # 删除换行符 \   
        sed -e 's/world/,Bash scripting/g'  # 字符替换

2. 字符串匹配
        str=abc123456123ABC
        echo ${str#*123}  # 删除 str 中匹配*123的 最短匹配
        echo ${str##*123} # 删除 str 中匹配*123的 贪心匹配
3. 数字表达式
        echo $((2#101011))  # 二进制的101011

### 字符 `;`

在同一行中执行多条指令

    echo one; echo two
    
    if [ true ]; then  # ; 不能少, if/then 两条指令
        echo "true statement"
    fi
    
### 双分号 `;;`

在 case 选项中

    variable=abc
    case "$variable" in
        abc)  echo "\$variable = abc" ;;
        xyz)  echo "\$variable = xyz" ;;
    esac
    
### 逗号 `,`

字符串的拼接

    ls /usr{,/lib} # 列出 `/usr` 和 `/usr/lib` 下的文件
    mv file{,B}.txt # file.txt -> fileB.txt
    
### 冒号 `:`

nop 操作，空操作，退出状态为0

    not-exist-command; echo $?
    
    not-exist-command; :; echo $?
    
选择符
    
    a=123
    b=456
    echo ${a:-$b} # 123
    
    a=
    b=456
    echo ${a:-$b} # 456

### "``" 与 $()

指令运行输出结果赋值给某变量
    
    files=(*); echo ${files[@]} # or ${files}
    echo $(ls)
    echo `ls`
    
### 通配符

在 Unix 文件系统中，有 `*`、`?`、`[]`

    echo /usr/*    # * 配对任意长，任意字符
    echo /usr/li?  # ? 配对一个字符
    echo /usr/li[a-z]


### `? : ` 三目运算符

    ((x = 2>0?123:456)); echo $x

### `$$`

    echo $$;   # process ID
    
### `{}` 扩充

`{}` 内不允许任何空格，除非是转义后或是引号内

1. 字符串组合
        echo \"{These,words,are,quoted}\"   # " prefix and suffix
        # "These" "words" "are" "quoted"
        
        cp file22.{txt,backup}
        # Copies "file22.txt" to "file22.backup"
        
        echo {a..z} # a b c d e f g h i j k l m n o p q r s t u v w x y z
        # Echoes characters between a and z.
        echo {0..3} # 0 1 2 3
        # Echoes characters between 0 and 3.
        base64_charset=( {A..Z} {a..z} {0..9} + / = )
        
        echo {file1,file2}\ :{\ A," B",' C'}
        # file1 : A file1 : B file1 : C file2 : A file2 : B file2 : C
        echo {file1,file2} :{\ A," B",' C'}
        # file1 file2 : A : B : C
    
2. 代码块
    ```bash
    #!/bin/sh
    # readfile line by line
    File=${me=`basename "$0"`}
    {
        read line1
        read line2
    } < $File
    echo "First line in $File is:"
    echo "$line1"
    echo
    echo "Second line in $File is:"
    echo "$line2"
    ```
    ```bash
    #!/bin/sh
    # output save to out.html
    {
        echo "<html>"
        echo "<head></head>"
        echo "<body><h1>Output</h1></body>"
        echo "</html>"
    } > out.html
    
    open out.html
    ```
    
### 后台进程 `&`

`&` 不仅仅可以用于单条指令，对于一个完整的语句块也是可以的。

    for i in 1 2 3 4 5 6 7 8 9 10
    do
      echo -n "$i "
    done &
    

### 对`&&`的误解

`&&` 并不是无条件的顺序执行下一条指令，而是需要上一条指令 `exit code` 等于 0。

    (exit 1) && echo 123  # print nothing.
    (exit 1); echo 123    # print 123.
    
### 比较操作符

    #!/usr/bin/env bash
    
    files=(*.sh)
    file1=${files[1]}
    file2=${files[2]}
    
    if [ $file1 -ot $file2 ]
    then #      ^
      echo "File $file1 is older than $file2."
    fi
    
    a=123
    b=123
    
    if [ "$a" -eq "$b" ]
    then #    ^
      echo "$a is equal to $b."
    fi
    
    c=24
    d=47
    
    if [ "$c" -eq 24 -a "$d" -eq 47 ] # [[ "$c" = 24 && "$d" = 47 ]]
    then #    ^              ^
      echo "$c equals 24 and $d equals 47."
    fi

### `-` 的扩展

`-` 除了是对于指令的选项，如 `ls -al` ，还可以表示 `stdio`

    tar cf - .  #stdout
    # The 'c' option 'tar' archiving command creates a new archive,
    # the 'f' (file) option, followed by '-' designates the target file
    # as stdout, and do it in current directory tree ('.').
    
    tar xpvf -  #stdin
    # Unarchive ('x'), preserve ownership and file permissions ('p'),
    # and send verbose messages to stdout ('v'),
    # reading data from stdin ('f' followed by '-').
    
    file -  #stdin
    
    diff file.js - # stdin
    
`cd -` 可以对 pwd 的切换，主要是保存了 OLDPWD

    cd /
    cd ~
    echo $OLDPWD
    echo $PWD

### 其他符号

    echo ~+   # echo $PWD
    echo ~-   # echo $OLDPWD
    
### 有用的快捷键

1. Ctl - Z  挂起前台进程
2. Ctl - T  交换 2 个相邻字符
3. Ctl - W  删除左边一个单词
4. Ctl - X  选择高亮
5. Ctl - Y  插入之前删除的文本（Ctl - W/U）
6. Ctl - R  搜索历史指令
7. Ctl - S  中断控制台输出
8. Ctl - Q  恢复控制台输出



### `IFS` 内部域分隔符

    #!/bin/sh

    output_args_one_per_line()
    {
        arg_list=$*
        echo "\$*='$*'"
        for arg in $arg_list
        do
            echo "[$arg]"
        done
    }
    
    x="a b c d e"
    IFS=' '
    output_args_one_per_line $x
    
    x="a b c"$'\t'"d e"
    IFS=$'\t'
    output_args_one_per_line $x
    
### `$*` 与 `$@`

     IFS=";"
     set x y z
     echo $*    # x y z
     echo "$*"  # x;y;z
     echo "$@"  # x y z

