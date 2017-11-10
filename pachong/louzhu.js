//  nodejs爬虫 帖子只看楼主内容 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), tool = require('./tool.js')
let allMsg = '', webPage = 1
// 爬虫的目标地址
const url = ''
tool.fetchPage(url, func)
//  爬虫主函数
function func (addr, res){
    const $ = cheerio.load(html),  // 采用cheerio 模块解析html
    page = $('li.l_reply_num span.red').eq(1).text().trim(),
    tiebaName = $('.card_title_fname').text().trim() || 'undefined',
    author =  $('.louzhubiaoshi').eq(0).attr('author'),
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
    const data = './data/', img = './image/', imgdir = img + tool.currName(tiebaName) + '/',
        txtDir = data + tool.currName(tiebaName) + '/', imgDir = imgdir + tool.currName(tieziName) + '/',
        txt = tool.currName(tieziName) + '.txt', imgNum = Math.random().toString(16).substr(2,8)

    tool.dir(data)
    tool.dir(img)
    tool.dir(imgdir)
    tool.dir(txtDir)
    tool.dir(imgDir)
    tool.saveTxt(allMsg, txtDir, txt)
    tool.saveImage( $, imgDir, imgNum)
    
      //  程序自动翻页
      webPage ++
      const nextUrl = addr.split('?see_lz=1&pn=')[0] + '?see_lz=1&pn=' + webPage
      if (webPage <= page) {
          tool.fetchPage(nextUrl, func)
      }
}