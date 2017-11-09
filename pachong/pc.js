//  nodejs爬虫 贴吧首页 程序，蔡东-UESTC-2017-5-19
const https = require('https'), http = require('http'), cheerio = require('cheerio'), fs = require('fs'),
tieba = require('./tieba.js'), tool = require('./tool.js'),
 // 爬虫的目标地址
url = 'https://tieba.baidu.com/f?ie=utf-8&kw=%E6%89%92%E7%9A%AE&fr=search';
let allMsg = '';
//  判断是http协议还是https协议
function fetchPage(url){
    const func = url.split("://")[0];
    if(func == 'http'){
    // 采用http模块向服务器发送一次get请求
        http.get(url , function(res){
            startRequest(res);
        });
    }else if(func == 'https'){
    // 采用https模块向服务器发送一次get请求
        https.get(url , function(res){
            startRequest(res);
        });
    }  
}
//  爬虫主函数
function startRequest(res){
    let html = '';  // 用于储存请求的html整个内容
    res.setEncoding('utf-8');   // 防止中文乱码
    res.on('data' , function(data){
        html += data;
    });
    //  收集网页完成，开始处理数据保存
    res.on('end' , function(){
        const $ = cheerio.load(html),  // 采用cheerio 模块解析html
        tiebaName = $('a.card_title_fname ').text().trim(),
        au =  $('span.tb_icon_author');
        let author =  [];
        for(var i=0;i<au.length;i++){
            author.push($('span.tb_icon_author').eq(i).attr('title'))
        }
        for(let i=author.length-1;i>=0;i--){
            const url = 'https://tieba.baidu.com' + $('a.j_th_tit').eq(i).attr('href'),
                msg = i+'.'+author[i].trim() + '  发表了  ' + $('a.j_th_tit ').eq(i).text().trim() + 
                        '  链接：'  +  url;
            console.log(msg);
            allMsg = msg + '\r\n' + allMsg ;
            tieba.fetchPage(url+'?pn='+'1')
        }

        const txtdir = './data/', txt = $('a.card_title_fname ').text().trim().replace(/\//g, 'i').replace(/\\/g, 'i')
        .replace(/:/g, 'i').replace(/\*/g, 'i').replace(/\?/g, 'i').replace(/</g, 'i').replace(/>/g, 'i')
        .replace(/"/g, 'i').replace(/\|/g, 'i') + '.txt'

        tool.dir(txtdir)
        tool.saveTxt(allMsg, txtdir, txt);

    }).on('error', function() {
        console.log('error');
    });
}

fetchPage(url);
