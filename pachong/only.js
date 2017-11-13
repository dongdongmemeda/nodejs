//  nodejs爬虫 帖子只看楼主内容 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), tool = require('./tool.js')
let onlyMsg = '', onlyPage = 1
// 爬虫的目标地址
// const url = 'http://tieba.baidu.com/p/3506527161?see_lz=1&pn=1'
// tool.fetchPage(url, only)
//  爬虫主函数
function only (addr, res){
    let html = ''  // 用于储存请求的html整个内容
    res.setEncoding('utf-8')   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    })
    res.on('end' , function(){
        const $ = cheerio.load(html),  // 采用cheerio 模块解析html
        page = $('li.l_reply_num span.red').eq(1).text().trim(),
        tiebaName = $('.card_title_fname').text().trim() || 'undefined',
        t = $('.core_title_txt').text().trim().split("回复："),
        tieziName = `${t[t.length-1]}  ${tiebaName}`
        if(onlyPage == 1){
            onlyMsg = `标题：${tool.currName(tieziName)}  链接：${addr.split('?')[0]}\r\n`
        }
        let sayContent = $('div.j_d_post_content').text().trim().split("            ")    // 12空格
        for(let i=sayContent.length-1;i>=0;i--){
            const sayPeople = $('li.d_name a.j_user_card ').eq(i).text().trim(), msg = `    ${sayContent[i-1]}`
            console.log(msg)
            onlyMsg = `${onlyMsg}\r\n${msg}`
        }  
        const data = './data/', img = './image/', imgdir = `${img}${tool.currName(tiebaName)}/`,
            txtDir = `${data}${tool.currName(tiebaName)}/`, imgDir = `${imgdir}${tool.currName(tieziName)}/`,
            txt = `只看楼主_${tool.currName(tieziName)}.txt`
    
        tool.dir(data)
        tool.dir(img)
        tool.dir(imgdir)
        tool.dir(txtDir)
        tool.dir(imgDir)
        tool.saveTxt(onlyMsg, txtDir, txt)
        tool.saveImage( $, imgDir)
        
          //  程序自动翻页
          onlyPage ++
          const nextUrl = `${addr.split('?see_lz=1&pn=')[0]}?see_lz=1&pn=${onlyPage}`
          if (onlyPage <= page) {
                tool.fetchPage(nextUrl, only)
          }
    }).on('error', function() {
        console.log('error')
    })
}

exports.only = only