//  nodejs爬虫 贴吧首页 程序，蔡东-UESTC-2017-5-19
var https = require('https');
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');  
var request = require('request');

var imgNum = 0;
var videoNum = 0;

 // 爬虫的目标地址
var url = 'https://tieba.baidu.com/f?ie=utf-8&kw=%E6%89%92%E7%9A%AE&fr=search';

//  封装一层函数
function fetchPage(x){
    var fun = url.split("://")[0];
    if(fun == 'http')
    // 采用http模块向服务器发送一次get请求
    http.get(x , function(res){
          startRequest(x,res);
    });
    else if(fun == 'https')
    // 采用https模块向服务器发送一次get请求
     https.get(x , function(res){
          startRequest(x,res);
    });   
}
    function startRequest(x,res){
            var html = '';  // 用于储存请求的html整个内容
            res.setEncoding('utf-8');   // 防止中文乱码
            res.on('data' , function(data){
                html += data;
            });
            //  收集网页完成，开始处理数据保存
            res.on('end' , function(){
                var $ = cheerio.load(html);  // 采用cheerio 模块解析html
                var allMsg = '';
                var msg = '';
                var tiebaName = $('a.card_title_fname ').text().trim();
                var author =  $(' span.tb_icon_author ').text().trim().split("    ");
                //  目录
                var imgDir = './image/' + tiebaName + '/' ;
                var videoDir = './video/' + tiebaName + '/' ;

                fs.exists(imgDir,function(exists){
                         if(exists){
                              saveImage( $ , tiebaName );
                        }
                         if(!exists){
                               fs.mkdir( imgDir , function(err){
                               if(err) console.error(err);
                               });
console.log("---------------------------------目录["+tiebaName+"]新建完成---------------------------------");
                              saveImage( $ ,tiebaName );
                         }
                    });

                fs.exists(videoDir,function(exists){
                         if(exists){
                              saveVideo( $ , tiebaName );
                        }
                         if(!exists){
                               fs.mkdir( videoDir , function(err){
                               if(err) console.error(err);
                               });
console.log("---------------------------------目录["+tiebaName+"]新建完成---------------------------------");
                              saveVideo( $ , tiebaName );
                         }
                    });

        for(var i=0;i<author.length-1;i++){
                msg = author[i].trim() + ' 发表了 “' + $('a.j_th_tit ').eq(i).text().trim() + 
                           '”    链接：'  + 'https://tieba.baidu.com' + $('a.j_th_tit ').eq(i).attr('href') ;
                console.log(msg);
                allMsg = msg + '\r\n' + allMsg ;
        }

        //  新建txt文件
                var txt = $('a.card_title_fname ').text().trim() + '.txt';
                var writerStream = fs.createWriteStream('./data/'+txt);
                writerStream.write(allMsg , 'UTF8');
                writerStream.end();
                writerStream.on('finish' , function(){
     console.log("-----------------------------------文件写入"+txt+"完成-----------------------------------");
                });
                writerStream.on('error' , function(err){
                    console.log(err.stack);
                });
            }).on('error', function() {
               console.log('error');
            });
}

fetchPage(url);

function saveImage($ , name){
    //  获取图片
         $(' img.threadlist_pic ').each(function () {
               var img_file = "./image/" + name + '/'+ imgNum +'.jpg';
               var img_src = "https://" + $(this).attr('bpic').split("//")[1]; //获取图片的url
               
               request.head(img_src,function(err,res,body){
              if(err) console.log("error:"+err);
        });
        request(img_src).pipe(fs.createWriteStream( img_file) );
        console.log("---------------图片[" + imgNum + "]保存成功");
            imgNum ++;
            });
}

function saveVideo($ , name){
//  获取视频
         $('div.video_list_container').each(function(){
                    var videoSrc = $(this).attr('data-video').split(".mp4")[0] + ".mp4";
                    var file = './video/' + name + '/'+  videoNum + '.mp4';
                    console.log(videoSrc);
                request.head(videoSrc , function(err){
                    if(err) console.log("error:"+err);
                });
                request(videoSrc).pipe(fs.createWriteStream(file) );
                console.log('---------------视频['+videoNum+']下载完成');
                videoNum ++;
                });
}

