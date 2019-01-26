var express=require("express"),bodyParser=require("body-parser"),session=require("express-session"),cookieParser=require("cookie-parser"),rf=require("fs"),ejs=require("ejs"),app=express();require("body-parser-xml")(bodyParser),app.use(bodyParser.json()),app.use(cookieParser());var Model,models={};module.exports={$:require("./tool"),util:require("./util"),init:function(e,o){global.Config=e,Model=require("./Model"),o=o||[{},{}],this.setModel(o[0],o[1]),this.log=require("./log")},models:function(){return models},setModel:function(e,o){for(var r in this.$.equal(e,require("./models_base")),models.models={},models.config=o,e)o[r]&&o[r].front&&(models.models[r]=e[r]),o[r]&&o[r].groupId&&(e[r].groupId={rule:{NotNull:!0},label:"所属部门"}),models[r]=new Model(r,e[r])},reDB:function(){require("./init_base")(models)},apps:function(e){e.call(app)},server:function(){var e=Config.Router;app.set("views",Config.views||"./template"),app.set("view engine",Config.viewEngine||"ejs"),app.use(bodyParser.xml({limit:"1MB",xmlParseOptions:{normalize:!0,normalizeTags:!0,explicitArray:!1}})),Config.AccessControlAllow=Config.AccessControlAllow||{},app.all("*",function(e,o,r){o.header("Access-Control-Allow-Origin",Config.AccessControlAllow.Origin||"*"),o.header("Access-Control-Allow-Methods",Config.AccessControlAllow.Methods||"PUT, GET, POST, DELETE, OPTIONS"),o.header("Access-Control-Allow-Headers",(Config.AccessControlAllow.Headers||"")+"Content-Type,token,groupId"),r()}),app.route("/models").get(function(e,o){o.send({result:!0,data:models.models})});var o=function(e,o,r){var s,a,n;models.config[e.params.modelName].front?e.params.modelName&&models[e.params.modelName]?models.config[e.params.modelName].login?(a=o,n=r,(s=e).headers.token?models.session.find({id:s.headers.token},function(e){e.result&&e.data&&!e.data[0].outTime&&new Date-e.data[0].inTime<=72e6?n():a.send({errorMsg:"token失效",result:!1})}):a.send({errorMsg:"无token",result:!1})):r():o.status(404).send({errorMsg:"Can not find model "+e.params.modelName}):o.send({result:!1,errorMsg:"The model is not find"})};for(var r in app.route("/model/:modelName").get(o,function(e,o){var r=e.query||{},s=e.query.args||{};delete r.args,delete r._,e.query.pageNum&&e.query.pageSize?(models.config[e.params.modelName].groupId&&(r.groupId=e.headers.groupid),s.query=r,models[e.params.modelName].list(s,function(e){o.send(e)})):models[e.params.modelName].find(r,function(e){e.result?o.send(e.data[0]):o.send(e)},s)}).post(o,function(e,o){models.config[e.params.modelName].groupId&&(e.body.groupId=e.headers.groupid),models[e.params.modelName].insert(e.body,function(e){o.send(e)},e.query.args)}).put(o,function(e,o){models[e.params.modelName].update({id:e.body.id},e.body,function(e){o.send(e)},e.query.args)}).delete(o,function(e,o){models.config[e.params.modelName].groupId&&(e.query.groupId=e.headers.groupid),models[e.params.modelName].remove(e.query,function(e){o.send(e)},e.query.args)}),e)"default"==r?app.use("/",express.static(e[r])):(e[r].html&&app.use("/"+r,express.static(e[r].html)),e[r].server&&app.use("/"+r,require(e[r].server)));app.use(function(e,o,r,s){console.error(e.stack),r.status(500).send({result:!1,errorMsg:"Something broke!"})});var s=app.listen(Config.ServerPort,function(){var e=s.address().address,o=s.address().port;console.log("Example app listening at http://%s:%s",e,o)})}};