---
title: The Easy Way to set up your own Blog
date: 2016-11-02 15:05:50
categories:
tags: [moka]
cover: http://shikshasolution.online/wp-content/uploads/2016/05/Blogging.png
---


Hello,everyone. Do you want to have your own awesome blog, like as follows? 

Moka Toy Theme
![pic1](http://ww4.sinaimg.cn/mw690/a9c83d2dgw1f9121rd0zzj212u0j810k.jpg)
![pic2](http://ww3.sinaimg.cn/mw690/a9c83d2dgw1f9121vhj49j213m0jm0zk.jpg)

Moka Default Theme
![ClipboardImage](/upload/1478072089882.png)
![ClipboardImage](/upload/1478072131469.png)
![ClipboardImage](/upload/1478072150076.png)

My topic is **The Easy Way to set up your own Blog** today.

Maybe you would a questions, which is *"I don't have a server, Where is my blog deployed? "*  
If you don't have the server, don't worry. you can sign up a github's name,then use github pages freely.

Straight to the point, your need to install [nodejs>=6.0](https://nodejs.org/en/) and [git](https://git-scm.com/downloads) after sign up a github's username.  
And two choices, that is, command line and PC desktop.

## Command Line
**if your operation is Windows, open git bash terminal(in right-click menu),** otherwise normal terminal.

input `node -v` and `git --version`
![ClipboardImage](/upload/1478075045504.png) ![ClipboardImage](/upload/1478075079922.png)
if their version display successily, congratulation!

OK! It's time that the leading role say hello to everyone.  
The leading role is named **Moka**, supporting **gym markdown** syntax, generating your **SPA** (single page application) Blog.

Steps:  
1. if you are in China, install cnpm (download Moka fast) by npm (node package manager, Be installed together with node)
        npm install -g cnpm --registry=https://registry.npm.taobao.org
2. install Moka by npm or cnpm 
        npm install moka-cli -g  # install moka on PATH
        # or
        cnpm install moka-cli -g
3. check moka is installed
        moka -h  # moka's usage
        # or
        moka --help
![ClipboardImage](/upload/1478076304936.png)
4. create a empty directory as moka work directory
        cd /path/to/directory/
        mkdir mokaBlog
        cd mokaBlog
5. initiation in moka work directory
        moka init # -f option means empty this directory before init
        # or
        moka i
![ClipboardImage](/upload/1478076757018.png)
6. list all files
        ls -R
![ClipboardImage](/upload/1478077648968.png)
7. as you can see, directory `static` is empty after initiation, so you need generate static resource
        moka generate
        # or
        moka g
8. list static directory
![ClipboardImage](/upload/1478080340315.png)
yeah, the files in `themes/moka/build/` are copied to `static/`, and generate a new directory named `moka_api`, `./moka.config.json` and `./themes/moka/theme.config.json` copied here. and generate a new file named `db.json`.

9. run static local server for watch `static/index.html`
        moka staticServer # -p option means the port of static server
        # or
        moka ss
![ClipboardImage](/upload/1478078760611.png)
        open http://localhost:9888  # run in new terminal
![ClipboardImage](/upload/1478078961569.png)

10. OK! if the above steps passed, congratulation. then
    you need set up your own `Github Pages` named `{usename}.github.io`, more info see [User, Organization, and Project Pages](https://help.github.com/articles/user-organization-and-project-pages/)  
and for deploying easily, you also need [Generating a new SSH key and adding it to the ssh-agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) and [Adding a new SSH key to your GitHub account](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/).
11. update `moka.config.json`
![ClipboardImage](/upload/1478079670467.png)
replace `deploy.url` to yourself, and if you want bakup your moka work directory, replace `bak.url`
12. Deploy!
        moka d -g -b # -b option menus bakup, -g: generate
    Done! Open your blog (address: yourusername.github.io) and enjoy it.
13. New Article
        moka new title
        # or
        moka n title

## PC Desktop
you can get it on [github release page](https://github.com/moyuyc/moka-desktop/releases), or contact me for latest one.  
`Moka` is mixed in `Moka Desktop`, So you don't need to `npm install -g moka-cli`.
It's awesome that **Editor** which has synchronic preview and easy way to insert image, and **Directory Tree** are mixed in `Moka Desktop` too.

### Preview
![](/upload/moka-desktop.gif)


### Why Use it
Some top blue buttons can be understood by `Command Line` above. Then you can watch right logs recording child process's output.  
`Server` and `Static Server` will open a new window automatically after the server run successfully.  

Editor can read the image from clipboard or drag datatransfer, so paste (ctrl/cmd+V) can insert the image fast.

![ClipboardImage](http://obu9je6ng.bkt.clouddn.com/FrUiUIrThm3D7cbMexVqk_k5tImI?imageslim)

![ClipboardImage](http://obu9je6ng.bkt.clouddn.com/Fkt6F04f_TxFtNvlrd6Cfixz_Zsq?imageslim)

a lot of editor's theme you can choose.
![](/upload/moka-editor-theme.gif)

Some accelerator key on editor are as follows.
mac's key is `cmd`, otherwise `ctrl`
1. ctrl/cmd + U   
    toggle about save article automatically
2. ctrl/cmd + B/M   
    font's size increase (B)/decrease (M)
    ![](/upload/moka-font-size.gif)
3. ctrl/cmd + S   
    save
4. ctrl/cmd + F   
    find word in editor
![](/upload/moka-find-word.gif)

Directory tree's operation
![](/upload/moka-tree.gif)

## Source Code
- [Moka](https://github.com/moyuyc/moka)
- [Moka Toy Theme](https://github.com/moyuyc/moka-theme-toy)
- [Moka Desktop](https://github.com/moyuyc/moka-desktop)
