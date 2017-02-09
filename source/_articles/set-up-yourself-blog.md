---
title: The Easy Way to set up your own Blog
date: 2016-11-02 15:05:50
categories:
tags: [moka]
cover: http://shikshasolution.online/wp-content/uploads/2016/05/Blogging.png
---


Hello,everyone. Do you want to have your own awesome blog, like as follows? 

Moka Toy Theme
<img src="http://ww4.sinaimg.cn/mw690/a9c83d2dgw1f9121rd0zzj212u0j810k.jpg" alt="pic1" width="690" height="342" />
<img src="http://ww3.sinaimg.cn/mw690/a9c83d2dgw1f9121vhj49j213m0jm0zk.jpg" alt="pic2" width="690" height="342" />

Moka Default Theme
<img src="http://obu9je6ng.bkt.clouddn.com/FrGF08rmJt2NF2LpmuAIRnxj2Nho?imageslim" alt="ClipboardImage" width="989" height="541" />
<img src="http://obu9je6ng.bkt.clouddn.com/FloiRM0XupnS5LAgOUviDDeLps7u?imageslim" alt="ClipboardImage" width="1091" height="539" />
<img src="http://obu9je6ng.bkt.clouddn.com/FhNaO0_pVzZFWUaTH29o2i5MsmIv?imageslim" alt="ClipboardImage" width="1076" height="543" />

My topic is **The Easy Way to set up your own Blog** today.

Maybe you would a questions, which is *"I don't have a server, Where is my blog deployed? "*  
If you don't have the server, don't worry. you can sign up a github's name,then use github pages freely.

Straight to the point, your need to install [nodejs>=6.0](https://nodejs.org/en/) and [git](https://git-scm.com/downloads) after sign up a github's username.  
And two choices, that is, command line and PC desktop.

## Command Line
**if your operation is Windows, open git bash terminal(in right-click menu),** otherwise normal terminal.

input `node -v` and `git --version`
<img src="http://obu9je6ng.bkt.clouddn.com/FmjrebInuh-WSbY9pWWoC4EdQvJV?imageslim" alt="ClipboardImage" width="163" height="33" />
<img src="http://obu9je6ng.bkt.clouddn.com/Fm7iSW9Oe-b5I9WdID1mM4f_p6jn?imageslim" alt="ClipboardImage" width="267" height="33" />
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
<img src="http://obu9je6ng.bkt.clouddn.com/FpEwQ9S4t-i83yHNTYzcOyjnU7xD?imageslim" alt="ClipboardImage" width="736" height="501" />
4. create a empty directory as moka work directory
        cd /path/to/directory/
        mkdir mokaBlog
        cd mokaBlog
5. initiation in moka work directory
        moka init # -f option means empty this directory before init
        # or
        moka i
<img src="http://obu9je6ng.bkt.clouddn.com/FiL0TbYF2eMuI13SlXY5_FoONSu5?imageslim" alt="ClipboardImage" width="696" height="91" />
6. list all files
        ls -R
<img src="http://obu9je6ng.bkt.clouddn.com/FrfIqOOx4wJnWG6c4q9lZ5jjG9-S?imageslim" alt="ClipboardImage" width="1000" height="505" />
7. as you can see, directory `static` is empty after initiation, so you need generate static resource
        moka generate
        # or
        moka g
8. list static directory
<img src="http://obu9je6ng.bkt.clouddn.com/FsCQSqri2tfb0ryLkjFFwNQU5mRI?imageslim" alt="ClipboardImage" width="653" height="165" />
yeah, the files in `themes/moka/build/` are copied to `static/`, and generate a new directory named `moka_api`, `./moka.config.json` and `./themes/moka/theme.config.json` copied here. and generate a new file named `db.json`.

9. run static local server for watch `static/index.html`
        moka staticServer # -p option means the port of static server
        # or
        moka ss
<img src="http://obu9je6ng.bkt.clouddn.com/Fq06Cni0I7TSd8plVByUijKChd3k?imageslim" alt="ClipboardImage" width="410" height="54" />
        open http://localhost:9888  # run in new terminal
<img src="http://obu9je6ng.bkt.clouddn.com/Fszoa19TUtAb48yq1xxcw-1E9cs1?imageslim" alt="ClipboardImage" width="1434" height="776" />

10. OK! if the above steps passed, congratulation. then
    you need set up your own `Github Pages` named `{usename}.github.io`, more info see [User, Organization, and Project Pages](https://help.github.com/articles/user-organization-and-project-pages/)  
and for deploying easily, you also need [Generating a new SSH key and adding it to the ssh-agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) and [Adding a new SSH key to your GitHub account](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/).
11. update `moka.config.json`
<img src="http://obu9je6ng.bkt.clouddn.com/FoK3j0y82Ncw7VM293l9_yAFbzSh?imageslim" alt="ClipboardImage" width="754" height="419" />
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
<img src="/upload/moka-desktop.gif" alt="" width="870" height="603" />


### Why Use it
Some top blue buttons can be understood by `Command Line` above. Then you can watch right logs recording child process's output.  
`Server` and `Static Server` will open a new window automatically after the server run successfully.  

Editor can read the image from clipboard or drag datatransfer, so paste (ctrl/cmd+V) can insert the image fast.

<img src="http://obu9je6ng.bkt.clouddn.com/FrUiUIrThm3D7cbMexVqk_k5tImI?imageslim" alt="ClipboardImage" width="1350" height="718" />

<img src="http://obu9je6ng.bkt.clouddn.com/Fkt6F04f_TxFtNvlrd6Cfixz_Zsq?imageslim" alt="ClipboardImage" width="1173" height="742" />

a lot of editor's theme you can choose.
<img src="/upload/moka-editor-theme.gif" alt="" width="1001" height="601" />

Some accelerator key on editor are as follows.
mac's key is `cmd`, otherwise `ctrl`
1. ctrl/cmd + U   
    toggle about save article automatically
2. ctrl/cmd + B/M   
    font's size increase (B)/decrease (M)
    <img src="/upload/moka-font-size.gif" alt="" width="1001" height="601" />
3. ctrl/cmd + S   
    save
4. ctrl/cmd + F   
    find word in editor
<img src="/upload/moka-find-word.gif" alt="" width="1001" height="601" />

Directory tree's operation
<img src="/upload/moka-tree.gif" alt="" width="1001" height="601" />

## Source Code
- [Moka](https://github.com/moyuyc/moka)
- [Moka Toy Theme](https://github.com/moyuyc/moka-theme-toy)
- [Moka Desktop](https://github.com/moyuyc/moka-desktop)
