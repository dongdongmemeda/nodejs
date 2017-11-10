//  nodejs爬虫 贴吧首页 程序，蔡东-UESTC-2017-11-9
const fs = require('fs'), request = require('request')
//  文件保存函数
function saveTxt(allMsg, txtdir, txt){
    //  文件目录和地址
    const file = txtdir + txt
    fs.access( file ,function(err){
        if(err){
            if (err.code == 'EEXIST') {
                const newMsg = fs.readFileSync(file).toString()
                allMsg = newMsg + allMsg
            }
        }
        const writerStream = fs.createWriteStream(file)
        writerStream.write(allMsg , 'UTF8')
        writerStream.end()
        writerStream.on('finish' , function(){
    console.log('------------------------------文件写入"'+txt+'完成------------------------------')
        })
        writerStream.on('error' , function(error){
            console.log(error.stack)
        })
    })
}
//  图片保存函数
function saveImage($ , imgDir, imgNum){
    //  获取图片
    $('img.BDE_Image').each(function () {
        const img_file = imgDir + imgNum +'.jpg',
            img_src = $(this).attr('src') //获取图片的url
        request.head(img_src,function(err,res,body){
            if(err) console.log("error:"+err)
        })
        fs.createWriteStream(img_file)
        request(img_src).pipe(fs.createWriteStream(img_file) )
        imgNum ++
        console.log("---------------图片[" + imgNum + "]保存成功---------------")
    })
}

function dir(path){
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

function currName(name){
    return name.replace(/\//g, 'i').replace(/\\/g, 'i').replace(/:/g, 'i')
    .replace(/\*/g, 'i').replace(/\?/g, 'i').replace(/</g, 'i').replace(/>/g, 'i')
    .replace(/"/g, 'i').replace(/\|/g, 'i')
}

exports.saveTxt = saveTxt
exports.saveImage = saveImage
exports.dir = dir
exports.currName = currName