//  nodejs爬虫 贴吧首页 程序，蔡东-UESTC-2017-5-19
const https = require('https'), http = require('http'), cheerio = require('cheerio'), fs = require('fs'),
tieba = require('./tieba.js'), tool = require('./tool.js')
let allMsg = ''
 // 爬虫的目标地址
const into = 'http://tieba.baidu.com/f?kw=%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6&fr=home'
fetchPage(into)

//  判断是http协议还是https协议
function fetchPage(url){
    const func = url.split("://")[0]
    if(func == 'http'){
    // 采用http模块向服务器发送一次get请求
        http.get(url , function(res){
            startRequest(res)
        })
    }else if(func == 'https'){
    // 采用https模块向服务器发送一次get请求
        https.get(url , function(res){
            startRequest(res)
        })
    }  
}
//  爬虫主函数
function startRequest(res){
    let html = ''  // 用于储存请求的html整个内容
    res.setEncoding('utf-8')   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    })
    //  收集网页完成，开始处理数据保存
    res.on('end' , function(){
        const $ = cheerio.load(html),  // 采用cheerio 模块解析html
        tiebaName = $('a.card_title_fname ').text().trim(),
        au =  $('span.tb_icon_author')
        let author =  []
        for(let i=0;i<au.length;i++){
            author.push($('span.tb_icon_author').eq(i).attr('title'))
        }
        for(let i=author.length-1;i>=0;i--){
            let url = $('a.j_th_tit').eq(i).attr('href')
            if($('a.j_th_tit').eq(i).attr('href').split('://').length == 1){
                url = 'http://tieba.baidu.com' + $('a.j_th_tit').eq(i).attr('href')
            }
            if(url.split('?').length == 2){
                url = url.split('?')[0]
            }
            msg = (i+1)+'.'+author[i].trim() + '  发表了  ' + $('a.j_th_tit ').eq(i).text().trim() + '  链接：'  +  url
            allMsg = msg + '\r\n' + allMsg 
            tieba.fetchPage(url)
        }

        const txtdir = './data/', imgdir = './image/',
            txt = tool.currName($('a.card_title_fname ').text().trim()) + '.txt'

        tool.dir(txtdir)
        tool.dir(imgdir)
        tool.saveTxt(allMsg, txtdir, txt)

    }).on('error', function() {
        console.log('error')
    })
}
