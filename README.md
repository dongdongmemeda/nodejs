## nodejs

    author: 蔡东
    desc: 贴吧爬虫程序
    createdOn: 2017/5/28

## 操作说明 

    1.配置环境，安装node，官网下载 [node](https://nodejs.org/en/)
    2.安装环境需要的npm包，打开cmd执行 npm install request && npm install cheerio
    3.运行主程序 node pc.js

## 文件说明

    pc.js: 爬虫主程序，爬取贴吧首页的帖子名和帖子链接
    tieba.js: 爬虫支线，根据之前爬取到的每个帖子名爬取每个帖子的每层楼评论（文字加图片），每层楼用户id和头像
    tool.js: 爬虫支持，提供了爬虫保存到本地文件的方法，还有http协议与https协议
    only.js: 和tieba.js类似，支持只看楼主
    
