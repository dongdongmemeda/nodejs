//  nodejs爬虫 帖子只看楼主内容 程序，蔡东-UESTC-2017-5-19
var https = require('https');
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');  
var request = require('request');

var txtNum = 0;
var imgNum = 0;
var webPage = 1;
var author = '';
 // 爬虫的目标地址
var url = 'https://tieba.baidu.com/p/5121856967' + '?see_lz=1&pn=' + '1';
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
                var page = $('li.l_reply_num span.red').eq(1).text().trim();
                 var msg = '';
                var tiebaName = $('div.card_title  a.card_title_fname').text().trim();
                author =  $('div.louzhubiaoshi_wrap div.louzhubiaoshi').eq(0).attr('author');
                var tieziName = '';
                var t = $('h3.core_title_txt ').text().trim().split("【图片】");
                if(t.length > 1){
                  var re = t[1].split("回复：");
                  if(re.length > 1)
                    tieziName = re[1] + '---' + author + '--' + tiebaName;
                  else if(re.length <= 1)
                    tieziName = re[0] + '---' + author + '--' + tiebaName;
                }
                else if(t.length <= 1){
                  var re = t[0].split("回复：");
                  if(re.length > 1)
                    tieziName = re[1] + '---' + author + '--' + tiebaName;
                  else if(re.length <= 1)
                    tieziName = re[0] + '---' + author + '--' + tiebaName;
                  }
                  
                var sayContent = $('cc div.j_d_post_content').text().trim().split("            ");  // 12空格
                //  目录
                var imgDir = './louzhu_image/' + tieziName + '/' ;
                
                fs.exists(imgDir,function(exists){
                         if(exists){
                              saveImage( $ , tieziName);
                        }
                         if(!exists){
                               fs.mkdir( imgDir , function(err){
                               if(err) console.error(err);
                               });
console.log("---------------------------------目录["+tieziName+"]新建完成---------------------------------");
                              saveImage( $ , tieziName);
                         }
                    });

                var allMsg = '';
        for(var i=sayContent.length-1;i>=0;i--){
                var sayPeople = $('li.d_name a.j_user_card ').eq(i).text().trim();
                msg = sayContent[i] + '-----' + sayPeople + '-----' + txtNum + '楼';
                console.log(msg);
                allMsg = allMsg + '\r\n' +  msg;
                txtNum ++;
        }
        //  新建txt文件
                var txt = tieziName + '.txt';
                var file = './louzhu/'+txt ;
                fs.exists( file ,function(exists){
                         if(exists){
                            var newMsg = fs.readFileSync(file).toString();
                            allMsg = newMsg + allMsg ;
                            var writerStream = fs.createWriteStream(file); 
                             writerStream.write(allMsg , 'UTF8');
                             writerStream.end();
                             writerStream.on('finish' , function(){
     console.log('------------------------------文件写入"'+txt+'"完成------------------------------');
                             });
                             writerStream.on('error' , function(err){
                              console.log(err.stack);
                              });
                         }
                         if(!exists){
                             var writerStream = fs.createWriteStream(file); 
                             writerStream.write(allMsg , 'UTF8');
                             writerStream.end();
                             writerStream.on('finish' , function(){
     console.log('------------------------------文件写入"'+txt+'完成------------------------------');
                             });
                             writerStream.on('error' , function(err){
                              console.log(err.stack);
                              });
                         }
                });
      
      //  程序自动翻页
      webPage ++;
      var nextUrl = url.split('?see_lz=1&pn=')[0] + '?see_lz=1&pn=' + webPage; 
      if (webPage <= page) {                
                fetchPage(nextUrl);
            }
                
            }).on('error', function() {
               console.log('error');
            });
}

fetchPage(url);

function saveImage($ , name){
    //  获取图片
         $(' img.BDE_Image ').each(function () {
               var img_file = "./tieba_image/" + name + '/'+ imgNum +'.jpg';
               var img_src = "https://" + $(this).attr('src').split("//")[1]; //获取图片的url
               console.log("---------------图片[" + imgNum + "]保存成功");
               request.head(img_src,function(err,res,body){
              if(err) console.log("error:"+err);
        });
            request(img_src).pipe(fs.createWriteStream( img_file) );
            imgNum ++;
            });
}
