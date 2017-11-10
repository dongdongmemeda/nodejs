//  nodejs爬虫 贴吧首页 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), tool = require('./tool.js')
let allMsg = '', tiebaPage = 1, tiebaMsg = '', onlyPage = 1, onlyMsg = ''
 // 爬虫的目标地址
const into = 'http://tieba.baidu.com/f?kw=%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6&fr=home'
tool.fetchPage(into, firstPage)
//  爬虫主函数
function firstPage(addr, res){
    let html = ''  // 用于储存请求的html整个内容
    res.setEncoding('utf-8')   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    })
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
            tool.fetchPage(url, tieba)
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
//  单独帖子的爬虫
function tieba (addr, res){
    let html = ''  // 用于储存请求的html整个内容
    res.setEncoding('utf-8')   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    })
    res.on('end' , function(){
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
        tiebaMsg = '标题：' + tieziName
        let sayContent = $('div.j_d_post_content').text().trim().split("            "), txtNum = 1  // 12空格
        for(let i=1;i<sayContent.length+1;i++){
            const sayPeople = $('li.d_name a.j_user_card ').eq(i-1).text().trim(), 
                msg = txtNum+'楼    '+sayPeople+'\r\n    '+sayContent[i-1]
            tiebaMsg = tiebaMsg + '\r\n' +  msg
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
        tool.saveTxt(tiebaMsg, txtdir, txt)
        tool.saveImage( $, imgDir, imgNum)
          
          //  程序自动翻页
          tiebaPage ++
          const nextUrl = addr.split('?pn=')[0] + '?pn=' + tiebaPage
          if (tiebaPage <= page) {
            tool.fetchPage(nextUrl, tieba)
          }
    }).on('error', function() {
        console.log('error')
    })
}
//  只看楼主的爬虫
function only (addr, res){
    let html = ''  // 用于储存请求的html整个内容
    res.setEncoding('utf-8')   // 防止中文乱码
    res.on('data' , function(data){
        html += data
    })
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
        onlyMsg = '标题：'+tieziName
        let sayContent = $('div.j_d_post_content').text().trim().split("            "), txtNum = 1  // 12空格
        for(let i=sayContent.length-1;i>=0;i--){
            const sayPeople = $('li.d_name a.j_user_card ').eq(i).text().trim(),
                msg = '    '+sayContent[i-1]
            console.log(msg)
            onlyMsg = onlyMsg + '\r\n' +  msg
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
        tool.saveTxt(onlyMsg, txtdir, txt)
        tool.saveImage( $, imgDir, imgNum)
        
          //  程序自动翻页
          onlyPage ++
          const nextUrl = addr.split('?see_lz=1&pn=')[0] + '?see_lz=1&pn=' + onlyPage
          if (onlyPage <= page) {
              tool.fetchPage(nextUrl, only)
          }
    }).on('error', function() {
        console.log('error')
    })
}