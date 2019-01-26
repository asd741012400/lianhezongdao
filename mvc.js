var mvc = require('./nodemvc/express');
var config = require('./js/config');
mvc.init({
	ServerPort:3001,
	Router:{
		default:__dirname
	}
})
mvc.apps(function(){
	this.get('/cmsContentWx',function(req,res){
		mvc.util.get(config.eschoolIP + '/api/cms/content/v0.1/' + req.query.id + '/detail',function(ret){
			ret.errorMsg = ret.id ? '' : '未找到此条新闻';
			res.render('cmsContentWx',ret);
		})
	})
})
mvc.server();