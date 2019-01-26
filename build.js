var fs = require('fs'),path = require('path');
var config = {
	id:new Date().getTime()
}
function version(page){
	var data = fs.readFileSync(__dirname + page).toString();
	for(var key in config) data = data.replace(new RegExp(key + '.*__','g'),key + '=' + config[key] + '__');
	fs.writeFileSync(__dirname + page,data);
	console.log(page + '----------OK');
}
version('/index.html');
version('/login.html');