//  nodejs爬虫 帖子全部内容 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), tool = require('./tool.js')
let allMsg = '', webPage = 1
// 爬虫的目标地址
const url = 'http://tieba.baidu.com/p/3506527161'
tool.fetchPage(url, func)
//  爬虫主函数
function func (addr, res){
    let html = ''  // 用于储存请求的html整个内容
    res.setEncoding('utf-8')   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    })
    res.on('end' , function(){
        const $ = cheerio.load(html),  // 采用cheerio 模块解析html
        page = $('li.l_reply_num span.red').eq(1).text().trim(),
        tiebaName = $('.card_title_fname').text().trim() || 'undefined',
        author =  $('.louzhubiaoshi').attr('author'),
        t = $('.core_title_txt').text().trim().split("回复：")
        let tieziName = ''
        if(t.length == 1){
            tieziName = t[0] + '  ' + author + '  ' + tiebaName
        }else{
            tieziName = t[1] + '  ' + author + '  ' + tiebaName
        }
        allMsg = '标题：' + tieziName
        let sayContent = $('div.j_d_post_content').text().trim().split("            "), txtNum = 1+30*(webPage-1)  // 12空格
        for(let i=1;i<sayContent.length+1;i++){
            const sayPeople = $('li.d_name a.j_user_card ').eq(i-1).text().trim(), 
                msg = txtNum+'楼    '+sayPeople+'\r\n    '+sayContent[i-1]
            allMsg = allMsg + '\r\n' +  msg
            txtNum ++
        }
        const data = './data/', img = './image/', imgdir = img + tool.currName(tiebaName) + '/',
              txtDir = data + tool.currName(tiebaName) + '/', imgDir = imgdir + tool.currName(tieziName) + '/',
              txt = tool.currName(tieziName) + '.txt'
    
        tool.dir(data)
        tool.dir(img)
        tool.dir(imgdir)
        tool.dir(txtDir)
        tool.dir(imgDir)
        tool.saveTxt(allMsg, txtDir, txt)
        tool.saveImage( $, imgDir)
          
          //  程序自动翻页
          webPage ++
          const nextUrl = addr.split('?pn=')[0] + '?pn=' + webPage
          if (webPage <= page) {
            tool.fetchPage(nextUrl, func)
          }
    }).on('error', function() {
        console.log('error')
    })
}