//  nodejs爬虫 帖子只看楼主内容 程序，蔡东-UESTC-2017-5-19
const https = require('https'), http = require('http'), cheerio = require('cheerio'), fs = require('fs'),
tool = require('./tool.js')
let allMsg = null, webPage = 1, isFirst = true

//  判断是http协议还是https协议
function fetchPage(url){
    const func = url.split("://")[0]
    if(func == 'http'){
        // 采用http模块向服务器发送一次get请求
        http.get(url , function(res){
            startRequest(url, res)
        })
    }else if(func == 'https'){
        // 采用https模块向服务器发送一次get请求
        https.get(url , function(res){
            startRequest(url, res)
        })
    }
}
//  爬虫主函数
function startRequest (url, res){
    if(isFirst){
        isFirst = false
        if(url.split('?pn=').length == 2){
            webPage = webPage.split('?pn=')[1]
        }
    }
    let html = ''  // 用于储存请求的html整个内容
    res.setEncoding('utf-8')   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    })
    //  收集网页完成，开始处理数据保存
    res.on('end' , function(){
        const $ = cheerio.load(html),  // 采用cheerio 模块解析html
        page = $('li.l_reply_num span.red').eq(1).text().trim(),
        tiebaName = $('div.card_title  a.card_title_fname').text().trim(),
        author =  $('.louzhubiaoshi.j_louzhubiaoshi').eq(0).attr('author'),
        t = $('.core_title_txt').text().trim().split("回复：")
        let tieziName = ''
        if(t.length == 1){
            tieziName = t[0] + '  ' + author + '  ' + tiebaName
        }else{
            tieziName = t[1] + '  ' + author + '  ' + tiebaName
        }
        allMsg = '标题：'+tieziName
    let sayContent = $('div.j_d_post_content').text().trim().split("            "), txtNum = 1  // 12空格
    for(let i=sayContent.length-1;i>=0;i--){
        const sayPeople = $('li.d_name a.j_user_card ').eq(i).text().trim(),
            msg = '    '+sayContent[i-1]
        console.log(msg)
        allMsg = allMsg + '\r\n' +  msg
        txtNum ++
    }
    
    const data = './data/', img = './image/', txtdir = './data/all/' ,
        currdir = tool.currName(tieziName),
        imgDir = img + currdir + '/', 
        txt = currdir + '.txt'
    let imgNum = 0

    tool.dir(data)
    tool.dir(img)
    tool.dir(txtdir)
    tool.dir(imgDir)

    tool.saveTxt(allMsg, txtdir, txt)
    tool.saveImage( $, imgDir, imgNum)
    
      //  程序自动翻页
      webPage ++
      const nextUrl = url.split('?see_lz=1&pn=')[0] + '?see_lz=1&pn=' + webPage
      if (webPage <= page) {
          fetchPage(nextUrl)
      }
                
    }).on('error', function() {
    console.log('error')
    })
}

exports.fetchPage = fetchPage