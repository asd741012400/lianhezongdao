var accessToken;
var schoolId;
var accountId;
var schoolInfo;
var schoolActive;
var groupId;
var groupInfo;
(function () {
    //获取登录信息
    var user = Y.User.Get();
    if (!user) {
        Y.alertx('请登录');
        location = "login.html";
    }else{
        accessToken = user.accessToken;
        accountId = user.accountId;
        schoolInfo = user.schoolInfo;
        accountType = user.accountType;
        $("#accountName").html(decodeURIComponent(user.accountName));
        if(user.accountPhoto){
            var accountPhoto = new Image();
            accountPhoto.onload = function(){
                $("#accountPhoto").html(accountPhoto);
            };
            accountPhoto.src = user.accountPhoto;
        }
        var defaultSchoolId = Y.User.Get("schoolId");//浏览器缓存选择的学校
        var useDefaultSchoolId = false;
        if(schoolInfo.length > 1){
            $('#logo_text,#logo_img').show();
            var _schoolInfo = {all:[]};
            _schoolInfo.all.name = '全部';
            _schoolInfo.all._areaName = 'all';
            for(var i = 0; i < schoolInfo.length; i ++){
                var _areaName = MD5(schoolInfo[i].areaName);
                if(_schoolInfo[_areaName]) {
                    _schoolInfo[_areaName].push(schoolInfo[i]);
                }else{
                    _schoolInfo[_areaName] = [schoolInfo[i]];
                    _schoolInfo[_areaName].name = schoolInfo[i].areaName;
                    _schoolInfo[_areaName]._areaName = _areaName;
                }
                _schoolInfo.all.push(schoolInfo[i]);
                if(defaultSchoolId == schoolInfo[i].schoolId){
                    useDefaultSchoolId = true;
                    $("#schoolName").html(schoolInfo[i].schoolName);
                }
            }

            var areaDiv = '<div style="width:110px;text-align:center;overflow:hidden;height:268px;float:left;margin-right:10px;"><div style="height:37px;color:#59a9e1;font-size:16px;line-height:37px;padding-left:10px;border-bottom: 1px solid #eeeeee;">地区</div><div style="width:127px;overflow:scroll;height:247px;background:#f7f7f7;">';
            for(var key in _schoolInfo) areaDiv += '<div class="schoolArea' + (_schoolInfo[key]._areaName == 'all' ? ' schoolAreaActive' : '') + '" m="' + _schoolInfo[key]._areaName + '">' + _schoolInfo[key].name + '</div>';
            areaDiv += '</div></div>';
            $('#schoolName').click(function(){
                var w = Y.confirmx('<div style="text-align:left;">' + areaDiv + '<div style="margin-left:110px;"><div style="height:37px;color:#59a9e1;font-size:16px;line-height:37px;padding-left:10px;border-bottom: 1px solid #eeeeee;">学校</div><div id="schoolAreaContent" style="margin-left:10px;"></div></div><div class="clear"></div></div>',function(){
                    /*changeSchool(school.schoolId,schoolId);
                    $("#schoolName").html(school.schoolName);*/
                },{title:'选择学校',_w:560,_h:310,initFn:function(){
                    $('.schoolArea').click(function(i){
                        change(_schoolInfo[$(this).attr('m')]);
                        $('.schoolAreaActive').removeClass('schoolAreaActive');
                        $(this).addClass('schoolAreaActive');
                    })
                    change(_schoolInfo.all);
                    function change(data){
                        var rc = '';
                        for(var i = 0; i < data.length; i ++) rc += '<span class="schoolContent' + (data[i].schoolId == schoolId ? ' schoolContentActive' : '') + '">' + data[i].schoolName + '</span>';
                        $('#schoolAreaContent').html(rc);
                        $('.schoolContent').each(function(i){
                            $(this).click(function(){
                                $('.schoolContent').removeClass('schoolContentActive');
                                $(this).addClass('schoolContentActive');
                                changeSchool(data[i].schoolId,schoolId);
                                schoolActive = data[i];
                                $("#schoolName").html(data[i].schoolName);
                                w.close();
                            })
                        })
                    }
                },noBtns:true,style:'@keyframes selectSchool{from {transform:scale(0.1,0.1);opacity:0.2;margin-left:500px;margin-top:-300px;} to {transform:scale(1,1);opacity:1;margin-left:0px;margin-top:-0px;}}',styles:{
                    box:'animation: selectSchool 0.2s;',
                    top:'height:50px; line-height: 50px; background:#fff;',
                    top_title:'margin-left:240px;font-size:18px;color:#757575;font-weight:normal;',
                    close:'border:1px solid #c4c4cb;color:#c4c4cb;border-radius:18px;padding:0px 3px;'
                }});
            })
        }else{
            $("#schoolName").css({background:"none",paddingRight: "0px"});
            if(schoolInfo.length == 1){
                //$("#schoolName").hide();
                if(schoolInfo[0].schoolLogoB){
                    $('#logo_text').hide();
                    $("#logo_imgB").show();
                    $("#logo_imgB").attr("src",schoolInfo[0].schoolLogoB);
                }else{
                    $('#logo_text,#logo_img').show();
                    $("#logo_imgB").hide();
                    $("#logo_text").html(schoolInfo[0].schoolName);
                    /*var img = new Image();
                    img.onload = function(){
                        $("#logo_img").attr("src",schoolInfo[0].schoolLogo);
                    }
                    img.src = schoolInfo[0].schoolLogo;*/
                }
            }else{
                $('#logo_text,#logo_img').show();
            }
        }
        //管理员始终显示默认logo
        if (accountType == '6') {
            $('#logo_text,#logo_img').show();
            $("#logo_imgB").hide();
        };

        var logoLen = $("#logo_text").html().length;
        var logoPx = 24/logoLen + 20;
        var schoolId0 = schoolInfo.length == 0?0:schoolInfo[0].schoolId;
        var schoolName0 = schoolInfo.length == 0?"暂无学校":schoolInfo[0].schoolName;
        $("#logo_text").css("font-size",logoPx+"px");

        if(useDefaultSchoolId && defaultSchoolId != undefined){
            for(var i = 0; i < schoolInfo.length; i ++) if(schoolInfo[i].schoolId == defaultSchoolId) schoolActive = schoolInfo[i];
            changeSchool(defaultSchoolId);
        }else{
            changeSchool(schoolId0);
            schoolActive = schoolInfo[0];
        }
    }
    function changeSchool(n,_n){
        Y.User.Update("schoolId",n);
        schoolId = n;
        Y.Storage.set('ajaxHeader',[{key:"accessToken",vaule:accessToken},{key:"schoolId",vaule:schoolId}]);
        if(schoolInfo.length <= 1 || !useDefaultSchoolId) $("#schoolName").html(schoolName0);
        groupInfo = [];
        Y.configGeted = false;
        //获取group
        Y.ajax(ucIP + "/api/uc/v0.1/group/role/user/" + user.accountId + "/roles",function(res){
            groupInfo = res;
            if (res) {
                if(res.length > 0){
                    var defaultGroupId = Y.User.Get("groupId");//浏览器缓存选择的角色
                    var useDefaultGroupId = false;
                    if(res.length > 0){
                        var groupInfoHtml = "";
                        for(var i = 0; i < res.length; i++){
                            if(res[i].id == defaultGroupId) useDefaultGroupId = true;
                            //groupInfoHtml += "<div class='adminMsg_div_Line_dashed'></div>";
                            groupInfoHtml += "<div class='groupDiv' groupId=\"" + res[i].id + "\">" + res[i].name + "</div>";
                        }
                        groupInfoHtml += "";
                        $("#groups").html(groupInfoHtml);
                        $(".groupDiv").click(function(){
                            if(sessionStorage && sessionStorage.menusActive) sessionStorage.menusActive = '';
                            changeGroup($(this).attr("groupId"),groupId);
                        })
                    }
                    if(useDefaultGroupId && defaultGroupId != undefined) {
                        changeGroup(defaultGroupId);
                    }else{
                        changeGroup(res[0].id);
                    }
                }else{
                    Y.alertx("用户权限获取失败",function(){
                        Y.User.Del();
                        location = "login.html";
                    })
                }
            } else {
                Y.alertx("用户权限获取失败",function(){
                    if(_n != undefined) {
                        changeSchool(_n);
                    }else{
                        Y.User.Del();
                        location = "login.html";
                    }
                });
            }
        })
    }
    var openPaga = Y.getParam("paga");
    var menuActive = [];
    var leftWidth = sessionStorage && sessionStorage.leftWidth ? sessionStorage.leftWidth : 275; //50 || 275//左菜单宽带+
    var isLeftChange = false;
    var openFrist = true;
    function changeGroup(n,_n){
        Y.User.Update("groupId",n);
        groupId = n;
        $(".groupDiv").each(function(){
            if($(this).attr("groupId") == n){
                $(this).addClass("active");
                completeName($(this).html());
            }else{
                $(this).removeClass("active");
            }
        })
        function completeName(groupHTML){
            var nameHTML = $("#accountName").html().replace(/\s*/g,"");
            $("#groupName").html(groupHTML);
            if(nameHTML.length < groupHTML.length){
                var len = groupHTML.length - nameHTML.length;
                for(var i = 0; i < len; i++){
                    nameHTML += "　";
                }
            }
            $("#accountName").html(nameHTML);
        }
        openFrist = true;
        ajaxMenu(_n);
    }
    //鼠标移动显示个人信息
    var adminMsgTimer;
    $("#accountPhoto").mouseover(function(){
        if(adminMsgTimer) clearTimeout(adminMsgTimer);
        $(".adminMsg").addClass('adminMsgShow');
    })
    $("#accountPhoto").mouseout(function(){
        adminMsgTimer = setTimeout(function(){
            $(".adminMsg").removeClass('adminMsgShow');
        },500)
    })
    $(".adminMsg").mouseover(function(){
        clearTimeout(adminMsgTimer);
    })
    $(".adminMsg").mouseout(function(){
        adminMsgTimer = setTimeout(function(){
            $(".adminMsg").removeClass('adminMsgShow');
        },500)
    })
    //退出系统
    $("#loginOutBtn").click(function () {
        Y.confirmx("退出系统？",function(){
            Y.ajax(ucIP + "/api/uc/v0.1/loginout",function(res){
                Y.alertx("退出成功");
                Y.User.Del();
                location = "login.html";
            })
        })
    });
    $("#yunFileBtn").click(function () {
        Y.open({url: "yunFile.html", title: "个人云盘", data: {}});
        $(this).parent().addClass("adminDivActive");
    });
    $("#deskTopBtn").click(function () {
        Y.open({url: "deskTop.html", title: "我的桌面", data: {}});
        $(this).parent().addClass("adminDivActive");
    });
    function adminWindow(){
        for(var i = 0; i < arguments.length; i++){
            arguments[i][0].timer = 0;
            arguments[i].mouseover(function(){
                if($(this)[0].timer) clearTimeout($(this)[0].timer);
                windowShow($(this).next(),$(this));
            })
            arguments[i].mouseout(function(){
                var _this = $(this);
                $(this)[0].timer = setTimeout(function(){
                    _this.next().hide();
                },500);
            })
            arguments[i].next().mouseover(function(){
                clearTimeout($(this).prev()[0].timer);
            })
            arguments[i].next().mouseout(function(){
                var _this = $(this);
                $(this).prev()[0].timer = setTimeout(function(){
                    _this.hide();
                },500);
            })
        }
        function windowShow(w,_w){
            var left = _w.offset().left;
            var top = _w.offset().top + _w.height() + 20;
            if(_w.width() > w.width()){
                left += _w.width() - w.width();
            }else{
                left -= w.width() - _w.width();
            }
            left += 30;
            w.css({display:'block',left:left + "px",top:top + "px"});
            w.find(".adminWindow_t").css({marginLeft:(w.width() - 28) + "px"});
        }
    }
    //菜单
    var menuTree = new Y.TreeModel($("#headMenus"));
    menuTree.levelMax = 3;
    menuTree.editable = false;
    var defaultPaga = false;
    menuTree.errorFn = function(id,pid,obj,clickData,n,res){//出错返回
        if(n == 0) location.href = "login.html";
    }
    menuTree.loadFn = function(id,pid,obj,clickData,n){
        Y.User.Btns(clickData)
        var ac = [],menusActive = sessionStorage && sessionStorage.menusActive ? sessionStorage.menusActive.split("_") : menuActive;
        var isChange = false;
        for(var i = 0; i < menuTree.active.length; i ++){
            if(isChange){
                menusActive.length = i;
                break;
            }else{
                if(menuTree.active[i] && menusActive[i] != menuTree.active[i].flog) {
                    menusActive[i] = menuTree.active[i].flog;
                    isChange = true;
                }
            }
        }
        if(sessionStorage) sessionStorage.menusActive = menusActive.join("_");
        if(n == 0){
            if(false){
                $("#pagaCover").html("<span style='font-size:16px;'>非常抱歉，不支持的浏览器。建议您使用以下浏览器进行访问:</span><br />(如果使用的360浏览器请切换到-'极速模式')<br /><a href='https://www.baidu.com/link?url=zTiKuPJw9PkQBp0lBEbhPa8DvwFRS9ravpbdX6G-E-PRaIa2rloc9e1ACo8tx2i7fS1ezly3eC4yiLmJld6GYgglrn1kGjv_QXYxESzGWEW&wd=&eqid=f292cadc000088af0000000258451895' target='_blank'>谷歌浏览器最新版</a><a style='margin-left:20px;' href='https://www.baidu.com/link?url=lMtnv0RjwknaaOGN7vhEo7Mh8h2YuojoTL-LkvVVnJxoTPPVvrQeHXAMHLZpUyKM5zCP4h4gVQnT7h9xjPsuxv4YOxOttk4mJVZvsMLVUsK&wd=&eqid=c730d2fe0001080800000002584518d3' target='_blank' >火狐浏览器最新版</a><br /><span id='goAgin' style='text-decoration: underline;cursor: pointer;'>继续访问</span>");
                $("#goAgin").click(function(){
                    Y.confirmx("部分浏览内容无法正常显示，是否继续?",function(){
                        if(!isLeftChange){
                            $("#pagaCover").remove();
                            $("#pagaBody").css({display:"block",opacity:0});
                            $("#pagaBody").animate({opacity:1},1000);
                        }
                        menuTree.clickFn(n,menusActive[n] ? menusActive[n] : 0);
                    })
                })
            }else{
                if(!isLeftChange){
                    $("#pagaCover").remove();
                    $("#pagaBody").css({display:"block",opacity:0});
                    $("#pagaBody").animate({opacity:1},1000);
                }
                if(menuTree.data.num0.length > 0) {
                    menuTree.clickFn(n,menusActive[n] ? menusActive[n] : 0);
                }else{
                    $('#menu_box,#right').html('');
                }
            }
        }else if(n == 1){
            $("#leftTop").html(clickData.title);
            menuTree.clickFn(n,menusActive[n] ? menusActive[n] : 0);
        }else{
            if(clickData.action){
                if(leftWidth < 100){
                    menuTree.active[n - 1].obj.unbind("click");
                    menuTree.active[n - 1].obj.bind("click",function(){
                        Y.open({url: clickData.action, title: clickData.title});
                    })
                }
                if(openFrist){
                    if(openPaga){
                        Y.open({url: openPaga, title: Y.getParam("title")});
                        openPaga = "";
                    }else{
                        Y.open({url: 'modules/beOnDuty/beOnDutyManagementDetailedSetting.html', title: clickData.title});
                        // Y.open({url: clickData.action, title: clickData.title});
                    }
                    openFrist = false;
                }else{
                    if(leftWidth > 100 && !isLeftChange){
                        Y.open({url: clickData.action, title: clickData.title});
                    }
                }
            }else{
                if(!isLeftChange) menuTree.clickFn(n,menusActive[n] ? menusActive[n] : 0);
                if(n == 2 && leftWidth < 100){
                    var timer;
                    var mouseover = menuTree.active[1].obj,mouseout = menuTree.active[1].childBox,binded = mouseover.attr("isbind");
                    if(!binded){
                        mouseover.attr("isbind","true");
                        mouseover.mouseover(function(){
                            if(timer) clearTimeout(timer);
                            mouseout.show();
                        })
                        mouseover.mouseout(function(){
                            timer = setTimeout(function(){
                                mouseout.hide();
                            },500)
                        })
                    }
                }
            }
            isLeftChange = false;
        }
    }
    menuTree.dataModel = {
        id:{primary:true},
        name:{},
        url:{}
    };
    var menuImages = {};
    menuTree.levelConfig = [{
        url:eschoolIP + "/api/security/v0.1/groups/" + groupId + "/menus",
        meth:"GET",
        idKey:"id",
        pidKey:"parentId",
        req:{parentId:0},
        res:{
            obj:$("#headMenus"),
            clickBox:"headMenuSpan",
            defaultClickFn:function(clickData){
                if(clickData.action){
                    var action = clickData.action;
                    if(clickData.action == '{szhxy}' && schoolActive && schoolActive.szhxy) action = schoolActive.szhxy + '?accessToken=' + accessToken
                    window.open(action,'_blank');
                }else{
                    return true;
                }
            },
            activeClass:"headMenuActive",
            childBox:"",
            html:"<span class='headMenu'><span class='headMenuSpan'><img src='{icon}' />{title}</span></span>",
            style:""
        }
    },{
        url:eschoolIP + "/api/security/v0.1/groups/" + groupId + "/menus",
        meth:"GET",
        idKey:"id",
        pidKey:"parentId",
        req:{parentId:0},
        res:{
            obj:$("#menu_box"),
            icon:["menu_arrow","images/arrow.png","images/arrow_active.png"],
            clickBox:"menu_1_box",
            activeClass:"menu_1_active",
            clickActiveClass:true,
            childBox:"menu_1_children",
            childBoxOnly:true,
            clickFn:function(active){
                if(active[1]){
                    var img = active[1].obj.find(".menu_1_img img").eq(0);
                    img.attr("src",menuImages["_" + active[1].id]);
                    active[1].obj.find(".menu_arrow").eq(0).attr("src","images/arrow.png");
                }
            },
            html:"<div class='menu_1' title='{title}'><div class='menu_1_box'><span class='menu_1_img'><img src='{icon}' /></span><font class='menu_1_font'>{title}</font></div>{action_menu_arrow}<div class='menu_1_children'></div></div>",
            htmlEval:function(s,k,v){
                return s.replace(new RegExp("{" + k + "_menu_arrow}","g"),function(){
                    return !v ? "<img class='menu_arrow' src='images/arrow.png' />" : "";
                })
            },
            style:""
        }
    },{
        url:eschoolIP + "/api/security/v0.1/groups/" + groupId + "/menus",
        meth:"GET",
        idKey:"id",
        pidKey:"parentId",
        req:{parentId:0},
        res:{
            clickBox:"menu_2_box",
            activeClass:"menu_2_active",
            childBox:"",
            endFn:function(active){
                var img = active[1].obj.find(".menu_1_img img").eq(0);
                if(!menuImages["_" + active[1].id]) menuImages["_" + active[1].id] = img.attr("src");
                var src = menuImages["_" + active[1].id].split(".");
                src = src[0] + "_active." + src[1];
                img.attr("src",src);
            },
            html:"<div class='menu_2' title='{title}'><div class='menu_2_box'><font class='menu_2_font'>{title}</font></div></div>",
            style:""
        }
    }];
    function ajaxMenu(_n){
        menuTree.levelConfig[0].url = menuTree.levelConfig[1].url = menuTree.levelConfig[2].url = eschoolIP + "/api/security/v0.1/groups/" + groupId + "/menus";
        //if(!isLeftChange) menuTree.data = {};
        Y.ajax(eschoolIP + '/api/security/v0.1/menus',function(ret){
            if((schoolId == 2 && accountId == '4504032352466568')){
                ret=ret.concat([
                    {action: "", icon: "images/dataAImg.png", id: 321, isleaf: 0, parentId: 0, sort: 4000001, title: "大数据分析"},
                    {action: "modules/dataAnalyze/jskq/index.html", icon: "images/dataAImg1.png", id: 3212, isleaf: 0, parentId: 321, sort: 4000002, title: "教师考勤统计分析"},
                    {action: "modules/dataAnalyze/xsqj/index.html", icon: "images/dataAImg2.png", id: 3214, isleaf: 0, parentId: 321, sort: 4000002, title: "学生请假统计分析"},
                    {action: "modules/dataAnalyze/qsxc/index.html", icon: "images/dataAImg3.png", id: 3215, isleaf: 0, parentId: 321, sort: 4000002, title: "寝室巡查数据分析"},
                    {action: "modules/dataAnalyze/ktjl/index.html", icon: "images/dataAImg4.png", id: 3216, isleaf: 0, parentId: 321, sort: 4000002, title: "课堂纪律数据分析"},
                    {action: "modules/dataAnalyze/zstj/index.html", icon: "images/dataAImg5.png", id: 3217, isleaf: 0, parentId: 321, sort: 4000002, title: "招生数据分析"},
                    {action: "modules/dataAnalyze/dgsx/index.html", icon: "images/dataAImg6.png", id: 3218, isleaf: 0, parentId: 321, sort: 4000002, title: "顶岗实习数据分析"}
                ])
                menuTree.SQLite = new Y.SQLite(ret);
            }
            menuTree.data = {};
            menuTree.getData(0);
        })

    }
    $("#noteClose").click(function () {
        $(".note").hide();
    });
    $("#right").click(function (e) {
        var target = e.target;
        if (target.className.indexOf("input") > -1) {
            $(target).parent().find(".data_error").hide();
        }
        if($("#adminMenus").css("display") == "block"){
            $("#adminMenus").hide();
        }
    });
    setSize();
    $(window).resize(function(){
        setSize(true);
    })
    $("#menuToggle").click(function(){
        isLeftChange = true;
        leftWidth = leftWidth == 50 ? 275 : 50;
        setSize();
        ajaxMenu();
    })
    function setSize(b){
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        if(sessionStorage) sessionStorage.leftWidth = leftWidth;
        $(".left").css({height:(windowHeight - 97) +  'px',width:leftWidth + 'px'});
        $(".rightContent").css({height:(windowHeight - 97) +  'px'});
        $(".right").css({marginLeft:leftWidth + 'px'});
        if(leftWidth < 100) {
            $("#pagaBody").addClass("leftWidth");
            menuTree.levelConfig[1].res.clickEventType = "mouseover";
            menuActive.length = 1;
            $(".left").css("overflow","");
            if(schoolInfo.length == 1){
                //$('#logo_img').show();
                //$("#logo_imgB,#logo_text").hide();
            }
        }else{
            $(".left").css("overflow","auto");
            $("#pagaBody").removeClass("leftWidth");
            menuTree.levelConfig[1].res.clickEventType = "click";
            if(schoolInfo.length == 1){
                //$('#logo_imgB').show();
                //$("#logo_img,#logo_text").hide();
            }
        }
        if(!b) $(".menu_1_children").hide();
    }
})()