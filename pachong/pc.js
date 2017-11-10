//  nodejs爬虫 贴吧首页 程序，蔡东-UESTC-2017-5-19
const cheerio = require('cheerio'), tool = require('./tool.js'), tieba = require('./tieba.js'),
data = './data/', img = './image/'
let allMsg = ''
 // 爬虫的目标地址
const into = 'https://tieba.baidu.com/f?kw=%E6%89%92%E7%9A%AE&fr=home&fp=0&ie=utf-8'
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
            let url = `${addr.split('://')[0]}://tieba.baidu.com${$('a.j_th_tit').eq(i).attr('href')}`
            if(url.split('?').length == 2){
                url = url.split('?')[0]
            }
            msg = `${i+1}.${author[i].trim()}  发表了  ${$('a.j_th_tit ').eq(i).text().trim()}  链接：${url}`
            allMsg = `${msg}\r\n${allMsg}`
            tool.fetchPage(url, tieba.tieba)
        }
        const txt = `${tool.currName($('a.card_title_fname ').text().trim())}.txt`
    
        tool.dir(data)
        tool.dir(img)
        tool.saveTxt(allMsg, data, txt)
    }).on('error', function() {
        console.log('error')
    })
}