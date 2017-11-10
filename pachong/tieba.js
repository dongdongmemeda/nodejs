//  nodejs爬虫 帖子全部内容 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), tool = require('./tool.js')
let allMsg = '', webPage = 1
// 爬虫的目标地址
const url = ''
tool.fetchPage(url, func)
//  爬虫主函数
function func (url, res){
    const $ = cheerio.load(html),  // 采用cheerio 模块解析html
    page = $('li.l_reply_num span.red').eq(1).text().trim(),
    tiebaName = $('.card_title_fname').attr('title'),
    author =  $('.louzhubiaoshi').attr('author'),
    t = $('.core_title_txt').text().trim().split("回复：")
    let tieziName = ''
    if(t.length == 1){
        tieziName = t[0] + '  ' + author + '  ' + tiebaName
    }else{
        tieziName = t[1] + '  ' + author + '  ' + tiebaName
    }
    allMsg = '标题：' + tieziName
    let sayContent = $('div.j_d_post_content').text().trim().split("            "), txtNum = 1  // 12空格
    for(let i=1;i<sayContent.length+1;i++){
        const sayPeople = $('li.d_name a.j_user_card ').eq(i-1).text().trim(), 
            msg = txtNum+'楼    '+sayPeople+'\r\n    '+sayContent[i-1]
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
      const nextUrl = url.split('?pn=')[0] + '?pn=' + webPage
      if (webPage <= page) {
        tool.fetchPage(nextUrl, func)
      }
}