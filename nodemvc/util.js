var https=require("https"),http=require("http");module.exports={get:function(t,e){(0==t.indexOf("https://")?https:http).get(t,function(t){var n="";t.on("data",function(t){n+=t}),t.on("end",function(){e(JSON.parse(n))})})},ajax:function(n,t,e){t="string"==typeof t?t:JSON.stringify(t),n.dataType=n.dataType||"JSON";var o={hostname:n.hostname,port:n.port||443,path:n.path,method:n.method||"POST",headers:n.headers||{"Content-Type":n.contentType||"application/json","Content-Length":t.length,"Accept-Encoding":"utf-8","Accept-Language":"zh-CN,zh;q=0.8"}},a="",p=(443==o.port?https:http).request(o,function(t){t.on("data",function(t){a+=t}),t.on("end",function(){e("JSON"==n.dataType?JSON.parse(a):a)})});p.on("error",function(t){e(null,t)}),p.write(t),p.end()}};