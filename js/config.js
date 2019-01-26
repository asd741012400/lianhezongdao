(function(a){
    var http = window.location.protocol;
    a.eschoolIP = http + /*"//192.168.1.167:8848"*/"//192.168.1.100:9119";//(eschool)
    a.ucIP = http + /*"//27.15.219.95:8089"*/"//192.168.1.100:9110"; //(uc)
    a.csIP = http + "//192.168.1.100:9113";//(cs)
    a.bpmIP = http + "//192.168.1.100:9133";//(bpm)
    a.sdayIP = http + "//192.168.1.100:9131";//动态
    a.pushIP = http + "//192.168.1.100:9130";//(push)
    a.httpIp = http + "//192.168.1.147";
    /*a.eschoolIP = http + "//eschool.veducloud.com"; //(eschoolIP)
    a.ucIP = http + "//uc.veducloud.com"; //(uc)
    a.csIP = http + "//cs.veducloud.com";//(cs)
    a.bpmIP = http + "//bpm.veducloud.com";//(bpm)
    a.sdayIP = http + "//sday.veducloud.com";//动态
    a.pushIP = http + "//119.23.39.22:8130";//(push)*/
    a.dataDic = {
        years:[2016,2017,2018],
        months:['2017-11','2017-12','2018-01','2018-03','2018-04'],
        weeks:['1','2','3','4','5','6'],
        depts:['全部','校办公室','教务处','财务部','后勤部'],
        sections:['2018秋季', '2018春季', '2017秋季', '2017春季']
    }
    a.version = "2.1.0";
    try{
        if(Y && !Y.getBlobURL){
            var ngixIP = http + "//" + location.host;
            a.eschoolIP = ngixIP + "/eschool";//(eschool)
            a.ucIP = ngixIP + "/uc"; //(uc)
            a.csIP = ngixIP + "/cs";//(cs)
            a.bpmIP = ngixIP + "/bpm";//(bpm)
            a.sdayIP = ngixIP + "/sday";//(bpm)
            a.pushIP = ngixIP + "/push";//(push)
        }
    }catch(e){}
})(typeof module == 'object' ? module.exports : window)