var $=require("./tool"),log=require("./log"),DB=require("./DB");module.exports=function(u){new Promise(function(e,n){log("开始初始化..."),DB._eval("db.dropDatabase()",function(n){log("清空数据库成功"),e()})}).then(function(){Promise.all([new Promise(function(e,n){DB.jsSave("find",function(n,r,a){r=r||{},a=a||{};var e=db.getCollection(n).find(a.query||{},a.projection||{});a.sort&&e.sort(a.sort),a.limit&&e.limit(a.limit),a.skip&&e.skip(a.skip);var u=[];return(e=e.toArray()).forEach(function(n,e){var o=!0;for(var i in r)if(r[i].name){var t=r[i].query||{};t.id=n[i],1==(t=db.getCollection(r[i].name).find(t,r[i].projection||{})).count()?n[i]=t.toArray()[0]:a.unEmty&&(o=!1)}o&&u.push(n)}),u},function(n){log("创建find函数成功"),e()})}),new Promise(function(e,n){DB.jsSave("list",function(n,r,a){var e;r=r||{},(a=a||{}).pageSize=a.pageSize||10,a.pageNum=a.pageNum||1;var o={state:{$ne:-1}};for(var i in a.query)"pageSize"!=i&&"pageNum"!=i&&(o[i]=a.query[i]);var t=db.getCollection(n).find(o,a.projection||{});e=t.count(),a.sort&&t.sort(a.sort),t.limit(a.pageSize*a.pageNum),t.skip(a.pageSize*(a.pageNum-1));var u=[];return(t=t.toArray()).forEach(function(n,e){var o=!0;for(var i in r)if(r[i].name){var t=r[i].query||{};t.id=n[i],1==(t=db.getCollection(r[i].name).find(t,r[i].projection||{})).count()?n[i]=t.toArray()[0]:a.unEmty&&(o=!1)}o&&u.push(n)}),{rows:t,total:e,pageNum:a.pageNum,pageSize:a.pageSize}},function(n){log("创建list函数成功"),e()})})]).then(function(){Promise.all([new Promise(function(e,n){u.user.insert({userName:"admin",passWord:$.MD5("123"),nickName:"超级管理员"},function(n){n.result?(log("超级管理员账号创建成功"),e(n.data)):(log("超级管理员账号创建失败!"),log(n))})}),new Promise(function(e,n){u.classify.insert({name:Config.CompanyName||"Xxx公司",type:"group",sort:1,img:"",url:"",parentId:0,level:1,editAble:0},function(n){n.result?(log((Config.CompanyName||"Xxx公司")+"创建成功"),e(n.data)):(log((Config.CompanyName||"Xxx公司")+"创建失败"),log(n))})})]).then(function(o){return new Promise(function(e,n){u.group_user.insert({groupId:o[1],userId:o[0]},function(n){log("超级管理员用户关联群组成功"),e(o[1])})})}).then(function(a){return new Promise(function(n,e){for(var i=Config.InitMenu,t=i.length,r=[],o=0;o<i.length;o++)!function(o){i[o].type="manageMenu",i[o].parentId=0,i[o].level=1,i[o].editAble=0,i[o].sort=t,t--,r[o]=new Promise(function(e,n){u.classify.insert(i[o],function(n){n.result&&u.group_menu.insert({groupId:a,menuId:n.data},function(n){n.result&&log("创建后台菜单 "+i[o].name+" 成功"),e()})})})}(o);Promise.all(r).then(function(){n()})})}).then(function(){log("初始化完成!!!")})})})};