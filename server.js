var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var path = request.url 
  var query = ''
  if(path.indexOf('?') >= 0){ query = path.substring(path.indexOf('?')) }
  var pathNoQuery = parsedUrl.pathname
  var queryObject = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/













  if(path == '/uptoken'){
    response.statusCode = 200
    response.setHeader('Content-Type','text/html; charset=utf-8') //响应第二部分声明类型和字符集
    response.setHeader('Access-Control-Allow-Origin','*')
    var string = fs.readFileSync('./qiniu-config.json') //字符串
    config = JSON.parse(string)
    let {accessKey,secretKey} = config
    var mac = new qiniu.auth.digest.Mac(accessKey,secretKey);
    var options = {
      scope: '163-music',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    response.write(`{
      "uptoken":"${uploadToken}"
    }
    `)
    response.end()//结尾非常重要，否则会一直等待！
  }else{
    response.statusCode = 404 //当访问其他的网页地址时候响应404
    response.setHeader('Content-Type','text/html; charset=utf-8')
    response.write('上传失败')
    response.end()
  }




  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)


