//  nodejs爬虫 贴吧 程序，蔡东-UESTC-2017-11-9
const fs = require('fs'), request = require('request'), https = require('https'), http = require('http')

//  判断是http协议还是https协议
function fetchPage(url, func){
    const web = url.split("://")[0]
    if(web == 'http'){
        // 采用http模块向服务器发送一次get请求
        http.get(url , function(res){
            func(url, res)
        })
    }else if(web == 'https'){
        // 采用https模块向服务器发送一次get请求
        https.get(url , function(res){
            func(url, res)
        })
    }
}
//  文件保存函数
function saveTxt(allMsg, txtdir, txt){
    //  文件目录和地址
    const file = txtdir + txt
    const writerStream = fs.createWriteStream(file)
    writerStream.write(allMsg , 'UTF8')
    writerStream.end()
    writerStream.on('finish' , function(){
console.log('---------------文件写入"'+txt+'完成---------------')
    })
    writerStream.on('error' , function(error){
        console.log(error.stack)
    })
    
}
//  图片保存函数
function saveImage($ , imgDir){
    //  获取图片
    $('img.BDE_Image').each(function () {
        const imgNum = Math.random().toString(16).substr(2,8),
        img_file = imgDir + imgNum +'.jpg',img_src = $(this).attr('src') //获取图片的url
        request.head(img_src,function(err,res,body){
            if(err) console.log("error:"+err)
        })
        const writeStream = fs.createWriteStream(img_file), readStream = request(img_src)
        readStream.on('error', function(err) {
            console.log(err)
        })
        readStream.pipe(writeStream)
        readStream.on('end', function(response) {
            console.log("---------------图片[" + imgNum + "]保存成功---------------")
            writeStream.end()
        })
        writeStream.on("finish", function() {
            console.log("ok")
        })
    })
}

function dir(path){
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

function currName(name){
    if( typeof name != 'undefined'){
        return name.replace(/\//g, 'i').replace(/\\/g, 'i').replace(/:/g, 'i')
        .replace(/\*/g, 'i').replace(/\?/g, 'i').replace(/</g, 'i').replace(/>/g, 'i')
        .replace(/"/g, 'i').replace(/\|/g, 'i')
    }else{
        return 'undefined'
    }
}

exports.fetchPage = fetchPage
exports.saveTxt = saveTxt
exports.saveImage = saveImage
exports.dir = dir
exports.currName = currName