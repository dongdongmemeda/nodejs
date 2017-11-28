//  nodejs爬虫 帖子只看楼主内容 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), tool = require('./tool.js')
let  data = './data/', img = './image/'
// 爬虫的目标地址
// const url = 'http://tieba.baidu.com/p/3506527161?see_lz=1&pn=1'
// tool.fetchPage(url, only, '', 1)
//  爬虫主函数
function only (addr, res, onlyMsg, onlyPage){
    let html = ''  // 用于储存请求的html整个内容
    res.setEncoding('utf-8')   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    })
    res.on('end' , function(){
        const $ = cheerio.load(html),  // 采用cheerio 模块解析html
        page = $('.l_reply_num .red').eq(1).text().trim()
        let at = $('#tb_nav .multi_forum_link').eq(1).text()|| 'undefined',
        tiebaName = $('div.card_title a.card_title_fname').eq(0).text().trim() || at,
        t = $('.core_title_wrap_bright .core_title_txt').eq(0).text().trim() || 'undefined'
        if(t !== undefined){
            let ti = t.split('回复：')
            tieziName =  ti[ti.length-1]
        }else{
            tieziName = 'undefined'
        }
        if(tiebaPage === 1){
            tiebaMsg = `标题：${tool.currName(tieziName)}  链接：${addr.split('?')[0]}\r\n`
        }
        let people = $('li.d_name a.j_user_card'), txtNum = 1+30*(tiebaPage-1)
        for(let i=0;i<people.length;i++){
            let sayPeople = people.eq(i).text().trim(), msg = `${txtNum}楼    ${sayPeople}\r\n    ${sayContent[i-1]}`
            tiebaMsg = `${tiebaMsg}\r\n${msg}`
            txtNum ++
        }
        const txtDir = `${data}${tool.currName(tiebaName)}/`, txt = `${tool.currName(tieziName)}.txt`,
              imgdir = `${img}${tool.currName(tiebaName)}/`, imgDir = `${imgdir}${tool.currName(tieziName)}/`      

        tool.dir(data)
        tool.dir(txtDir)
        tool.dir(img)
        tool.dir(imgdir)
        tool.dir(imgDir)
        tool.saveTxt(onlyMsg, txtDir, txt)
        tool.saveImage( $, imgDir)
        
          //  程序自动翻页
          onlyPage ++
          const nextUrl = `${addr.split('?see_lz=1&pn=')[0]}?see_lz=1&pn=${onlyPage}`
          if (onlyPage <= page) {
                tool.fetchPage(nextUrl, only, onlyMsg, onlyPage)
          }
    }).on('error', function() {
        console.log('error')
    })
}

exports.only = only