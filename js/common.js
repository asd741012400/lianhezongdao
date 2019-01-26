(function(a) {
    a.User = {
        Set: function(res) {
            this.data = res;
            a.Cookie.Set("user", JSON.stringify(res), 1, "/");
        },
        Btns: function(res) {
            this.data = res;
            a.Cookie.Set("btns", JSON.stringify(res), 1, "/");
        },
        Get: function(key) {
            try {
                this.data = JSON.parse(a.Cookie.Get("user"));
            } catch (e) {
                this.data = null;
            }
            if (!key) {
                return this.data;
            } else {
                return this.data[key];
            }
        },
        Del: function() {
            a.Cookie.Delete("user", "/");
            a.Cookie.Delete("account", "/");
            a.Cookie.Delete("password", "/");
            delete this.data;
        },
        Update: function(key, value) {
            try {
                this.data = JSON.parse(a.Cookie.Get("user"));
            } catch (e) {
                this.data = null;
            }
            this.data[key] = value;
            a.Cookie.Set("user", JSON.stringify(this.data), 1, "/");
        },
        SetLogin: function(account, password, expires) {
            expires = expires || 1;
            a.Cookie.Set("account", account, expires, "/");
            a.Cookie.Set("password", password, expires, "/");
        },
        GetLogin: function(key) {
            return a.Cookie.Get(key);
        },
        GetSchool: function(key, n) {
            n = n || 0;
            if (this.data.schoolInfo && this.data.schoolInfo.length > 0 && this.data.schoolInfo[n][key]) {
                return this.data.schoolInfo[n][key];
            } else {
                return undefined;
            }
        }
    }
    a.iframeUrl = "";

    a.Storage.set('loginAction', function(responseText, fn) {
        if (responseText && responseText.indexOf && responseText.indexOf("accessToken") > 0) {
            a.alertx("需要重新登录", function() {
                location.href = "login.html";
            });
        }
        var o = {};
        try {
            o = JSON.parse(responseText);
            if (o.errorMsg) o.errorMsg = o.errorMsg.replace("accessToken", "登录");
        } catch (_e) {
            o = {
                errorMsg: "未知错误"
            };
        }
        fn(o);
    })
    a.getRemoveArgs = function(obj) {
        return {
            titleHeight: 0,
            styles: {
                bottom: 'border-top:none;',
                center: 'border-top:none;',
                box: 'left:' + (obj.offset().left - 150) + 'px;top:' + (obj.offset().top - 110) + 'px;'
            },
            _h: 110,
            _w: 200
        }
    }
    a.ajax = function(url, fn, args) {
        args = args || {};
        args.dataJson = args.dataJson == false ? false : true;
        var ajax = new a.Ajax(url, fn, args);
        ajax.header.push({
            key: "x-tags",
            vaule: 'eschool-mgn'
        });
        ajax.action();
    }
    a.ajaxHtml = function(url, fn) {
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                success: function(res) {
                    fn(res)
                }
            })
        }
        //文件类型
    a.fileType = function(fileType) {
            if (fileType) fileType = fileType.toLowerCase();
            var path = "filetype/";
            var imgType = ".gif";
            var typeObj = {
                pdf: "",
                ppt: "",
                word: "|doc|docx|wps|wpt|dot|dotx|docm|dotm|",
                excle: "|et|ett|xls|xlt|xlsx|xlsm|xltx|xltm|",
                shiping: "|wmv|asf|asx|rm|rmvb|mpg|mpeg|mpe|3gp|mov|mp4|m4v|avi|dat|mkv|flv|vob|",
                weizhi: "",
                flash: "",
                yasuo: "|rar|zip|7z|cab|iso|",
                pic: "|jpg|jpeg|gif|png|bmp|"
            };
            var fileString = "weizhi";
            if (typeObj[fileType] != undefined) {
                fileString = fileType;
            } else {
                for (var key in typeObj) {
                    if (typeObj[key].indexOf("|" + fileType + "|") > -1) {
                        fileString = key;
                        break;
                    }
                }
            }
            return path + fileString + imgType;
        }
        //富文本编辑器
    a.RichEdit = function(obj, upload, args) {
            args = args || {};
            this.id = "edit" + new Date().only();
            var _this = this;
            var upLoadArgs = args;
            obj.append("<iframe id='" + this.id + "_Iframe' width='" + (obj.width() + 20) + "' height='" + obj.height() + "' src='kindeditor/examples/simple.html' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>");
            var content = $("#" + this.id + "_Iframe")[0].contentWindow;
            content._ue = {
                width: obj.width() - 2,
                height: obj.height() + 4,
                uploadImg: function() {
                    upLoadArgs.imgEdit = {};
                    upLoadArgs.maxSize = 10 * 1024 * 1024;
                    a.upload(args.url ? args.url : csIP + "/api/cs/v0.1/public", function(res, filesData) {
                        if (typeof args.retFn == 'function') {
                            args.retFn(res, function(src) {
                                var f = filesData[0];
                                if (filesData && f.type.indexOf("image") == 0) {
                                    var _img = new Image();
                                    _img.onload = function() {
                                        var widthString = this.width > obj.width() ? "width='100%' " : "";
                                        files = src ? "<img style='max-width:100%' " + widthString + "src='" + src + "' data-ke-src='" + src + "' />" : "";
                                        _this.insertHtml(files);
                                    }
                                    _img.src = src;
                                } else {
                                    a.alertx("图片格式错误");
                                }
                            })
                            return false;
                        }
                        if (res && res.length > 0) {
                            var files = "";
                            for (var i = 0; i < res.length; i++) {
                                var r = res[i];
                                var f = filesData[i];
                                if (filesData && f.type.indexOf("image") == 0) {
                                    var _img = new Image();
                                    _img.onload = function() {
                                        var widthString = this.width > obj.width() ? "width='100%' " : "";
                                        files = r ? "<img style='max-width:100%' " + widthString + "src='" + r + "' data-ke-src='" + r + "' />" : "";
                                        _this.insertHtml(files);
                                    }
                                    _img.src = res[i];
                                } else {
                                    a.alertx("图片格式错误");
                                }
                            }
                        }
                        a.alertx("图片上传完成")
                    }, upLoadArgs)
                },
                uploadFile: function() {
                    upLoadArgs.maxSize = 10 * 1024 * 1024;
                    a.upload(args.url ? args.url : csIP + "/api/cs/v0.1/public", function(res, filesData) {
                        if (typeof args.retFn == 'function') {
                            args.retFn(res, function(src) {
                                var f = filesData[0];
                                var files = "<a target='_blank' href='" + src + "'>" + f.name + "</a>";
                                _this.insertHtml(files);
                            })
                            return false;
                        }
                        if (res && res.length > 0) {
                            var files = "";
                            for (var i = 0; i < res.length; i++) {
                                var r = res[i];
                                var f = filesData[i];
                                files = "<a target='_blank' href='" + r + "'>" + f.name + "</a>";
                                //files += "<div class='downLoadData' style='display:none;'><a target='_blank' class='downLoadDiv' href='" + r + "'><img class='downLoadImg' src='" + a.fileType(f.type.split("/")[1]) + "' /><div class='downLoadName'>" + f.name + "</div><div class='downLoadSize'>" + a.fileSize(f.size) + "</div></a></div>"
                                _this.insertHtml(files);
                            }
                        }
                        a.alertx("附件上传完成")
                    }, upLoadArgs)
                },
                addComponent: !args.Components ? '' : function() {
                    args.Components.open(function(ret) {
                        _this.insertHtml(ret);
                    })
                }
            };
            this.val = function(s) {
                if (content.editor) {
                    if (!s) {
                        return content.editor.html();
                    } else {
                        content.editor.html(s);
                        if (!content.isStyle) {
                            content.editor.insertHtml("<style>.downLoadData{display:none;}</style>");
                            content.isStyle = true;
                        }
                    }
                } else {
                    if (s) setTimeout(function() {
                        _this.val(s);
                    }, 1000);
                }
            }
            this.insertHtml = function(s) {
                content.editor.insertHtml(s);
            }
            this.contentHeight = function(width) {
                var html = '',
                    id = 'richedit' + this.id;
                $('body').append('<div style="display:none;width:' + width + 'px;" id="' + id + '">' + this.val() + '</div>');
                var height = $('#' + id).height();
                $('#' + id).remove();
                return height;
            }
        }
        //打开页面
    a.open = function() {
            $('.contextmenu').hide();
            $(".adminDivActive").removeClass("adminDivActive");
            var rightLoading = new a.loading(999, 0);
            var url = "",
                title = "";
            for (var i = 0; i < arguments.length; i++) {
                url = arguments[i].url;
                title += "<span title='" + arguments[i].title + "'>" + arguments[i].title + "</span>";
                if (!a.open.history) a.open.history = [];
                a.open.history.push(arguments[i]);
            }
            if (arguments[0].showTitle) {
                $('#nav').show();
            } else {
                $('#nav').hide();
            }
            $("#nav").html(title);
            if (a.Storage.get('openPageFunction')) a.Storage.get('openPageFunction')();
            rightLoading.open("加载中...", $(".rightContent"));
            a.ajax(url, function(html, err) {
                rightLoading.close();
                if (err) {
                    $("#right").html("<div style='text-align: center; font-size: 30px; color: #e0e8f3; line-height: 300px;'>" + title + " 页面加载失败...</div>");
                } else {
                    $(".right").css({
                        opacity: 0
                    });
                    $("#right").html(html);
                    $(".right").animate({
                        opacity: 1
                    }, 700);
                }
            }, {
                dataType: "html",
                noLoginAction: true
            })
        }
        //页面回退
    a.back = function(n) {
            a.Storage.set('useBack', true);
            a.open.history.length = a.open.history.length + n;
            a.open(a.open.history[a.open.history.length - 1]);
        }
        //刷新页面
    a.refresh = function() {
            var h = a.open.history[a.open.history.length - 1];
            a.open.history.length = a.open.history.length - 1;
            a.open(h);
        }
        //获取参数
    a.getUrlParam = function(name) {
        var rc = "";
        try {
            rc = a.open.history[a.open.history.length - 1].data[name];
        } catch (e) {
            rc = "";
        }
        return rc; //返回参数值
    }
    a.urlQuery = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = a.open.history[a.open.history.length - 1].url.split("?")[1]; //匹配目标参数
        if (r) {
            r = r.match(reg);
            return r[2];
        }
    }
    a.ListDateiled = function (url, paramet, header) {
        var _this = this;
        this.url = url; //请求地址
        this.paramet = paramet; //请求参数
        this.th = header || []; //表格头部
        this.table = null;
        this.load = function (fn) {
            if(fn) fn();
            a.ajax(this.url+"/"+this.paramet, function(res) {
                // showData(res);
                titleHtml(res.rows.info)
                tableHtml(res.rows.weekData)
                
            }, {
                meth: "GET",
            })
        }
        function titleHtml(data){
            $('.info-titles').html(
                '<div class="info-title">'+
                    '<div class="info-title-text">'+
                        '<h3>'+data.title+'</h3>'+
                        '<div>'+
                            '<a>总值班领导：'+data.leadership+'</a>'+
                            '<span>电话：'+data.leadership_tel+'</span>'+
                        '</div>'+
                    '</div>'+
                    '<div class="info-title-btn"><span>编辑表格</span></div>'+
                '</div>'+
                '<p  class="info-instructions">说明：'+data.remark+'</p>'
            )

            $(".info-title-btn").click(function(){
                Y.open({url:"modules/beOnDuty/beOnDutyManagementDetailedSetting.html",title:"值班表详情设置",data:{id:_this.paramet}});
            })
        }

        function tableHtml(data) {
            var colspan = data[0].leader.length
            _this.table = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
            _this.table += '<tr>';
            for(var i = 0; i < _this.th.length; i++)
            {
                if(_this.th[i].CH == '值周组长')
                {
                    _this.table += '<th colspan="'+colspan+'">'+_this.th[i].CH+'</th>';
                }
                else
                {
                    _this.table += '<th>'+_this.th[i].CH+'</th>';
                }
            }
            _this.table += '</tr>';
            for(var i = 0; i < data.length; i++)
            {
                var rowspan = data[i].weekList.length;
                for(var j = 0; j < data[i].weekList.length; j++)
                {
                    
                    _this.table += '<tr class="tableBody">';
                        if(j == 0)
                        {
                            _this.table += '<td rowspan="'+rowspan+'"><span>'+data[i].week_name+'</span></td>';
                            _this.table += '<td rowspan="'+rowspan+'">'+
                            '<span>'+data[i].onduty_leader+'</span>'+ 
                            '<span>'+data[i].leader_tel+'</span>'+ 
                        '</td>';
                        for(var k = 0; k < data[i].leader.length; k++){
                                var dataLeader = data[i].leader[k]
                                _this.table += '<td rowspan="'+rowspan+'">'+
                                    '<span>'+dataLeader.group_leader+'</span>'+ 
                                    '<span>('+dataLeader.group_leader_tel+')</span>'+ 
                                '</td>'
                            }
                        }
                        var dataWeekList = data[i].weekList[j];
                        _this.table += '<td><span>'+dataWeekList.onduty_time+'</span></td>';
                        if(dataWeekList.state == 0)
                        {
                            _this.table += '<td><span>是</span></td>';
                        }
                        else
                        {
                            _this.table += '<td><span>否</span></td>';
                        }
                        _this.table += '<td><span>'+dataWeekList.onduty_teacher+'</span></td>';

                    _this.table += '</tr>';
                }
            }

            _this.table += '</table>'
            $('#table').html(_this.table)
        }
        this.load()

    }
    a.ListDateiledSetting = function (url, paramet, header) {
        var _this = this;
        this.url = url; //请求地址
        this.paramet = paramet; //请求参数
        this.th = header || []; //表格头部
        this.table = null;
        this.load = function (fn) {
            if(fn) fn();
            a.ajax(this.url+"/"+this.paramet, function(res) {
                // showData(res);
                tableHtml(res.rows.weekData)
                
            }, {
                meth: "GET",
            })
        }
    

        function tableHtml(data) {
            var colspan = data[0].leader.length
            _this.table = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
            _this.table += '<tr>';
            for(var i = 0; i < _this.th.length; i++)
            {
                if(_this.th[i].CH == '值周组长')
                {
                    _this.table += '<th colspan="'+colspan+'">'+_this.th[i].CH+'</th>';
                }
                else
                {
                    _this.table += '<th>'+_this.th[i].CH+'</th>';
                }
            }
            _this.table += '</tr>';
            for(var i = 0; i < data.length; i++)
            {
                var rowspan = data[i].weekList.length;
                for(var j = 0; j < data[i].weekList.length; j++)
                {
                    
                    _this.table += '<tr class="tableBody">';
                        if(j == 0)
                        {
                            _this.table += '<td rowspan="'+rowspan+'"><span>'+data[i].week_name+'</span></td>';
                            _this.table += '<td rowspan="'+rowspan+'">'+
                            '<span><input placeholder="'+data[i].onduty_leader+'" /></span>'+ 
                            '<span><input placeholder="'+data[i].leader_tel+'" /></span>'+ 
                        '</td>';
                        for(var k = 0; k < data[i].leader.length; k++){
                                var dataLeader = data[i].leader[k]
                                _this.table += '<td rowspan="'+rowspan+'">'+
                                    '<span><input placeholder="'+dataLeader.group_leader+'" /></span>'+ 
                                    '<span><input placeholder="'+dataLeader.group_leader_tel+'" /></span>'+ 
                                '</td>'
                            }
                        }
                        var dataWeekList = data[i].weekList[j];
                        _this.table += '<td><span>'+dataWeekList.onduty_time+'</span></td>';
                        if(dataWeekList.state == 0)
                        {
                            _this.table += '<td><span><input placeholder="是" /></span></td>';
                        }
                        else
                        {
                            _this.table += '<td><span><input placeholder="否" /></span></td>';
                        }
                        _this.table += '<td><span><input placeholder="'+dataWeekList.onduty_teacher+'" /></span></td>';

                    _this.table += '</tr>';
                }
            }

            _this.table += '</table>'
            $('#table').html(_this.table)
        }
        this.load()

    }
    
    a.List = function(url, paramet, header, headerKey) { //headerKey服务端返回表头时的关键字
            var _this = this;
            this.url = url; //请求地址
            this.urlId = paramet.pageSize + "_" + url.replace(/:|\?|\/|\./g, "");
            this.paramet = paramet; //请求参数
            this.th = header || []; //表格头部
            this.headerKey = headerKey || "listTitle";
            this.total = 0; //记录总条数
            this.totalKey = "sum";
            this.listNumTitle = "序号"; //序号
            this.rowspanKey = "";
            this.checkBtn = false; //是否使用选择框
            this.btns = ""; //操作按钮
            this.btnsWidth = 100;
            this.action = null;
            this.isLoading = false;
            this.data = null;
            this.SQLite = null;
            this.toExcelUrl = url; //导出路径
            this.table = null;
            this.pagaBtns = null;
            this.dataStringify = false;
            this.id = new Date().only();
            this.preLoad = true;
            this.toExcel = function(name, th) {
                if (!a.useStrict()) {
                    a.alertx("抱歉,所使用浏览器不支持此功能", '', {
                        toast: {
                            position: 'top'
                        },
                        height: 70
                    });
                    return false;
                }
                th = th || this.th;
                for (var i = 0; i <= th.length; i++) {
                    for (var k in th[i]) {
                        if (k == "EN" || k == "CH" || k == "OptionExcel" || k == 'FormExtMap') {} else {
                            delete th[i][k];
                        }
                    }
                }
                th = JSON.stringify(th);
                var params = this.paramet;
                delete params.pageSize;
                delete params.pageNum;
                params = JSON.stringify(params);
                var url = eschoolIP + "/api/excel/v0.1/export?url=" + this.toExcelUrl + "&th=" + th + "&excelName=" + name + "&accessToken=" + accessToken + "&schoolId=" + schoolId + "&params=" + params;
                // console.log(url)
                // console.log(encodeURI(url))
                a.download(encodeURI(url));
            }
            this.reLoad = function(n) {
                n = !n ? 1 : n;
                this.paramet.pageNum = n;
                if (a.Storage.get(this.urlId))
                    for (var k in a.Storage.get(this.urlId)) this.paramet[k] = a.Storage.get(this.urlId)[k];
                this.load();
            }
            this.getChecked = function() {
                var checkeds = [];
                for (var i = 0; i < this.data.rows.length; i++) {
                    if (this.data.rows[i]._checked) checkeds.push(this.data.rows[i]);
                }
                return checkeds;
            }
            this.deleteFn = function(data, APIUrl, idKey, title, args) {
                args = args || {};
                var _args = {};
                if (args.obj) {
                    _args = {
                        titleHeight: 0,
                        styles: args.styles,
                        _h: 110,
                        _w: 200
                    };
                    _args.styles = args.styles || {};
                    _args.styles.bottom = _args.styles.bottom || '';
                    _args.styles.center = _args.styles.top || '';
                    _args.styles.box = _args.styles.box || '';
                    _args.styles.bottom += 'border-top:none;';
                    _args.styles.center += 'border-top:none;';
                    _args.styles.box += 'left:' + (args.obj.offset().left - 150) + 'px;top:' + (args.obj.offset().top - 110) + 'px;';
                }
                if (data.length == 0) {
                    a.alertx("请选择需要删除的" + title, '', {
                        toast: {
                            position: 'top'
                        },
                        height: 70
                    });
                    return false;
                }
                var success = [];
                a.confirmx("确定要删除吗?", function(n) {
                    a.alertx('正在删除...', function() {}, {
                        toast: true,
                        height: 70
                    });
                    var fn = arguments.callee;
                    n = n || 0;
                    var urlData = args.data ? "?groupId=" + args.data : "";
                    a.ajax(APIUrl + data[n][idKey] + urlData, function(res) {
                        $('.boxShadow').remove();
                        if (res && res.result) {
                            if (args.vKey) success.push(data[n][args.vKey]);
                            if (n == data.length - 1) {
                                _this.load();
                                a.alertx("删除所选" + title + "成功", function() {}, {
                                    toast: true,
                                    height: 70
                                });
                                if (args.fn) {
                                    args.fn()
                                }
                            } else {
                                fn(n + 1);
                            }
                        } else {
                            var msg = "";
                            if (success.length > 0) {
                                msg = "删除" + title + "中断,已成功删除前" + success.length + "条,删除第" + (n + 1) + "条失败";
                            } else {
                                msg = "删除" + title + "失败";
                            }
                            if (res && res.errorMsg) msg += "<div style='color:#ff0000;'>" + res.errorMsg + "</div>";
                            a.alertx(msg, function() {
                                _this.reLoad();
                            }, {
                                toast: true,
                                height: args.errHeight || 70
                            });
                        }
                    }, {
                        meth: "DELETE"
                    })
                }, _args)
            }
            this.useHistory = true;
            this.thSort = false;
            this.load = function(fn) {
                var _this = this;
                if (fn) _this.action = fn;
                if (a.Storage.get(this.urlId) && this.preLoad && a.Storage.get('useBack')) {
                    this.preLoad = false;
                    return false;
                }
                this.preLoad = false;
                if (!a.open.history[a.open.history.length - 1].pageNum) {
                    _this.paramet.pageNum = !_this.paramet.pageNum ? 0 : _this.paramet.pageNum; //默认加载第一页
                } else {
                    if (_this.useHistory) {
                        _this.paramet.pageNum = a.open.history[a.open.history.length - 1].pageNum; //
                        _this.useHistory = true;
                    }
                }
                a.open.history[a.open.history.length - 1].pageNum = _this.paramet.pageNum;
                _this.paramet.pageSize = localStorage && localStorage[_this.urlId] ? localStorage && localStorage[_this.urlId] : (typeof _this.paramet.pageSize === "string" || !_this.paramet.pageSize ? 10 : _this.paramet.pageSize);
                _this.table = !_this.table ? $("#table") : _this.table;
                _this.isLoading = true;
                _this.toExcelUrl = _this.url;
                if (this.SQLite) {
                    this.SQLite.find({}, function(res) {
                        showData(res);
                    }, this.paramet)
                } else {
                    a.ajax(this.url, function(res) {
                        showData(res);
                    }, {
                        meth: "GET",
                        data: this.paramet
                    })
                }

                function showData(res) {
                    if (res && res.rows) {
                        _this.isLoading = false;
                        if (_this.headerKey && res[_this.headerKey]) _this.th = res[_this.headerKey];
                        _this.data = res;
                        var table = "<table width=\"100%\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\">";
                        //处理分页
                        if (res && res.total > -1)
                            _this.total = res.total > -1 ? res.total : _this.total;
                        var pagaBtns = _this.pagaBtns || $("#pagaBtns");
                        pagaBtns.html("<font style='margin-right:10px;color:#999999;float:left;'>共 " + _this.total + " 条数据" + (_this.changePageSize == false ? "" : ",每页<select id='pageSizeSelect" + _this.id + "' style='border-color:#e4e4e4;width:50px;margin:0px 5px;'><option value='5' " + (_this.paramet.pageSize == 5 ? "selected" : "") + ">5</option><option value='10' " + (_this.paramet.pageSize == 10 ? "selected" : "") + ">10</option><option value='15' " + (_this.paramet.pageSize == 15 ? "selected" : "") + ">15</option><option value='20' " + (_this.paramet.pageSize == 20 ? "selected" : "") + ">20</option><option value='50' " + (_this.paramet.pageSize == 50 ? "selected" : "") + ">50</option><option value='100' " + (_this.paramet.pageSize == 100 ? "selected" : "") + ">100</option></select>条</font>"));
                        $("#pageSizeSelect" + _this.id).change(function() {
                            if (localStorage) {
                                localStorage[_this.urlId] = this.value;
                                _this.paramet.pageSize = this.value;
                            } else {
                                _this.paramet.pageSize = this.value;
                            }
                            _this.reLoad();
                        });
                        if (_this.total > _this.paramet.pageSize) {
                            var nums = Math.ceil(_this.total / _this.paramet.pageSize);
                            var btns = "<span class='pagaBtn pagaBtnFirst'>首页</span><span class='pagaBtn'><</span>";
                            var flogNume = 3;
                            if (_this.paramet.pageNum - 1 >= flogNume) btns += "<span class='pagaBtn'>...</span>";
                            for (var i = 0; i < nums; i++) {
                                if (i > (_this.paramet.pageNum - 1) - flogNume && i < (_this.paramet.pageNum - 1) + flogNume) {
                                    btns += "<span class='pagaBtn" + (i + 1 == _this.paramet.pageNum ? " pagaBtnActive" : "") + "'>" + (i + 1) + "</span>";
                                }
                            }
                            if (nums - (_this.paramet.pageNum - 1) > flogNume) btns += "<span class='pagaBtn'>...</span>";
                            btns += "<span class='pagaBtn'>></span><span class='pagaBtn pagaBtnLast'>尾页</span>";
                            pagaBtns.append(btns);
                            var btnsNum = pagaBtns.find("span").size();
                            pagaBtns.find("span").each(function(i) {
                                switch (i) {
                                    case 0:
                                        $(this).attr("num", 1);
                                        break;
                                    case 1:
                                        $(this).attr("num", _this.paramet.pageNum == 1 ? 1 : _this.paramet.pageNum - 1);
                                        break;
                                    case btnsNum - 1:
                                        $(this).attr("num", nums);
                                        break;
                                    case btnsNum - 2:
                                        $(this).attr("num", _this.paramet.pageNum == nums ? nums : _this.paramet.pageNum + 1);
                                        break;
                                    default:
                                        $(this).attr("num", $(this).html());
                                        break;
                                }
                                $(this).click(function() {
                                    _this.useHistory = false;
                                    _this.paramet.pageNum = -(-$(this).attr("num"));
                                    if (_this.paramet.pageNum >= 0) _this.load();
                                });
                            });
                        }
                        //处理数据表格
                        var _header = [];
                        var header = [],
                            headerWeight = 0;
                        var editConfig = {};
                        var child = false;
                        if (_this.thSort == true) _this.th.sort(sortFn);
                        for (var i = 0; i < _this.th.length; i++) {
                            if (_this.th[i].children) {
                                child = true;
                            };
                            _header.push(_this.th[i]);
                            if (_this.th[i].COLS && _this.th[i].COLS.length > 0) {
                                if (_this.thSort == true) _this.th[i].COLS.sort(sortFn);
                                for (var j = 0; j < _this.th[i].COLS.length; j++) {
                                    _this.th[i].COLS[j].WEIGHT = headerWeight;
                                    headerWeight++;

                                    var obj = _this.th[i].COLS[j];
                                    if (_this.th[i].PN) {
                                        obj.PN = _this.th[i].PN
                                    };
                                    header.push(obj);
                                }
                            } else {
                                _this.th[i].WEIGHT = headerWeight;
                                headerWeight++;
                                header.push(_this.th[i]);
                            }
                            if (_this.th[i].EN && _this.th[i].Edit && !editConfig[_this.th[i].EN]) editConfig[_this.th[i].EN] = _this.th[i].Edit;
                        }

                        function sortFn(a, b) { //权重排序
                            return (a.WEIGHT == undefined ? 999999 : a.WEIGHT) - (b.WEIGHT == undefined ? 999999 : b.WEIGHT);
                        }
                        var colspan = header.length;
                        var th_1 = "",
                            th_2 = "";
                        if ((_header.length != header.length) || child) {
                            th_1 = "<tr class='tableHeader'>";
                            th_2 = "<tr class='tableHeader'>";
                            if (_this.checkBtn) {
                                th_1 += "<td rowspan='2' width=\"50\" align=\"center\"><input class='tableSelect' id='tableSelect' type='checkbox' /><label for='tableSelect'>全选</label></td>";
                                colspan++;
                            }
                            if (_this.listNumTitle) {
                                th_1 += "<td rowspan='2' width=\"40\" align=\"center\">" + _this.listNumTitle + "</td>";
                                colspan++;
                            }
                            for (i = 0; i < _header.length; i++) {
                                if (_header.Hide) continue;
                                var _width = _header[i].CH.length * 20;
                                _width = !_width ? 40 : _width;
                                if (_header[i].children && res.rows.length > 0) {
                                    var col = res.rows[0][_header[i].EN],
                                        na = _header[i].COLS.CH;
                                    th_1 += "<td colspan='" + col.length + "' width='" + _width + "' align='" + (_header[i].Align ? _header[i].Align : "center") + "'>" + _header[i].CH + "</td>";
                                    for (var j = 0; j < col.length; j++) {
                                        _width = na.length * 20;
                                        _width = !_width ? 40 : _width;
                                        th_2 += "<td width='" + _width + "' align='" + (col[j].Align ? col[j].Align : "center") + "'>" + col[j][na] + "</td>";
                                    }
                                } else if (_header[i].children && res.rows.length == 0) {
                                    th_1 += "";
                                } else if (_header[i].COLS && _header[i].COLS.length > 0) {
                                    th_1 += "<td colspan='" + _header[i].COLS.length + "' width='" + _width + "' align='" + (_header[i].Align ? _header[i].Align : "center") + "'>" + _header[i].CH + "</td>";
                                    for (var j = 0; j < _header[i].COLS.length; j++) {
                                        colspan++;
                                        if (_header[i].COLS[j].ROWS && !_this.rowspanKey) _this.rowspanKey = _header[i].COLS[j].EN;
                                        _width = _header[i].COLS[j].CH.length * 20;
                                        _width = !_width ? 40 : _width;
                                        th_2 += "<td width='" + _width + "' align='" + (_header[i].COLS[j].Align ? _header[i].COLS[j].Align : "center") + "'>" + _header[i].COLS[j].CH + "</td>";
                                    }
                                } else {

                                    if (_header[i].ROWS && !_this.rowspanKey) _this.rowspanKey = _header[i].EN;
                                    th_1 += "<td rowspan='2' width='" + _width + "' align='" + (_header[i].Align ? _header[i].Align : "center") + "'>" + _header[i].CH + "</td>";
                                    colspan++;
                                }
                            }
                            if (_this.btns) {
                                th_1 += "<td rowspan='2' " + (_this.btnsWidth ? "width='" + _this.btnsWidth + "'" : "") + " align=\"center\">操作</td>";
                                colspan++;
                            }
                            th_1 += "</tr>";
                            th_2 += "</tr>";
                        } else {
                            th_1 += "<tr>";
                            if (_this.checkBtn) {
                                th_1 += "<th width=\"50\" align=\"center\"><input class='tableSelect' id='tableSelect' type='checkbox' /><label for='tableSelect'>全选</label></th>";
                                colspan++;
                            }
                            if (_this.listNumTitle) {
                                th_1 += "<th width=\"40\" align=\"center\">" + _this.listNumTitle + "</th>";
                                colspan++;
                            }
                            for (i = 0; i < header.length; i++) {
                                if (header[i].ROWS && !_this.rowspanKey) _this.rowspanKey = header[i].EN;
                                if (header[i].Hide) continue;
                                var _width = header[i].CH.length * 20;
                                _width = !_width ? 40 : _width;
                                th_1 += "<th width='" + _width + "' align='" + (header[i].Align ? header[i].Align : "center") + "'>" + header[i].CH + "</th>";
                            }
                            if (_this.btns) {
                                th_1 += "<th " + (_this.btnsWidth ? "width='" + _this.btnsWidth + "'" : "") + " align=\"center\">操作</th>";
                                colspan++;
                            }
                            th_1 += "</tr>";
                        }
                        table += th_1;
                        table += th_2;
                        $(".table").css({
                            borderColor: "#e4e4e4"
                        });
                        if (res.rows.length > 0) {
                            //存在合并单元格按单元格内容排序
                            if (_this.rowspanKey) res.rows.sort(function(a, b) {
                                return a[_this.rowspanSortKey ? _this.rowspanSortKey : _this.rowspanKey].localeCompare(b[_this.rowspanSortKey ? _this.rowspanSortKey : _this.rowspanKey]);
                            });
                            var rowspan = {};
                            if (_this.rowspanKey) { //统计合并项
                                for (var i = 0; i < res.rows.length; i++) {
                                    var key = encodeURI(res.rows[i][_this.rowspanKey]);
                                    rowspan[key] = rowspan[key] ? (rowspan[key] + 1) : 1;
                                }
                            }
                            if (res[_this.totalKey]) res.rows.push(res[_this.totalKey]);
                            //
                            for (var i = 0; i < res.rows.length; i++) {
                                var key = encodeURI(res.rows[i][_this.rowspanKey]);
                                table += "<tr" + (_header.length > 0 ? " class='tableBody'" : "") + (_this.dataStringify ? " " + _this.dataStringify + "='" + JSON.stringify(res.rows[i]) + "'" : "") + ">";
                                if (_this.checkBtn) table += "<td align=\"center\"><input class='trSelect' index='" + i + "' type='checkbox' /></td>";
                                if (_this.listNumTitle) table += "<td align=\"center\">" + (i + _this.paramet.pageSize * (_this.paramet.pageNum - 1) + 1) + "</td>";
                                var arr = [];
                                var objt = false;
                                for (var j = 0; j < header.length; j++) {
                                    var th_j = header[j];
                                    if (th_j.Hide) continue;
                                    if (th_j.PN) {
                                        objt = true;
                                        var value = res.rows[i][th_j.PN][th_j.EN];
                                    } else {
                                        var value = !th_j.EN ? "" : res.rows[i][th_j.EN];
                                    };
                                    var _v = '';
                                    var v = '';
                                    if (typeof(value) == 'object' && value) {
                                        if (value.length === 0) {
                                            value = [' '];
                                        };
                                        for (var z = 0; z < value.length; z++) {
                                            if (value[z].count != undefined && th_j.COLS) {
                                                _v = value[z][th_j.COLS.EN];
                                            } else {
                                                _v = value;
                                            };
                                            arr.push(_v)
                                        };
                                    } else {
                                        v = value
                                        arr.push(v)
                                    };
                                }
                                if (!objt) {
                                    for (var j = 0; j < header.length; j++) {
                                        var th_j = header[j];
                                        if (th_j.Hide) continue;
                                        var value = !th_j.EN ? "" : res.rows[i][th_j.EN];
                                        value = th_j.Option && value in th_j.Option ? th_j.Option[value] : value;
                                        if (th_j.htmlFormat) value = typeof th_j.htmlFormat === "function" ? th_j.htmlFormat(th_j.EN, value, res.rows[i]) : th_j.htmlFormat;
                                        if ((value == undefined || value == "") && value != 0 && value != "0") value = th_j.Option && "null" in th_j.Option ? th_j.Option["null"] : "--";
                                        value = value.toString()._eval(res.rows[i]);
                                        if (_this.rowspanKey && _this.rowspanKey === th_j.EN) {
                                            if (rowspan[key] != 0) {
                                                table += "<td rowspan='" + rowspan[key] + "'" + (th_j.Style ? " style='" + th_j.Style + "'" : "") + " align=\"" + (th_j.Align ? th_j.Align : "center") + "\">" + value + "</td>";
                                                rowspan[key] = 0;
                                            }
                                        } else {
                                            table += "<td " + (th_j.Edit ? 'title="此列双击可修改" editKey="' + th_j.EN + '"' : '') + " style='" + (th_j.Edit ? 'background:url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgEJ/8QAJRAAAQMDAwMFAAAAAAAAAAAAAQIDBAUGEQAhQRITUSIxMkJh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANOrluWJbsTuOYckOA9lnO6j5PgaN28upVetIuCkSlBp5YTUI7qiQg4+vkY+PI9jtqP23Pu6SZlQiPU91DnSXFp2dZycek7hQH5g6a06nRKVEbhQmg202NhyTySeToP/2Q==") -6px -6px no-repeat;' : '') + (th_j.Style ? th_j.Style : '') + "' align=\"" + (th_j.Align ? th_j.Align : "center") + "\">" + value + "</td>";
                                        }
                                    }
                                } else {
                                    for (var q = 0; q < arr.length; q++) {
                                        table += "<td align='center'>" + arr[q] + "</td>";
                                    };
                                };

                                //if (_this.btns) table += "<td align=\"center\"><div class=\"tdBtns\">" + _this.btns + "</div></td>";//操作按钮
                                if (_this.btns) {
                                    var btnss = [];
                                    $(_this.btns).each(function(i, e) {
                                        if (!$(e).attr('title')) $(e).attr('title', $(this).html());
                                        btnss[i] = e.outerHTML
                                    });
                                    var _btns = btnss.join(' ');
                                    table += "<td align=\"center\"><div class=\"tdBtns\">" + _btns + "</div></td>"; //操作按钮
                                }
                                table += "</tr>";
                            }
                        } else {
                            table += "<tr><td align='center' colspan='" + colspan + "'>暂无数据...</td></tr>";
                        }
                        table += "</table>";
                        _this.table.html(table);
                        var editing = false;
                        _this.table.find('tr').each(function(i) {
                                if (i > 0 && _this.data.rows.length > 0) {
                                    var data = _this.data.rows[i - 1];
                                    $(this).find('td').dblclick(function() {
                                        var $this = $(this),
                                            editKey = $this.attr('editKey'),
                                            value = data[editKey],
                                            _html = $this.html(),
                                            thisWidth = $this.width();
                                        if (editKey && _this.editAPI && !editing) {
                                            editing = true;

                                            function edit(_value) {
                                                if (value != _value) {
                                                    data[editKey] = _value;
                                                    if (typeof _this.editAPI == 'string') {
                                                        a.ajax(_this.editAPI, function(ret) {
                                                            if (ret.result) {
                                                                _this.reLoad(_this.paramet.pageNum);
                                                            }
                                                            editing = false;
                                                        }, {
                                                            data: data,
                                                            meth: 'PUT',
                                                            dataJson: false
                                                        })

                                                    } else if (typeof _this.editAPI == 'function') {
                                                        _this.editAPI.call(_this, editKey, data, function() {
                                                            _this.reLoad(_this.paramet.pageNum);
                                                            editing = false;
                                                        })
                                                    }
                                                } else {
                                                    $this.html(_html);
                                                    editing = false;
                                                }
                                            }
                                            if (typeof editConfig[editKey] == 'function') {
                                                editConfig[editKey].call(this, data, function(_value) {
                                                    edit(_value);
                                                });
                                            } else {
                                                $this.html('<input id="listEditInput" type="text" style="border:1px solid #59a9e1;padding:3px 8px;background:none;" value="' + value + '" /><div style="color:#ccc;font-size:12px;">编辑中...</div>');
                                                $('#listEditInput').blur(function() {
                                                    if (this.value.trim() == '') {
                                                        a.alertx('标题不能为空');
                                                        $(this).parent().html(value);
                                                        editing = false;
                                                        return false;
                                                    }
                                                    edit(this.value);
                                                })
                                                $('#listEditInput').focus();
                                            }
                                        }
                                    })
                                }
                            })
                            //全选功能
                        if (_this.checkBtn) {
                            _this.table.find(".tableSelect").click(function() {
                                var checked = $(this)[0].checked;
                                _this.table.find(".trSelect").each(function(i) {
                                    this.checked = checked;
                                    _this.data.rows[i]._checked = checked;
                                })
                            })
                            _this.table.find(".trSelect").click(function(i) {
                                var index = $(this).attr("index");
                                _this.data.rows[index]._checked = this.checked;
                            })
                        }
                        if (_this.action && res.rows) _this.action();
                    } else {
                        _this.isLoading = false;
                        $(".table").css({
                            borderColor: "#fff"
                        });
                        _this.table.html("<div style='color:#ccc;text-align:center;margin-top:20%;font-size:24px;'>未找到相关数据..." + (res && res.errorMsg ? res.errorMsg : "") + "</div>");
                    }
                }
            }
        }
        //搜索
    a.ListSearch = function(list, searchObj, url, advancedSearchObj) {
            var url1 = list.url,
                url2 = url;
            var _this = this;
            this.advanceSearch = false; //默认非高级搜索
            this.id = (new Date()).only();
            var isBindKeyup = false;
            $(".search").click(function() {
                    if (!isBindKeyup) {
                        isBindKeyup = true;
                        $(window).bind("keyup", function(e) {
                            if (e.which == 13 && !list.isLoading) $("#searchBtn").click();
                        })
                    }
                })
                //普通查询
            $("#searchBtn").click(function() {
                _this.advanceSearch = false;
                list.url = url1;
                for (var k in advancedSearchObj) {
                    if (advancedSearchObj[k].val) advancedSearchObj[k].val("");
                    delete list.paramet[k];
                }
                var o = {},
                    _o = {};
                for (var k in searchObj) {
                    if (searchObj[k].val) {
                        list.paramet[k] = searchObj[k].val();
                        o[k] = list.paramet[k];
                        if (searchObj[k].Val) _o[k] = searchObj[k].Val();
                    } else {
                        list.paramet[k] = searchObj[k];
                    }
                }
                a.Storage.set(urlId, o);
                a.Storage.set('_' + urlId, _o);
                list.reLoad();
            });
            var urlId = list.urlId;
            if (a.Storage.get(urlId) && a.Storage.get('useBack')) {
                a.Storage.set('useBack', false);
                for (var key in a.Storage.get(urlId)) searchObj[key].val(a.Storage.get(urlId)[key], a.Storage.get('_' + urlId)[key]);
                $("#searchBtn").click();
            } else {
                a.Storage.set(urlId, '');
                a.Storage.set('useBack', false);
            }
            if (!url) return false;
            //高级查询
            $("#advancedSearch_btn").click(function() {
                $("#advancedSearch_box").css({
                    display: "block",
                    left: $(this).offset().left + "px",
                    marginLeft: "0px"
                });
                a.creatCover({
                    id: _this.id + "_cover",
                    obj: window,
                    zIndex: 999,
                    opacity: 0,
                    background: "#ffffff",
                    position: "fixed"
                });
                $("#" + _this.id + "_cover").click(function() {
                    $("#advancedSearch_box").hide();
                    $(this).remove();
                })
            })
            $("#advancedSearchCancle").click(function() {
                $("#advancedSearch_box").hide();
                $("#" + _this.id + "_cover").remove();
            })
            $("#advancedSearchBtn").click(function() {
                _this.advanceSearch = true;
                for (var k in searchObj) {
                    if (searchObj[k].val) searchObj[k].val("");
                    delete list.paramet[k];
                }
                var listUrl = list.url;
                for (var k in advancedSearchObj) {
                    if (advancedSearchObj[k].val) {
                        list.paramet[k] = advancedSearchObj[k].val();
                    } else {
                        list.paramet[k] = advancedSearchObj[k];
                    }
                }
                list.url = url2;
                list.reLoad();
                $("#advancedSearch_box").hide();
            });
        }
        //表格
    a.Table = function(selector, res, obj) {
            this.selector = selector;
            this.res = res;
            this.obj = obj;
            this.xTotal = obj.xTotal || false;
            this.yTotal = obj.yTotal || false;
            this.counts = obj.counts;
            this.countsKey = obj.countsKey;
            this.xTotalHtml = obj.xTotalHtml;
            this.xyText = obj.xyText || "类别";
            this.load = function() {
                var _this = this;
                showData(res);

                function showData(res) {
                    var table = '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><th>' + _this.xyText + '</th>';
                    var list = "";
                    var countTot = "";
                    var shtml = "";
                    var totalCount = 0;
                    if (res.length == '0' && obj.xyText) {
                        table += '<th>暂无数据</th>'
                    };
                    for (var i = 0; i < res.length; i++) {
                        var item = res[i];
                        var count = 0;
                        var countHtml = 0;
                        if (_this.counts) {
                            list += '<tr><td align="center">' + item.course + '</td>';
                            for (var j = 0; j < item[_this.counts].length; j++) {
                                var items = item[_this.counts][j];
                                if (i == '0') {
                                    table += '<th>' + items[_this.countsKey] + '</th>';
                                    countTot += '<td align="center"></td>';
                                };

                                if (_this.xTotalHtml) {
                                    if (items[_this.countsKey] != _this.xTotalHtml.del) {
                                        countHtml += items.count;
                                    };
                                };

                                list += '<td align="center">' + items.count + '</td>';
                                count += items.count;
                            }
                        } else {
                            table += '<th>' + item[_this.obj.count] + '</th>';
                            _this.obj.count2 ? shtml += '<th>' + item[_this.obj.count2] + '</th>' : '';
                            list += '<td align="center">' + item[_this.obj.list] + '</td>';
                            totalCount += item.count;
                        }

                        if (_this.xTotal) {
                            list += '<td align="center">' + count + '</td></tr>';
                        };
                        if (_this.xTotalHtml) {
                            list += '<td align="center">' + countHtml + '</td></tr>';
                        };
                    };
                    if (_this.xTotal) {
                        table += '<th>合计</th></tr>';
                    };
                    if (_this.xTotalHtml) {
                        table += '<th>' + _this.xTotalHtml.text + '</th></tr>';
                    };
                    _this.obj.xyText2 ? table += '<tr><th>' + _this.obj.xyText2 + '</th>' : '';
                    if (res.length == '0' && obj.xyText2) {
                        table += '<th>暂无数据</th>'
                    };
                    if (_this.obj.count) {
                        table += shtml;
                        table += '</tr>';
                        table += '<tr><td align="center">' + _this.obj.listTit + '</td>';
                    };
                    if (res.length == '0' && obj.listTit) {
                        table += '<td style="text-align:center">暂无数据</td>'
                    };
                    table += list;
                    if (_this.obj.yTotalCol) {
                        table += '<tr><td align="center">合计</td><td align="center" colspan=' + res.length + '>' + totalCount + '</td></tr></table>';
                    };
                    if ((_this.xTotal && _this.yTotal) || (_this.xTotalHtml && _this.yTotal)) {
                        countTot += '<td align="center"></td>';
                    };
                    if (_this.yTotal) {
                        table += '<tr><td align="center">合计</td>' + countTot + '</tr>';
                    };
                    table += '</table>';
                    $(_this.selector).html(table);

                    if (_this.yTotal) {
                        $(".table-list").each(function() {
                            var len = $(this).find('tr').length,
                                a = [],
                                $total = $(this).find('tr').eq(len - 1),
                                _len = $total.children().length;
                            for (var j = 1; j <= _len - 1; j++) {
                                var tot = 0;
                                for (var i = 1; i <= len - 2; i++) {
                                    tot += Number($(this).find('tr').eq(i).find('td').eq(j).html());
                                };
                                $(this).find('tr').eq(len - 1).find('td').eq(j).html(tot);
                            };
                        })
                    };
                }
            }
        }
        //表单
    a.From = function(o, idKey, args) {
        var _this = this;
        this.title = args && args.title ? args.title : "";
        this.submitFn = args.submitFn || '';
        this.load = function() { //初始化
            for (var key in o) {
                if (typeof o[key] != "object") continue;
                if (o[key].i) o[key].i(o[key].o);
                if (o[key].e && o[key].f) {
                    var bindObj = o[key]._o || o[key].o;
                    bindObj.attr("fromKey", key);
                    bindObj.bind(o[key].e, function() {
                        var _key = $(this).attr("fromKey");
                        var v = typeof o[_key].f == 'function' ? o[_key].f(o[_key].o.val()) : a.Verify.Rules(o[_key].o.val(), o[_key].f, o[key].m || o[_key].f);
                        if (!v[0]) _this.errFn($(this), v[1]);
                    });
                }
            }
        }
        this.load();
        this.errFn = function(obj, msg) {
            if (!obj.parents) return false;
            obj = obj.parents(".data");
            if (!obj.attr("errorMsg")) obj.attr("errorMsg", msg);
            if (!msg) msg = obj.attr("errorMsg");
            obj.find(".data_error").html(msg);
            obj.find(".data_error").show();
        }

        this.getData = function(fn) {
            if (args.data) {
                bindData(args.data);
            } else {
                a.ajax(args.getURL.replace(new RegExp("{" + idKey + "}", "g"), o[idKey]), function(res) {
                    if (res) {
                        bindData(res);
                    }
                    if (fn) {
                        fn(res);
                    };
                })
            }

            function bindData(res) {
                for (var key in o) {
                    if (typeof(o[key]) == "object" && o[key].o) {
                        var s = o[key].s;
                        if (s) {
                            if (typeof s === "function") {
                                o[key].o.val(s(res)[0], s(res)[1]);
                            } else {
                                o[key].o.val(res[key], res[s]);
                            }
                        } else {
                            o[key].o.val(res[key]);
                        }
                    } else {
                        if (res[key] != undefined) o[key] = res[key];
                    }
                    if (o[key].v) o[key].v(res[key], res);
                }
            }
        }
        if (o[idKey] || args.intGet) this.getData(args.fn);
        this.verify = function() {
            var isOk = true;
            for (var key in o) {
                if (typeof(o[key]) == "object" && o[key].f) {
                    var v = typeof o[key].f == 'function' ? o[key].f(data[key]) : a.Verify.Rules(data[key], o[key].f, o[key].m || o[key].f);
                    if (v && !v[0]) {
                        isOk = false;
                        this.errFn(o[key]._o || o[key].o, v[1]);
                        if (v[2]) a.alertx(v[1]);
                    }
                }
            }
            return isOk;
        }
        this.submit = function(obj, success, redu) {
            $("input[type='hidden']").val('0')
            $(".data_error").hide();
            var isOk = true,
                err = [];
            var data = {}; //上传参数
            for (var key in o) {
                if (typeof(o[key]) == "object") {
                    data[key] = o[key].o.val();
                    if (o[key].f) { //验证
                        var v = typeof o[key].f == 'function' ? o[key].f(data[key]) : a.Verify.Rules(data[key], o[key].f, o[key].m || o[key].f);
                        if (v && !v[0]) {
                            isOk = false;
                            this.errFn(o[key]._o || o[key].o, v[1]);
                            if (v[2]) {
                                err.push(v[1])
                            }
                        }
                    }
                } else {
                    data[key] = o[key];
                }
            }
            if (redu) {
                for (var key in redu) {
                    data[key] = redu[key]
                }
            };
            if (isOk) {
                var url = !o[idKey] ? args.postURL : args.putURL;
                var meth = !o[idKey] ? "POST" : "PUT";
                if (args.postType) {
                    url = args.postURL;
                    meth = "POST";
                };
                if (idKey == "") {
                    url = args.putURL;
                    meth = "PUT";
                } else {
                    url = url.replace(new RegExp("{" + idKey + "}", "g"), o[idKey])
                };
                if (obj) {
                    var btnMsg = obj.val();
                    obj.val(btnMsg + "中...");
                }
                if (typeof this.submitFn == 'function') this.submitFn.call(this, data);
                a.ajax(url, function(res) {
                    if (obj) obj.val(btnMsg);
                    if (res && (res.result || res.id || res.dataId)) {
                        if (success) {
                            success(res);
                        } else {
                            a.alertx("<div style='color:#ff0000;font-weight:bold;'>" + _this.title + "成功</div>", function() {
                                a.back(-1);
                            });
                        }
                    } else {
                        var msg = "<div style='color:#ff0000;font-weight:bold;'>" + _this.title + "失败</div>";
                        if (res && res.errorMsg) msg += res.errorMsg;
                        a.alertx(msg);
                    }
                }, {
                    meth: meth,
                    data: data,
                    dataJson: args.dataJson
                })
            } else {
                a.alertx(err.length > 0 ? err.join('<br />') : '无法提交，验证不通过');
            }
        }
    }

    //问卷表单
    a.QuestionnaireFrom = function(sel, header, config, url) {
        this.head = header || '';
        this.url = url || '';
        this.data = "";
        this.config = config;
        this.notes = config.notes;
        var _this = this;
        var UpperArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
        this.headText = function(i) {
            var headSecond = this.head ? (this.head.second ? '<span class="title-s">（' + this.head.second + '）</span>' : '') : '';
            var headDel = this.head ? (this.head.del ? '<span class="title-r-59A9E1 from-del">' + this.head.del + '</span>' : '') : '';
            var head = '<h2 class="list-title list-title-border"><span class="list-title-title">' + this.head.parentTitle + '</span>' + headSecond + headDel + '</h2>';
            return head;
        }
        this.bodyText = function(item, index) {
            var index = index || 0;
            var scoreList = "";
            var span = '<span>单选两项</span><span class="active">单选三项</span><span>单选四项</span><span>单选五项</span>';
            /*var notes = this.notes ? '<div class="info-body-list-describe inline-block" style="margin-left:66px"><span>注释：</span><input value="{description}" style="width:calc(100% - 42px)" name="description" type="text" placeholder="请输入注释" /></div>' : '';*/
            var notes = this.notes ? '<div class="info-body-list-describe inline-block" style="margin-left:66px"><span style="line-height:42px;vertical-align:middle">注释：</span><div contenteditable="true" class="input-description" >{description}</div></div>' : '';
            if (item) {
                var n = 0;
                for (var i = 0; i < item.options.length; i++) {
                    n++
                    scoreList += '<div class="info-body-list-score-min-item"><input class="item-input" value="' + item.options[i].optionName + '"" type="text" placeholder="请输入选项' + (i + 1) + '内容" /><span class="down-arrow"></span><div class="select-wrap"><span class="select-content" data="' + item.options[i].score + '">' + item.options[i].score + '分</span><span class="arrow-i"></span><ul class="select-list-warp">'
                    for (var j = 1; j <= 20; j++) {
                        scoreList += '<li>' + j + '分</li>'
                    };
                    scoreList += '</ul></div></div>'
                };
                if (n == '3') {
                    span = '<span>单选两项</span><span class="active">单选三项</span><span>单选四项</span><span>单选五项</span>'
                };
                if (n == '4') {
                    span = '<span>单选两项</span><span>单选三项</span><span class="active">单选四项</span><span>单选五项</span>'
                };
                if (n == '5') {
                    span = '<span>单选两项</span><span>单选三项</span><span>单选四项</span><span class="active">单选五项</span>'
                };
            } else {
                for (var i = 0; i < 3; i++) {
                    scoreList += '<div class="info-body-list-score-min-item"><input class="item-input" type="text" placeholder="请输入选项' + (i + 1) + '内容" /><span class="down-arrow"></span><div class="select-wrap"><span class="select-content" data="1">1分</span><span class="arrow-i"></span><ul class="select-list-warp">'
                    for (var j = 1; j <= 20; j++) {
                        scoreList += '<li>' + j + '分</li>'
                    };
                    scoreList += '</ul></div></div>'
                };
            };
            var body = '<li>' + '<div class="info-body-list-num font-bold inline-block">选项' + (index + 1) + '</div><div class="info-body-list-describe inline-block">' + '<span>选项描述：</span><input style="width:calc(100% - 72px)" value="{title}" name="title" type="text" placeholder="请输入选项描述" />' + '</div><div class="inline-block add-reduce-wrap">' + '<span class="reduce-btn">-</span><span class="add-btn">+</span>' + '</div>' + notes + '<div class="info-body-list-score-wrap">' + '<div class="info-body-list-classify-wrap">' + span + '</div>' + '<p class="info-body-list-score-wrap-ps">*输入的文字信息在4个字以内</p>' + '<div class="info-body-list-score-min">' + scoreList + '</div>' + '</div>' + '</li>'
            if (item) {
                for (var key in item) {
                    var tit = item[key];
                    if (key == "title") {
                        tit = item[key].substring(item[key].lastIndexOf('、') + 1, item[key].length)
                    };
                    body = body.replace(new RegExp("{" + key + "}", 'g'), tit)
                }
            } else {
                //body = body.replace(new RegExp(/{(\S*)}/, 'g'), '')
                body = body.replace(new RegExp("{title}", 'g'), '')
            };
            return body;
        }
        this.fullText = function() {
            var full = '<div class="big-wrap">' + this.headText() + '<ul class="info-body-list-detailed-wrap info-body-list-detailed-inline">' + this.bodyText() + '</ul>' + '</div>'
            return full;
        }
        this.showData = function(ret) {
            var form = "";
            var len1array = [];
            for (var i = 0; i < ret.length; i++) {
                var item = ret[i];
                var b = "";
                form += "<div class='big-wrap'>";
                if (item.parentTitle) {
                    this.head = {
                        parentTitle: item.parentTitle,
                        del: '删除此模块'
                    }
                    if (item.questions.length == '1') {
                        len1array.push(i)
                    };
                    form += this.headText();
                    form += '<ul class="info-body-list-detailed-wrap info-body-list-detailed-inline">';
                    for (var j = 0; j < item.questions.length; j++) {
                        var items = item.questions[j]
                        form += this.bodyText(items, j)
                    };
                    form += '</ul>';
                    item.questions
                };
                form += "</div>"
            };
            if (ret.length > 0) {
                this.addHtml(form)
            };
            for (var key in len1array) {
                $(".big-wrap").eq(len1array[key]).find('.reduce-btn').hide()
            }
        }
        this.init = function() {
            var _this = this;
            if (this.url) {
                Y.ajax(this.url, function(ret) {
                    _this.data = ret;
                    if (ret.items) {
                        _this.showData(ret.items)
                    }
                })
            } else {
                this.addHtml()
            };
            this.intIndex()
        }
        this.val = function(s) {
            if (s) {
                var full = '<div class="big-wrap">' + this.headText() + '<ul class="info-body-list-detailed-wrap info-body-list-detailed-inline">'
                for (var i = 0; i < s.length; i++) {
                    full += this.bodyText(s[i], i)
                }; + '</ul>' + '</div>'
                this.addHtml(full)
                this.intIndex()
            } else {
                var items = [];
                var maxScore = [];
                $('.info-body-list-detailed-wrap').children('li').each(function(i) {
                    var _this = $(this);
                    items.push({
                        'title': (i + 1) + '、' + $(this).find("input[name=title]").val(),
                        'options': [],
                        'score': ''
                    });
                    var scoreArr = [];
                    $(this).find('.info-body-list-score-min').children('.info-body-list-score-min-item').each(function(j) {
                        var option = $(this).find('.item-input').val();
                        var score = $(this).find('.select-content').attr('data');
                        scoreArr.push(score)
                        items[i].options[j] = {
                            'optionName': option,
                            'score': score
                        };
                    })
                    var max = Math.max.apply(null, scoreArr);
                    maxScore.push(max);
                })
                for (var i = 0; i < items.length; i++) {
                    items[i].score = maxScore[i]
                };
                return items;
            };
        }

        this.addHtml = function(v) {
            sel.html(v || this.fullText());
        }
        this.addAppend = function(header) {
            this.head = header;
            sel.append(this.fullText())
        }
        this.intIndex = function() {
            $(".info-body-list-detailed-wrap").each(function() {
                var n = $(this).children('li').length;
                for (var i = 1; i <= n; i++) {
                    $(this).find(".info-body-list-num").eq(i - 1).html("选项" + i)
                };
            })

            $(".big-wrap").each(function(i) {
                var len = $(this).find('.info-body-list-detailed-wrap').children().length
                len == '1' ? $(this).find(".reduce-btn").hide() : $(this).find(".reduce-btn").show()
            })
        }
        sel.off('click', '.from-del').on('click', '.from-del', function(event) {
            event.preventDefault();
            var _this = $(this)
            Y.confirmx("确定删除模块？", function() {
                _this.parents(".big-wrap").remove()
                $(".big-wrap").each(function(i) {
                    var tit = $(this).find('.list-title-title').html()
                    var subTit = tit.substring(tit.lastIndexOf('、') + 1, tit.length)
                    var newTit = UpperArr[i] + '、' + subTit
                    $(this).find('.list-title-title').html(newTit)
                })
            })
        });
        sel.off('click', '.add-btn').on('click', '.add-btn', function(event) {
            event.preventDefault();
            $(this).parents("li").after(_this.bodyText());
            $(this).parents("li").next().find('.info-body-list-classify-wrap span').eq(1).click();
            _this.intIndex();
        });
        sel.off('click', '.reduce-btn').on('click', '.reduce-btn', function(event) {
            event.preventDefault();
            $(this).parents('li').remove();
            _this.intIndex();
        });
        sel.off('click', '.info-body-list-classify-wrap span').on('click', '.info-body-list-classify-wrap span', function(event) {
            event.preventDefault();
            $(this).addClass('active').siblings().removeClass('active');
            var n = $(this).index() + 2,
                s = "";
            for (var i = 0; i < n; i++) {
                s += '<div class="info-body-list-score-min-item"><input class="item-input" type="text" placeholder="请输入选项' + (i + 1) + '内容" /><span class="down-arrow"></span><div class="select-wrap"><span class="select-content" data="1">1分</span><span class="arrow-i"></span><ul class="select-list-warp">'
                for (var j = 1; j <= 20; j++) {
                    s += '<li>' + j + '分</li>'
                };
                s += '</ul></div></div>'
            };
            $(this).parent().siblings('.info-body-list-score-min').html(s);
        });
        sel.off('click', '.select-content').on('click', '.select-content', function(event) {
            event.preventDefault();
            var WinHeight = $(window).height()
            if (event.pageY > WinHeight / 2) {
                $(this).siblings(".select-list-warp").css('top', '-173px').fadeIn(200);
            } else {
                $(this).siblings(".select-list-warp").css('top', '40px').fadeIn(200);
            };
            Y.creatCover({
                id: $(this).attr("data") + "_cover",
                class: "select-open",
                obj: window,
                zIndex: 999,
                opacity: 0,
                background: "#ffffff",
                position: "fixed"
            });
            $("#" + $(this).attr("data") + "_cover").click(function() {
                $(".select-list-warp").fadeOut(200);
                $(this).remove();
            })
        });

        sel.off('click', '.select-list-warp li').on('click', '.select-list-warp li', function(event) {
            event.preventDefault();
            var _this = $(this).parent(),
                s = $(this).html(),
                id = _this.siblings('.select-content').attr("data");
            _this.siblings('.select-content').html(s).attr("data", s.substring(0, s.length - 1));
            _this.slideUp(200);
            $("#" + id + "_cover").remove();
        });

    }
    a.ImgBox = function(imgs, args) {
            var html = '',
                imgStyle = args.imgStyle || '';
            imgStyle += 'border-color:#ffffff;';
            var confirmxArgs = args.confirmxArgs || {};
            var active = -1;
            confirmxArgs.initFn = function() {
                $('#_imgBox').find('._boxImg').each(function(i) {
                    $(this).click(function() {
                        if (active > -1) $('#_imgBox').find('._boxImg').eq(active).css('border-color', '#ffffff');
                        active = i;
                        $('#_imgBox').find('._boxImg').eq(active).css('border-color', '#59a9e1');
                    })
                })
                if (args.initFn) args.initFn($('#_imgBox'));
            }
            for (var i = 0; i < imgs.length; i++) html += '<img class="_boxImg" src="' + imgs[i] + '" style="' + imgStyle + '" />';
            var w = '';
            this.open = function(fn) {
                w = a.confirmx('<div id="_imgBox" style="' + (args.boxStyle || '') + '">' + html + '</div>', function() {
                    fn(active > -1 ? imgs[active] : '');
                }, confirmxArgs)
            }
            this.close = function() {
                if (w && w.close) w.close();
            }
        }
        //
    a.Img = function(obj, emty, imgEdit, args) {
        args = args || {};
        var _this = this;
        this.img = "";
        obj.html(emty);
        var readonly = false;
        this.setReadOnly = function(b) {
            readonly = b;
        }
        obj.children().click(function() {
            if (readonly) return false;
            upload();
        })

        function upload() {
            if (args.beforeUpload) args.beforeUpload(imgEdit, args);
            var upLoadArgs = args;
            args.imgEdit = imgEdit;
            args.maxSize = 10 * 1024 * 1024;
            a.upload(args.url ? args.url : csIP + "/api/cs/v0.1/public", function(res, filesData) {
                if (typeof args.retFn == 'function') {
                    args.retFn(res, function(src) {
                        _this.img = src;
                        _this.show();
                    });
                    return false;
                }
                if (res && res.length > 0) {
                    _this.img = res[0];
                    _this.show();
                } else {
                    var msg = "上传失败";
                    if (res && res.errorMsg) msg += "," + res.errorMsg;
                    a.alertx(msg);
                }
            }, upLoadArgs)
        }
        this.val = function(s) {
            if (!s) {
                return this.img;
            } else {
                this.img = s;
                this.show();
            }
        }
        this.show = function() {

            obj.html("<img src='" + this.img + "' style='cursor: pointer;' />");
            obj.children().click(function() {
                if (readonly) return false;
                upload();
            })
        }
    }
    a.Imgs = function(obj, upLoadBtn, imgEdit, args) {
        args = args || {};
        var _this = this;
        this.img = args.img || [];
        this.template = args.template;
        var readonly = false;
        this.setReadOnly = function(b) {
            readonly = b;
        }
        upLoadBtn.click(function() {
            if (readonly) return false;
            upload();
        })

        function upload() {
            if (args.beforeUpload) args.beforeUpload(imgEdit, args);
            var upLoadArgs = args;
            args.imgEdit = imgEdit;
            args.maxSize = 10 * 1024 * 1024;
            a.upload(args.url ? args.url : csIP + "/api/cs/v0.1/public", function(res, filesData) {
                if (typeof args.retFn == 'function') {
                    args.retFn(res, function(src) {
                        _this.show(src);
                    });
                    return false;
                }
                if (res && res.length > 0) {
                    _this.show(res[0]);
                } else {
                    var msg = "上传失败";
                    if (res && res.errorMsg) msg += "," + res.errorMsg;
                    a.alertx(msg);
                }
            }, upLoadArgs)
        }
        this.val = function(s) {
            if (!s) {
                var imgs = [];
                obj.find('.img').each(function(i) {
                    imgs.push($(this).attr('src'));
                })
                return imgs;
            } else {
                for (var i = 0; i < s.length; i++) this.show(s[i]);
            }
        }
        this.show = function(img) {
            upLoadBtn.before(this.template._eval({
                img: img
            }));
            var box = obj.find('.imgsBox').last();
            box.find('.delete').click(function() {
                box.remove();
            })
        }
    }
    a.SelectBox = function(args) {
            var _this = this;
            this.title = args.title;
            this.data = [];
            this.value = [];
            this.total = 0;
            this.count = 0;
            this.selectedSize = 0;
            this.selectMax = args.selectMax;
            this.eachFn = args.eachFn;
            this.eachClickFn = args.eachClickFn;
            this.hasValue = "";
            this.id = (new Date()).only();
            this.paramet = args.paramet;
            this.paramet.pageNum = this.paramet.pageNum || 1;
            this.boxStyle = args.boxStyle || "";
            this.delFn = args.delFn || ""; //清空按钮
            this.cover = args.cover || {};
            this.onlySelect = args.onlySelect === true ? true : false;
            this.SQLite = args.SQLite || "";
            this.showNum = args.showNum === false ? false : true;
            this.zIndex = a.zIndex(4);
            this.placeholder = args.placeholder || "关键字";
            this.open = function() {
                $("#InputSelect").remove();
                $("#InputSelect_cover").remove();
                var titleStr = this.title && this.title.length > 0 ? "<div style='font-size: 16px;padding-left: 22px;margin-top: 10px;'>" + this.title + "</div>" : '';
                a.creatCover({
                    id: "InputSelect_cover",
                    obj: window,
                    zIndex: this.zIndex,
                    opacity: this.cover.opacity || 0.1,
                    background: this.cover.background || "#000000",
                    position: this.cover.position || "fixed",
                    unScroll0: true
                });
                var InputSelect = "<div id='InputSelect' class='boxShadow' style='width:300px; position:fixed; left:50%; margin-left:-150px;top:50%;margin-top:-200px;z-index:" + (this.zIndex + 1) + ";background:#f8f8f8;border-radius:5px;" + this.boxStyle + "'>" + titleStr + "<div style='text-align:center;'><input type='text' placeholder='"+this.placeholder+"' style='border:1px solid #e4e4e4;padding:3px 5px;border-radius:3px;width:80%;height:25px;margin:10px auto;background:none;' id='InputSelect_input' /></div>" + (this.showNum == false ? "" : "<div id='InputSelect_count' style='text-align:center;border-bottom:1px dashed #e4e4e4;padding:0px 5px 5px 5px;color:#ccc;'>共<span id='InputSelect_count_total' style='margin:5px;color:#00b7ee'>0</span>条数据，显示<span id='InputSelect_count_selected' style='margin:5px;color:#00b7ee'>0</span>条</div>") + "<div style='min-height:30px;max-height:200px;overflow:auto;background:#fff;border-top:1px dashed #e4e4e4;border-bottom:1px solid #e4e4e4;'><div id='InputSelect_select'><div style='text-align:center;color:#ccc;margin:10px;'>加载中,请稍后...</div></div><div style='text-align:center;'><span id='InputSelect_more' style='display:none;color:#4a5cdf;margin:5px;padding:3px 7px;cursor:pointer;'>加载更多..</span></div></div>";
                InputSelect += this.onlySelect ? "<div id='InputSelect_del' style='line-height:40px; cursor:pointer;text-align:center;'>清空</div></div>" : "<div style='line-height:40px; cursor:pointer;text-align:center;'><span id='InputSelect_ok' style='padding:3px 15px;border-radius:2px;margin-left:10px;' class='bg_00b7ee'>确定</span><span id='InputSelect_del' style='padding:3px 15px;border-radius:2px;margin-left:10px;' class='bg_ffffff'>清空</span><span id='InputSelect_cancle' style='padding:3px 15px;border-radius:2px;margin-left:10px;' class='bg_ffffff'>取消</span></div></div>";
                $("body").append(InputSelect);

                if (typeof(_this.hasValue) == 'object') {
                    var hasArray = [];
                    for (var i = 0; i < _this.hasValue.length; i++) {
                        hasArray.push(_this.hasValue[i].accountId)
                    };
                    _this.hasValue = hasArray.join(',')
                };
                _this.selectedSize = _this.hasValue ? _this.hasValue.split(",").length : 0;
                this.doAjax(true);
                $("#InputSelect_cover").click(function() {
                    _this.close();
                });
                if (!this.paramet["key"]) $("#InputSelect_input").remove();
                $("#InputSelect_input").keyup(function() {
                    _this.paramet[_this.paramet["key"]] = $(this).val();
                    _this.paramet.pageNum = 1;
                    _this.total = 0;
                    _this.count = 0;
                    _this.selectedSize = 0;
                    _this.doAjax(true);
                })
                $("#InputSelect_more").click(function() {
                    _this.paramet.pageNum++;
                    _this.doAjax();
                })
                $("#InputSelect_ok").click(function() {
                    _this.okFn();
                })
                $("#InputSelect_cancle").click(function() {
                    _this.close();
                })
                if (_this.delFn) {
                    $("#InputSelect_del").click(function() {
                        _this.delFn();
                        _this.close();
                    })
                } else {
                    $("#InputSelect_del").hide();
                }
            }
            this.okFn = function() {
                var rc = [];
                for (var i = 0; i < _this.value.length; i++) {
                    if (_this.value[i].selected) rc.push(_this.value[i]);
                }
                if (args.action) args.action(rc, _this);
                _this.close();
            }
            this.loading = false;
            this.doAjax = function(isHTML) {
                this.paramet.sex = $('#data-type-sex').val();
                if (this.loading) {
                    return false;
                } else {
                    this.loading = true;
                }
                if (this.SQLite) {
                    this.SQLite.find({}, function(res) {
                        showData(res);
                    }, this.paramet)
                } else {
                    var ajaxArgs = args.ajax || {};
                    ajaxArgs.data = this.paramet;
                    ajaxArgs.loading = true;
                    a.ajax(args.url, function(res) {
                        showData(res);
                    }, ajaxArgs)
                }

                function showData(res) {
                    _this.loading = false;
                    if (res && res.rows) {
                        var autoList = "",
                            disabled = args.disabled,
                            disabledi = [];
                        _this.total = res.total;
                        if (isHTML) {
                            _this.value = [];
                            _this.count = res.rows.length;
                        } else {
                            _this.count += res.rows.length;
                        }
                        if (_this.total <= _this.count) {
                            $("#InputSelect_more").hide();
                        } else {
                            $("#InputSelect_more").show();
                        }
                        for (var i = 0; i < res.rows.length; i++) {
                            var sexr = args.dataString,
                                ind = sexr.indexOf('{sex}');
                            if (ind > 0) {
                                var sexs = res.rows[i].sex == 0 ? '女' : '男';
                                sexr = args.dataString.replace("{sex}", sexs)
                            }

                            autoList += sexr._eval(res.rows[i], function(s, k, v, o) {
                                s = s.replace(new RegExp("{has_" + k + "}", "g"), function() {
                                    if (_this.hasValue && new RegExp("(^|,)" + v + "(,|$)").test(_this.hasValue)) {
                                        res.rows[i].selected = true;
                                        return "<div style='color:#e4e4e4;font-size:12px;margin:0px 5px;border:1px solid #e4e4e4;width:15px;height:15px;line-height:15px; text-align:center; border-radius:2px;font-weight:bold;font-size:12px;font-family:Berlin Sans FB;display: inline-block;vertical-align: middle;'>√</div>";
                                    } else {
                                        return "<div class='InputSelectChecked' style='color:#00b7ee;font-size:12px;margin:0px 5px;border:1px solid #e4e4e4;width:15px;height:15px;line-height:15px; text-align:center; border-radius:2px; cursor:pointer;font-weight:bold;font-size:12px;font-family:Berlin Sans FB;display: inline-block;vertical-align: middle;'></div>";
                                    }
                                })
                                if (disabled) {
                                    for (var j = 0; j < disabled.length; j++) {
                                        if (disabled[j] == v) {
                                            if (res.rows[i].isDefault) {
                                                disabledi.push(i);
                                            };
                                        };
                                    };
                                };

                                return args.dataStringEval ? args.dataStringEval(s, k, v, o) : s;
                            })
                            _this.value.push(res.rows[i]);
                        }
                        if (isHTML) {
                            autoList = !autoList ? "<div style='color:#ccc;text-align:center;font-size:12px;padding:10px 0px;'>暂无数据...</div>" : autoList;
                            $("#InputSelect_select").html(autoList);
                        } else {
                            $("#InputSelect_select").append(autoList);
                        }
                        for (var i = 0; i < disabledi.length; i++) {
                            if (typeof(disabledi[i]) == 'number') {
                                $("#InputSelect_select").children().eq(disabledi[i]).hide();
                            };
                        };
                        a.loadImg($("#InputSelect .icon_img"), {
                            attrName: "imgUrl",
                            err: false
                        });
                        $("#InputSelect_select").children().each(function(i) {
                            var isBind = $(this).attr("isBind"),
                                checkbox = $(this).find(".InputSelectChecked"),
                                checkboxSize = checkbox.size();
                            if (isBind != "true" && _this.value[i]) {
                                if (_this.eachFn) _this.eachFn($(this), _this.value[i], i);
                                $(this).attr("isBind", "true");
                                $(this).css("cursor", "pointer");
                                $(this).bind("click", function() {
                                    if (_this.eachClickFn && _this.eachClickFn($(this), _this.value[i], i) == false) return false;
                                    if (!_this.value[i].selected) {
                                        if (!_this.selectMax || _this.selectedSize < _this.selectMax) {
                                            _this.value[i].selected = true;
                                            if (checkboxSize > 0) {
                                                checkbox.html("√");
                                                checkbox.css("border-color", "#00b7ee");
                                            }
                                            _this.selectedSize++;
                                            if (_this.onlySelect) _this.okFn();
                                        } else {
                                            a.alertx("最多选择 " + _this.selectMax + " 个");
                                        }
                                    } else {
                                        _this.value[i].selected = false;
                                        if (checkboxSize > 0) {
                                            checkbox.html("");
                                            checkbox.css("border-color", "#e4e4e4");
                                        }
                                        _this.selectedSize--;
                                    }
                                })
                            }
                        })
                        $("#InputSelect_count_total").html(_this.total);
                        $("#InputSelect_count_selected").html(_this.count);
                        if (typeof(disabledi) === 'number') {
                            $("#InputSelect_select").children().eq(disabledi).off().append("<div style='width:100%;height:100%;position: absolute;background: rgba(0,0,0,.1);top:0;left:0;cursor: not-allowed'></div>")
                        };
                    } else {
                        if (isHTML) {
                            $("#InputSelect_select").html("<div style='text-align:center;color:#ccc;margin:10px;'>抱歉,无数据</div>");
                        }
                    }
                }
            }
            this.close = function() {
                this.paramet.pageNum = 1;
                this.paramet[this.paramet["key"]] = "";
                this.value = [];
                this.total = 0;
                this.count = 0;
                this.selectedSize = 0;
                $("#InputSelect").remove();
                $("#InputSelect_cover").remove();
            }
        }
        //选择单个
    a.OnlySelectBox = function(obj, args) {
            var vaule = "";
            args.SelectBox.action = function(res) {
                if (res && res.length == 1) {
                    o.val(res[0][args.vKey], res[0][args.sKey]);
                    if (args.selectedFn) args.selectedFn(res[0]);
                }
            }
            args.SelectBox.selectMax = 1;
            var o = new a.SelectBox(args.SelectBox);
            o.readOnly = args.readOnly || false;
            o.setReadOnly = function(b) {
                o.readOnly = b;
                if (b) {
                    obj.attr('readonly', 'readonly');
                } else {
                    obj.removeAttr('readonly');
                }
            }
            o.val = function(s, _s) {
                if (s == undefined) {
                    return vaule;
                } else {
                    if (typeof s == 'object') {
                        vaule = s[args.vKey];
                        obj.val(s[args.sKey]);
                    } else {
                        vaule = s;
                    }
                    if (_s != undefined) obj.val(_s);
                    if (args.eachChangeFn) args.eachChangeFn();
                }
            }
            o.Val = function() {
                return obj.val();
            }
            obj.attr('readonly', 'readonly');
            obj.bind("keyup", function() {
                if (o.readOnly) return false;
                if ($(this).val() == "") {
                    vaule = "";
                }
            })
            obj.off().bind("click", function(e) {
                var WinHeight = $(window).height()

                if (o.readOnly) return false;
                if (vaule != "" && args.delFn != false) {
                    o.delFn = function() { //清空按钮
                        vaule = "";
                        obj.val("");
                        if (args.selectedFn) args.selectedFn("");
                    }
                } else {
                    o.delFn = "";
                }
                if (args.htmlSelect !== false) {
                    var top = obj.offset().top + obj.height() + 5;
                    if (args.SelfAdaption && WinHeight < 800 && e.screenY > WinHeight / 2 + 250) {
                        top = obj.offset().top - 280;
                    };
                    o.onlySelect = true;
                    o.cover = {
                        background: "#fff"
                    };
                    o.boxStyle = args.SelectBox.boxStyle || "width:" + (obj.width() < 200 ? 200 : obj.width()) + "px;border-radius:0px;position:absolute;margin-left:0px;margin-top:0px;left:" + obj.offset().left + "px;top:" + top + "px;z-index:" + a.zIndex(4);
                }
                if (args.prevClickFn) args.prevClickFn(o);
                o.open();
            })
            o.selectBox = function(k, v) {
                if (v == undefined) {
                    return o[k];
                } else {
                    o[k] = v;
                }
            }
            if (args.defaultSelect && typeof args.defaultSelect == 'function') { //自动选择
                var data = args.SelectBox.paramet;
                data.pageSize = 10000;
                data.pageNum = 1;
                a.ajax(args.SelectBox.url, function(ret) {
                    if (ret && ret.rows) {
                        for (var i = 0; i < ret.rows.length; i++) {
                            var _select = args.defaultSelect(ret.rows[i]);
                            if (_select) {
                                o.val(_select[0], _select[1]);
                                break;
                            }
                        }
                    }
                }, {
                    data: data
                })
            }
            return o;
        }
        //Select标签美化
    a.Select = function(obj, data, args) {
            args = args || {};
            obj.css({
                backgroundImage: "url(images/icon_select.png)",
                backgroundPosition: "center right",
                backgroundRepeat: "no-repeat"
            });
            var _data = [];
            for (var key in data) _data.push({
                k: key,
                v: data[key]
            });
            var sql = new a.SQLite(_data);
            a.equal(args, {
                vKey: "k",
                sKey: "v",
                SelectBox: {
                    showNum: false,
                    SQLite: sql,
                    paramet: {
                        pageNum: 1
                    },
                    dataString: "<div class='autoList' vaule='{k}'>{v}</div>"
                }
            })
            var onlySelect = new a.OnlySelectBox(obj, args);
            this.setReadOnly = function(b) {
                onlySelect.readOnly = b;
                if (b) {
                    obj.attr('readonly', 'readonly');
                } else {
                    obj.removeAttr('readonly');
                }
            }
            this.val = function(s) {
                if (s == undefined) {
                    return onlySelect.val();
                } else {
                    sql.find({
                        k: s
                    }, function(res) {
                        if (res.length > 0) onlySelect.val(s, res[0].v);
                    });
                }
            }
        }
        //带复选框的树形图
    a.ZtreeSelectCheckBox = function(obj, args) {
            this.zNodes = [];
            this.check = args.check || false;
            var _this = this;
            var setting = {
                check: {
                    enable: this.check,
                    chkboxType: {
                        "Y": "",
                        "N": ""
                    }
                },
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onCheck: onCheck,
                    beforeExpand: beforeExpand
                }
            };

            Y.ajax(ucIP + "/api/uc/v0.1/groups/nextLevel", function(ret) {
                if (ret.length > 0) {
                    for (var i = 0; i < ret.length; i++) {
                        var item = ret[i];
                        if (item.groupName!='未分组') {  //不显示未分组
                            _this.zNodes.push({
                                id: item.groupId,
                                name: item.groupName,
                                icon: 'css/metroStyle/img/parent.png',
                                pId: 0
                            })
                            if (item.nextLevelGroupAndUserInfoList.length > 0) {
                                for (var j = 0; j < item.nextLevelGroupAndUserInfoList.length; j++) {
                                    var items = item.nextLevelGroupAndUserInfoList[j];
                                    _this.zNodes.push({
                                        id: items.groupId,
                                        name: items.groupName,
                                        pId: item.groupId,
                                        chkDisabled: false,
                                        icon: 'css/metroStyle/img/parent.png'
                                    })

                                    /*if (items.groupUserInfoDtoList.length>0) {
                                      for (var q = 0; q < items.groupUserInfoDtoList.length; q++) {
                                        var itemss = items.groupUserInfoDtoList[q];
                                        _this.zNodes.push({id:itemss.accountId,name:itemss.name,pId:items.groupId,isPerson:true})
                                      };
                                    };*/
                                };
                            };
                        };
                    };
                };
            }, {
                meth: 'GET',
                data: {},
                dataJson: false
            })


            function beforeClick(treeId, treeNode) {
                obj.val(treeNode.name).attr('data-id', treeNode.id);
                hideMenu();
            }

            function beforeExpand(treeId, treeNode) {
                for (var i = 0; i < treeNode.children.length; i++) {
                    var item = treeNode.children[i];
                    if (item.icon) {
                        itemAjax(item, treeNode)
                    };
                };
            }

            function itemAjax(item, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo0");
                if (!treeNode.addnodes) {
                    Y.ajax(ucIP + "/api/uc/v0.1/groups/nextLevel", function(ret) {
                        if (ret.length > 0) {
                            item.hasChild = true;
                            for (var j = 0; j < ret.length; j++) {
                                var items = ret[j];
                                zTree.addNodes(item, {
                                    id: items.groupId,
                                    pId: item.id,
                                    name: items.groupName,
                                    chkDisabled: false,
                                    icon: 'css/metroStyle/img/parent.png'
                                }, true);
                                treeNode.addnodes = true; //添加过标识
                            };
                        };
                        if (_this.check) {
                            var checkStr = _this.val();
                            var checkArr = checkStr.split(',');
                            for (var i = 0; i < checkArr.length; i++) {
                                var hasNodes = zTree.getNodeByParam("id", checkArr[i]);
                                if (hasNodes) {
                                    zTree.checkNode(hasNodes, true);
                                };
                            };
                        };
                    }, {
                        meth: 'GET',
                        data: {
                            parentId: item.id
                        },
                        dataJson: false
                    })
                };
            }

            function onCheck(e, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo0"),
                    nodesc = treeNode.children;
                /*if (nodesc) {
                    for (var i = 0; i < nodesc.length; i++) {
                        console.log(nodesc[i])
                        if (treeNode.checked) {
                            nodesc[i].chkDisabled = true;
                        } else {
                            nodesc[i].chkDisabled = false;
                        };
                        zTree.updateNode(nodesc[i]);
                    };
                };*/

                var nodes = zTree.getCheckedNodes(true),
                    v = "",
                    id = "";
                for (var i = 0, l = nodes.length; i < l; i++) {
                    v += nodes[i].name + ",";
                    id += nodes[i].id + ",";
                }
                if (v.length > 0) {
                    v = v.substring(0, v.length - 1)
                    id = id.substring(0, id.length - 1)
                };
                var cityObj = obj;
                cityObj.attr({
                    "value": v,
                    "data-id": id
                });
            }

            function showMenu() {

                var cover = '<div id="zTree_cover" style="position: fixed; z-index: 100; left: 0px; top: 0px; opacity: 0; background: rgb(255, 255, 255); width: 100%; min-height: 564px;"></div>'
                var selBox = cover + '<div id="menuContent" class="menuContent" style="display:none; position: absolute; z-index: 101; overflow:auto;background:#fff;border:1px solid #e3e3e3">'
                    + '<div style="position: absolute;bottom: 0;width: 100%;background: #00b7ee;color:#fff;height: 28px;line-height: 28px;text-align: center;border-top: 1px solid #eee;cursor: pointer;">'
                    + '<span style="background:#00b7ee;float:left;width:50%;color:#fff" id="menuOk">确定</span><span style="background:#fff;float:left;width:50%;color:#333;" id="menuClose">清空</span></div>'
                    + '<ul id="treeDemo0" class="ztree" style="margin-top:0; width:220px; height: 300px;padding-bottom: 30px;overflow: auto;"></ul>'
                    + '</div>'
                var cityObj = obj;
                var cityOffset = obj.offset();
                $("#zTree_cover").remove();
                $(".menuContent").remove();
                $("body").append(selBox);
                $("#menuContent").css({
                    left: cityOffset.left + "px",
                    top: cityOffset.top + cityObj.outerHeight() + "px"
                }).slideDown("fast");
                $("body").bind("mousedown", onBodyDown);
                $.fn.zTree.init($("#treeDemo0"), setting, _this.zNodes);
                var zTree = $.fn.zTree.getZTreeObj("treeDemo0");
                if (_this.check) {
                    var checkStr = _this.val();
                    if (checkStr) {
                        var checkArr = checkStr.split(',');
                        for (var i = 0; i < checkArr.length; i++) {
                            var hasNodes = zTree.getNodeByParam("id", checkArr[i]);
                            if (hasNodes) {
                                zTree.checkNode(hasNodes, true);
                            };
                        };
                    };
                };
                $("#menuClose").click(function() {
                    cityObj.val("").attr("data-id","");
                    zTree.checkAllNodes(false);
                    hideMenu();
                })
                $("#menuOk").click(function(){
                    hideMenu();
                })
            }

            function onBodyDown(event) {
                if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
                    hideMenu();
                }
            }

            function hideMenu() {
                $("#zTree_cover").remove();
                $("#menuContent").fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }

            obj.click(function() {
                showMenu();
            })
            this.val = function(val, v) {
                if (val && val != "0") {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    if (zTree) {
                        var sNodes = zTree.getSelectedNodes();
                        var node = sNodes[0].getParentNode();
                        obj.val(node.name).attr("data-id", node.id)
                    } else {
                        var nameL = [],
                            idL = [];
                        for (var i = 0; i < val.length; i++) {
                            nameL.push(val[i].name);
                            idL.push(val[i].groupId);
                        };
                        obj.val(nameL.join(',')).attr("data-id", idL.join(','))
                    };
                }
                if (v) {
                    obj.val(v).attr("data-id", val)
                };
                return obj.attr("data-id");
            }
        }
        //选择多个
    a.AnySelectBox = function(obj, clickObj, args) {
            var _this = this;
            this.maxSize = args.maxSize || 0;
            this.appendFn = undefined;
            this.appendFun = args.appendFun;
            this.readOnly = args.readOnly || false;
            this.value = [];
            this.eachFn = args.eachFn;
            this.valArr = args.valArr;
            this.valData = args.valData; //设置为true返回的也是对象
            this.id = (new Date()).only();
            this.deleteFn = undefined;
            this.valueString = args.valueString;
            this.addList = [];
            this.setReadOnly = function(b) {
                this.readOnly = b;
            }
            args.SelectBox.action = function(res) {
                if (res.length > 0) {
                    var _value = a.clone(_this.value);
                    for (i = 0; i < res.length; i++) {
                        var has = false;
                        for (var j = 0; j < _this.value.length; j++)
                            if (_this.value[j][args.idKey] == res[i][args.idKey]) has = true;
                        if (!has) _this.value.push(res[i]);
                    }
                    if (_this.maxSize && (_this.value.length > _this.maxSize)) { //超过最大个数，还原vaule
                        _this.value = _value;
                        a.alertx("最多" + _this.maxSize + "个");
                    } else {
                        _this.append();
                    }
                }
            }
            args.SelectBox.selectMax = 0;
            var selectBox = new a.SelectBox(args.SelectBox);
            clickObj.bind("click", function() {
                if (_this.readOnly) return false;
                if (_this.value.length > 0 && args.delFn != false) {
                    selectBox.delFn = function() { //清空按钮
                        _this.value = [];
                        _this.append();
                    }
                } else {
                    selectBox.delFn = "";
                }
                selectBox.hasValue = _this.valArr ? _this.val().join(",") : _this.val();

                if (_this.valData) {
                    var hasValue = [],
                        val = _this.val();
                    for (var i = 0; i < val.length; i++) hasValue.push(val[i][args.idKey]);
                    selectBox.hasValue = hasValue.join(",");
                }
                if (args.prevClickFn) args.prevClickFn(selectBox);
                selectBox.open();
            })
            this.val = function(s) {
                if (s) {
                    this.value = s;
                    this.append();
                } else {
                    var rc = [];
                    for (var i = 0; i < this.value.length; i++) rc.push(this.valData ? this.value[i] : this.value[i][args.idKey]);
                    rc = this.valArr || this.valData ? rc : rc.join(",");
                    return rc;
                }
            }
            this.append = function(bool) {
                if (typeof this.value != "string")
                    if (typeof this.valueString == "string") {
                        var html = "";
                        for (var i = 0; i < this.value.length; i++) {
                            html += this.valueString._eval(this.value[i], args.valueStringEval);
                        }
                        args.type === 'input' ? obj.val(html) : obj.html(html)
                    } else if (typeof this.valueString == "function") {
                    obj.empty();
                    for (var i = 0; i < this.value.length; i++) obj.append(this.valueString(this.value[i]));
                    }
                //obj.html(html);

                if (this.appendFun) {
                    this.appendFun(this.addList)
                };

                a.loadImg(obj.find(".icon_img"), {
                    attrName: "imgUrl",
                    err: false
                });
                obj.children().each(function(i) {
                    var $this = $(this);
                    $this.append(args.removeHtml ? args.removeHtml : "<img class='remove' src='images/icon_remote.png' style='width:16px;height:16px;display:none;position:relative;cursor:pointer;top:-" + ($this.height() - 10) + "px;left:" + ($this.width() / 2) + "px;' />");
                    $this.find(".remove").click(function() {
                        if (_this.readOnly) return false;
                        //获取值
                        var _UID = $this.attr(args.idKey);
                        var _item = null;
                        var rc = [];
                        for (var i = 0; i < _this.value.length; i++)
                            if (_UID != _this.value[i][args.idKey]) {
                                rc.push(_this.value[i])
                            } else {
                                _item = _this.value[i]
                            }

                        if (_this.deleteFn) {
                            if (_this.deleteFn($this, _UID, _item) == false) {
                                return false;
                            } else {
                                localDelete();
                                return;
                            }
                        };
                        a.confirmx("确定删除？", function() {
                            localDelete();
                        }, {
                            titleHeight: 0,
                            styles: {
                                bottom: 'border-top:none;',
                                center: 'border-top:none;',
                                box: 'left:' + ($this.offset().left - 120) + 'px;top:' + ($this.offset().top - 100) + 'px;'
                            },
                            _h: 110,
                            _w: 200
                        });

                        function localDelete() {
                            _this.value = rc;
                            $this.remove();
                            if (_this.appendFn) _this.appendFn( /*"delete",_UID,_item*/ );
                        }
                    })
                    $this.bind("mouseover", function() {
                        if (_this.readOnly) return false;
                        $this.find(".remove").show();
                    })
                    $this.bind("mouseout", function() {
                        $this.find(".remove").hide();
                    })
                })
                if (!bool && this.appendFn) this.appendFn();
            }
            this.selectBox = function(k, v) {
                if (v == undefined) {
                    return selectBox[k];
                } else {
                    selectBox[k] = v;
                }
            }
        }
        //多级联动
    a.Linkage = function(obj, args) {
            var _this = this;
            args = args || {};
            this.id = (new Date()).only();
            this.data = null;
            this.idKey = "id";
            this.pidKey = "parentId";
            this.nameKey = "name";
            this.selectData = [];
            this.SelectBox = {
                url: "",
                paramet: {},
                dataString: ""
            };
            this.inputStyle = "<input value='请选择' type='text' />";
            this.changeFn = args.changeFn || '';
            var selectBox = [];
            this.append = function(n, id) {
                //新增输入框
                //this.SelectBox.paramet[this.pidKey] = id;
                var _inputStyle = this.inputStyle.replace("id='num{n}'", "");
                _inputStyle = _inputStyle.replace("<input", "<input id='num" + this.id.toString() + n.toString() + "'")
                obj.append(_inputStyle);
                this.SelectBox.selectMax = 1;
                this.SelectBox.action = function(res, s) {
                    if (res && res.length == 1) {
                        n = s.flog;
                        _this.selectData[n] = res[0];
                        $("#num" + _this.id + n).val(_this.selectData[n][_this.sKey]);
                        $("#num" + _this.id + n).nextAll().remove();
                        _this.selectData.length = n + 1;
                        _this.SelectBox.paramet[_this.pidKey] = _this.selectData[n][_this.idKey];
                        a.ajax(_this.SelectBox.url, function(res) {
                            if (res && res.rows && res.rows.length > 0) {
                                _this.append(n + 1, _this.selectData[n][_this.idKey]);
                            } else {
                                if (_this.changeFn) _this.changeFn(_this.selectData);
                            }
                        }, {
                            data: _this.SelectBox.paramet
                        })
                    }
                }
                selectBox[n] = new a.SelectBox(this.SelectBox);
                selectBox[n].flog = n;
                $("#num" + this.id + n).bind("click", function() {
                    selectBox[n].paramet[_this.pidKey] = id;
                    selectBox[n].open();
                })
            }
            this.setSelect = function(n) {
                if ($("#num" + this.id + n).size() == 1) {
                    $("#num" + this.id + n).val(this.selectData[n][this.sKey]);
                }
            }
            this.load = function(id) {
                this.append(0, id);
            }
            this.val = function(s) {
                if (s != undefined) {
                    this.selectData = s;
                    for (var i = 0; i < s.length; i++) {
                        if (i < s.length - 1) this.append(i + 1, s[i][this.idKey]);
                        this.setSelect(i);
                    }
                    if (this.changeFn) this.changeFn(this.selectData);
                } else {
                    return this.selectData.length > 0 ? [{
                        id: this.selectData[this.selectData.length - 1][this.idKey]
                    }] : [];
                }
            }
        }
        //Excel批量导入
    a.excelImport = function(url1, url2, url3, args) {
        args = args || {};
        //下载模板
        $("#downLoadListModle").click(function() {
            a.download(url3);
        });
        //获取进度
        var isOver = false;
        var isUpload = false;

        function getPlan(bool) {
            if (!url1) return false;
            a.ajax(url1, function(res) {
                if (res && res.sumNum != undefined) {
                    var allNum = res.successNum + res.falseNum;
                    if (allNum == res.sumNum) isOver = true;
                    $("#allNum").html(allNum);
                    $("#falseNum").html(res.falseNum);
                    $("#sumNum").html(res.sumNum);
                    var percent = res.sumNum == 0 ? 0 : Math.ceil(allNum / res.sumNum * 100);
                    percent = percent > 100 ? 100 : percent;
                    $("#percent").html(percent);
                }
                if (isUpload || !isOver) {
                    $("#planBox").show();
                    setTimeout(function() {
                        getPlan(bool)
                    }, 1000);
                } else {
                    $("#planBox").hide();
                    isOver = true;
                }
            });
        }

        if (!args.noBeginGet) {
            getPlan();
        } else {
            isOver = true;
        }
        //取消上传
        var canCel = true;
        $("#cancelPlan").click(function() {
                if (!canCel) return false;
                a.confirmx("正在上传,确定取消?", function() {
                    canCel = false;
                    $("#cancelPlan").html("正在取消...");
                    a.ajax(url1, function(res) {
                        if (res && res.result) {
                            //isOver = true;
                            canCel = true;
                            $("#cancelPlan").html("取消成功");
                        }
                    }, {
                        meth: "DELETE"
                    })
                })
            })
            //导入
        $("#upLoadList").click(function() {
            if (!isOver) {
                a.alertx("当前正在导入!");
                return false;
            }
            isUpload = true;
            a.upload(url2, function(res) {
                isUpload = false;
                isOver = true;
                if (res && res.result) {
                    a.alertx("导入成功," + res.msg);
                } else {
                    if (res && res.url) {
                        a.confirmx("<div style='color: #ff0000;font-weight:bold;'>导入失败!</div>" + res.msg + "<div style='color: #ff0000;'>点击确定下载失败的数据?</div>", function() {
                            a.download(res.url);
                        });
                    } else {
                        a.confirmx("<div style='color: #ff0000;font-weight:bold;'>导入失败!</div>");
                    }
                }
                if (res.totalSuccess > 0) {
                    a.refresh(); //刷新页面
                }
            }, {
                timesFn: function() {
                    getPlan(true);
                    isOver = false;
                }
            });
        })
    }
    a.Tree = function(obj, data, idKey, childKey, nodeHtml, action) { //data 数据源,childKey 子节点关键字 htmlStyle 节点html风格
        this.data = data;
        this.action = action;
        this.build = function(node, pid) {
            var list = arguments.length == 2 ? node : this.data;
            var tree = "<div class='tree'></div>";
            if (!pid) {
                obj.html(tree);
                tree = $(".tree").eq(0);
            } else {
                tree = $("#" + pid).find(".tree").eq(0);
            }
            var hasChild = false;
            var hasBtns = false;
            for (var i = 0; i < list.length; i++) {
                var btnHtml = ""
                if (list[i].buttons.length > 0) {
                    for (var j = 0; j < list[i].buttons.length; j++) {
                        var item = list[i].buttons[j]
                        btnHtml += "<div class='nodeData btnList'><input class='checkBtn' type='checkbox' data-type='" + item.buttonType + "' data-id='" + item.buttonId + "' " + item.checked + " /><label for='c_" + item.buttonId + "'>" + item.title + "</label></div>"
                    };
                };
                var html = nodeHtml;
                var btnHtml = list[i].buttons.length > 0 ? "<div class='tree'><div class='btn-title'><input class='checkBtn checkBtnAll' type='checkbox'>按钮权限</div><div class='node nodeBtn' id='" + list[i].id + "'>" + btnHtml + "</div></div>" : '';
                for (var k in list[i]) {
                    html = html.replace(new RegExp("{" + k + "}", "g"), list[i][k]);
                }
                var node = "<div class='node" + (i == list.length - 1 && list[i][childKey].length <= 0 ? " lastNode" : "") + "' id='node" + list[i][idKey] + "' data='" + JSON.stringify(list[i]) + "'>" + html + btnHtml;
                node += list[i][childKey].length > 0 ? "<div class='tree'></div></div>" : "</div>";
                tree.append(node);
                if (list[i][childKey].length > 0) { //递归遍历
                    hasChild = true;
                    this.build(list[i][childKey], "node" + list[i][idKey]);
                }
                if (list[i].buttons.length > 0) {
                    hasBtns = true;
                    this.build(list[i][childKey], "node" + list[i][idKey]);
                }
            }
            if (!hasChild) {
                var width = !hasBtns ? "200px" : "auto";
                var Float = !hasBtns ? "left" : "none";
                tree.find(".node").css({
                    width: width,
                    float: Float
                });
                tree.append("<div style='clear:both;'></div>");
            }
            if (arguments.length == 0 && this.action && typeof(action) == "function") action(); //初次加载的时候绑定事件
        }
        this.html = function(s) {
            if (s) {
                this.data = s;
                this.build();
            } else {
                return this.data;
            }
        }
    }
    a.Accessory = function(clickObj, contentObj, dataObj, unEditable) {
        var _this = this;
        this.data = [];
        this.id = (new Date()).only();
        if (!unEditable) {
            clickObj.click(function() {
                a.upload(csIP + "/api/cs/v0.1/public", function(res, filesData) {
                    if (res && res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            var o = {};
                            for (var k in dataObj) {
                                if (k == "url") {
                                    o[dataObj[k]] = res[i];
                                } else {
                                    o[dataObj[k]] = filesData[i][k];
                                }
                            }
                            _this.data.push(o);
                        }
                        _this.append();
                    }
                }, {
                    maxSize: (1 * 1024 * 1024 * 1024 * 100)
                })
            })
        }
        this.append = function() {
            var html = "";
            for (var i = 0; i < this.data.length; i++) {
                html += "<div flog='" + i + "' style='height:30px;overflow:hidden;line-height:30px;'><span style='float:left;color:#00b7ee;'>" + this.data[i][dataObj.name] + "</span><img class='accessory_download' style='cursor:pointer;margin-left:10px;float:left;margin-top:8px;' src='images/icon_down.png' />";
                //html += "<img class='accessory_prevView' style='cursor:pointer;margin-left:10px;float:left;margin-top:8px;' src='images/can.png' />";//预览
                html += !unEditable ? "<img class='remove' style='cursor:pointer;margin-left:10px;float:left;margin-top:8px;' src='images/icon_remove.png' />" : "";
                html += "</div>";
            }
            contentObj.html(html);
            $(".accessory_download").click(function() {
                var flog = $(this).parent().attr("flog");
                a.download(_this.data[flog][dataObj.url] + "?name=" + _this.data[flog][dataObj.name]);
            })
            $(".accessory_prevView").click(function() {
                //预览
                var flog = $(this).parent().attr("flog");
                var html = "<div id='accessoryPrevView' style='position:fixed;width:100%;height:" + $(window).height() + "px;zIndex:99999;left:0px;top:0px;'><object id='preview_obj' classid='clsid:CA8A9780-280D-11CF-A24D-444553540000' width='100%'' height='" + $(window).height() + "' border='0'>";
                html += "<param name='_Version' value='65539'>";
                html += "<param name='_ExtentX' value='20108'>";
                html += "<param name='_ExtentY' value='10866'>";
                html += "<param name='_StockProps' value='0'>";
                html += "<param name='SRC' value='" + _this.data[flog][dataObj.url] + "'>";
                html += "<embed id='preview_emb' src='" + _this.data[flog][dataObj.url] + "' width='100%' height='" + $(window).height() + "' href='" + _this.data[flog][dataObj.url] + "'></embed>";
                html += "</object></div>";
                $("body").html(html);
            })
            $(".remove").click(function() {
                var flog = $(this).parent().attr("flog");
                a.confirmx("确定删除？", function() {
                    var arr = [];
                    for (var i = 0; i < _this.data.length; i++) {
                        if (i != flog) arr.push(_this.data[i]);
                    }
                    _this.data = arr;
                    _this.append();
                })
            })
        }
        this.val = function(s) {
            if (s == undefined) {
                return this.data;
            } else {
                this.data = s;
                this.append();
            }
        }
    }
    a.qiNiouKey = function(fn) {
        fn({
            url: 'http://upload.qiniu.com/',
            retFn: function(ret, fn) {
                if (ret.key) {
                    fn('http://esimages.veducloud.com/' + ret.key);
                }
            },
            beforeAction: function(formData, file, fn) {
                var key = file.name.split('.'),
                    type = key[key.length - 1];
                key[key.length - 1] = '';
                key = MD5(key.join('.') + (new Date().only())) + '.' + type;
                Y.ajax(eschoolIP + '/api/cms/qiniu/v0.1/open/token', function(ret) {
                    formData.append('token', ret.uptoken);
                    formData.append('key', key);
                    fn();
                }, {
                    data: {
                        key: key
                    }
                })
            }
        })
    }
    a.config = function(fn) {
        if (a.configGeted) {
            fn();
        } else {
            Y.ajax(eschoolIP + '/api/cms/config/{type}/fields/{fields}', function(ret) {
                if (ret.errorMsg) {
                    Y.alertx('获取表单配置失败,' + ret.errorMsg);
                } else {
                    //获取配置文件
                    (function(src) {
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.onload = function() {
                            a.configGeted = true;
                            fn();
                        }
                        script.src = src;
                        document.body.appendChild(script);
                    })(ret)
                }
            }, {
                data: {
                    type: 1,
                    fields: 'cms_schoolId_' + schoolId
                },
                dataType: 'text'
            })
        }
    }
    a.ComponentAnalysis = function(components, readOnly) {
            this.config = {
                input: {
                    template: '<div class="data width50"><div class="data_title">{_canNotFlag}{label}</div><span id="err-{id}" class="data_error"></span><input class="input" id="data-{id}" type="{type}" placeholder="{placeholder}" {readOnly_} /></div>',
                    templateEval: function(s, k, v, o) {
                        return s.replace(new RegExp('{_canNotFlag}'), function() {
                            return o.rule.NotNull ? '<b class="red">*</b>' : '';
                        }).replace(new RegExp('{readOnly_}'), !v.readOnly && !readOnly ? '' : 'readonly')
                    },
                    init: function(_this, component) {
                        if (component.attr.defaultValue) $('#data-' + component.id).val(component.attr.defaultValue);
                        $('#data-' + component.id).bind('blur', function() {
                            _this.verify();
                        })
                    },
                    val: function(_this, component, v) {
                        if (v == undefined) {
                            return $('#data-' + component.id).val();
                        } else {
                            $('#data-' + component.id).val(v);
                        }
                    }
                },
                textarea: {
                    template: '<div class="data width100"><div class="data_title">{_canNotFlag}{label}</div><span id="err-{id}" class="data_error"></span><textarea id="data-{id}" class="input" style="height: 90px;" placeholder="{placeholder}" {readOnly_}></textarea></div>',
                    templateEval: function(s, k, v, o) {
                        return s.replace(new RegExp('{_canNotFlag}'), function() {
                            return o.rule.NotNull ? '<b class="red">*</b>' : '';
                        }).replace(new RegExp('{readOnly_}'), !v.readOnly && !readOnly ? '' : 'readonly')
                    },
                    init: function(_this, component) {
                        if (component.attr.defaultValue) $('#data-' + component.id).val(component.attr.defaultValue);
                        $('#data-' + component.id).bind('blur', function() {
                            _this.verify();
                        })
                    },
                    val: function(_this, component, v) {
                        if (v == undefined) {
                            return $('#data-' + component.id).val();
                        } else {
                            $('#data-' + component.id).val(v);
                        }
                    }
                },
                radio: {
                    template: '<div class="data width100"><input type="hidden" id="data-{id}" /><div class="data_title">{_canNotFlag}{label}</div><span id="err-{id}" class="data_error"></span><span id="data-{id}">{_actions}</span></div>',
                    templateEval: function(s, k, v, o) {
                        return s.replace(new RegExp('{_' + k + '}'), function() {
                            var rc = '';
                            for (var i = 0; i < v.length; i++) rc += '<input type="radio" value="' + v[i].value + '" ' + (v[i].selected ? 'checked' : '') + ' />' + v[i].name;
                            return rc;
                        }).replace(new RegExp('{_canNotFlag}'), function() {
                            return o.rule.NotNull ? '<b class="red">*</b>' : '';
                        })
                    },
                    o: '',
                    init: function(_this, component) {
                        this.o = new a.Radio($('#data-' + component.id + ' input'));
                    },
                    val: function(_this, component, v) {
                        $("#data-" + component.id).val(this.o.val());
                        if (v == undefined) {
                            return this.o.val();
                        } else {
                            this.o.val(v);
                        }
                    }
                },
                checkbox: {
                    template: '<div class="data width100"><input type="hidden" id="data-{id}" /><div class="data_title">{_canNotFlag}{label}</div><span id="err-{id}" class="data_error"></span><span id="data-{id}">{_actions}</span></div>',
                    templateEval: function(s, k, v, o) {
                        return s.replace(new RegExp('{_' + k + '}'), function() {
                            var rc = '';
                            for (var i = 0; i < v.length; i++) rc += '<input type="checkbox" value="' + v[i].value + '" ' + (v[i].selected ? 'checked' : '') + ' />' + v[i].name;
                            return rc;
                        }).replace(new RegExp('{_canNotFlag}'), function() {
                            return o.rule.NotNull ? '<b class="red">*</b>' : '';
                        })
                    },
                    o: '',
                    init: function(_this, component) {
                        this.o = new Y.Checkbox($('#data-' + component.id + ' input'));
                    },
                    val: function(_this, component, v) {
                        $("#data-" + component.id).val(this.o.val());
                        if (v == undefined) {
                            return this.o.val();
                        } else {
                            this.o.val(v);
                        }
                    }
                }
            }
            this.component = {};
            this.init = function(obj) {
                //$("#data-79735241").val('测试')
                var _this = this,
                    html = '';
                for (var i = 0; i < components.length; i++) {
                    (function(i) {
                        var component = components[i],
                            config = a.clone(_this.config[component.type]);
                        if (config) {
                            html += config.template._eval(component, config.templateEval)._eval(component.attr, config.templateEval);
                            _this.component['_' + component.id] = {
                                label: component.label,
                                o: $('#data-' + component.id),
                                id: component.id,
                                error: function(s) {
                                    $('#err-' + component.id).html(s);
                                    $('#err-' + component.id).show();
                                },
                                verify: function() {
                                    var value = $('#data-' + component.id).val();
                                    var err = [];
                                    if (!component.rule.NotNull && !Y.Verify.NotNull(value)[0]) {
                                        return [true];
                                    } else {
                                        for (var k in component.rule) {
                                            if (component.rule[k]) {
                                                var v = Y.Verify[k](value, component.rule[k]);
                                                if (!v[0]) {
                                                    this.error(v[1]);
                                                    return [false, v[1]];
                                                }
                                            }
                                        }
                                        return [true];
                                    }
                                },
                                val: function(v) {
                                    if (v == undefined) {
                                        return config.val(this, component);
                                    } else {
                                        config.val(this, component, v);
                                    }
                                },
                                init: function() {
                                    if (config.init) {
                                        config.init(this, component);
                                    }
                                }
                            }
                        }
                    })(i)
                }
                obj.html(html);
                for (var key in _this.component)
                    if (_this.component[key].init) _this.component[key].init();
            }
            this.verify = function() {
                var err = [];
                for (var key in this.component) {
                    //var value = this.component[key].o.val();
                    var v = this.component[key].verify();
                    if (!v[0]) err.push(this.component[key].label + v[1]);
                }
                if (err.length > 0) {
                    return [false, err.join(',')];
                } else {
                    return [true];
                }
            }
            this.val = function(data) {
                if (data == undefined) {
                    var o = {};
                    for (var key in this.component) {
                        var v = this.component[key].verify();
                        if (v[0]) {
                            o[this.component[key].id] = this.component[key].val();
                        } else {
                            return;
                        }
                    }
                    return o;
                } else {
                    if (data && typeof data == 'string') data = JSON.parse(data);
                    if (typeof data == 'object')
                        for (var key in data)
                            if (this.component['_' + key] && this.component['_' + key].val) this.component['_' + key].val(data[key]);
                }
            }
        }
        //选择弹出框模板
    a.getSelectBox = function(name, args) {
        args = args || {};
        var template = {
            semester: { //单选学期
                vKey: "id",
                sKey: "name",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "semesterName"
                    },
                    url: ucIP + "/api/uc/v0.1/semester",
                    dataString: "<div class='autoList' vaule='{id}'><span>{name}{_current}</span><span style='color:#ccc;display:block;'>{begdate}至{enddate}</span></div>",
                    dataStringEval: function(s, k, v, o) {
                        return s.replace(new RegExp('{_' + k + '}'), v ? '<div style="color:#ff0000;font-size:12px;">(当前学期)</div>' : '');
                    }
                }
            },
            examscoreType: { //单选考试标题类型
                vKey: "id",
                sKey: "title",
                SelectBox: {
                    showNum: false,
                    paramet: {},
                    url: eschoolIP + "/api/examscore/v0.1/type",
                    dataString: "<div class='autoList' vaule='{id}'><span>{title}</span><span style='color:#ccc;display:block;'>{startTime}至{endTime}</span></div>"
                }
            },
            major: { //单选专业
                vKey: "id",
                sKey: "name",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "majorName"
                    },
                    url: ucIP + "/api/uc/v0.1/majors",
                    dataString: "<div class='autoList' vaule='{id}'><span>{name}</span><span style='color:#ccc;display:block;'>专业代码:{code}</span></div>"
                }
            },
            divisionMajor: { //报道未分班新生专业
                vKey: "id",
                sKey: "name",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "majorName"
                    },
                    url: ucIP + "/api/uc/v0.1/welcome/class/getMajorNames",
                    dataString: "<div class='autoList' vaule='{id}'><span>{name}</span><span style='color:#ccc;display:block;'>专业代码:{code}</span></div>"
                }
            },
            paymentMajor: { //新生缴费单选专业
                vKey: "specname",
                sKey: "specname",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "specname"
                    },
                    url: ucIP + "/api/uc/v0.1/welcome/financeQuery/major",
                    dataString: "<div class='autoList'><span>{specname}</span></div>"
                }
            },
            newMajor: { //单选专业
                vKey: "id",
                sKey: "name",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "majorName"
                    },
                    url: ucIP + "/api/uc/v0.1/majors/new",
                    dataString: "<div class='autoList' vaule='{id}'><span>{name}</span><span style='color:#ccc;display:block;'>专业代码:{code}</span></div>"
                }
            },
            majors: { //多选专业
                idKey: "id",
                valueString: "<div id='{id}' class='personData'><div style='width:50px;height:50px;line-height:50px;text-align:center;border:1px solid #e4e4e4;color:#00b7ee;font-size:20px;margin:7px auto;border-radius:50px;' imgUrl='{photo}' class='icon_img'>{listStyle_name}</div><div>{name}</div></div>",
                SelectBox: {
                    title: '请选择专业',
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/majors",
                    dataString: "<div title='{name}' class='autoList' vaule='{id}'>{has_id}<b class='listStyle_cicle icon_img' imgUrl='{photo}'>{listStyle_name}</b><span>{name}</span></div>"
                }
            },
            dept: { //单选部门
                vKey: "groupId",
                sKey: "name",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/groups",
                    dataString: "<div class='autoList' vaule='{groupId}'><span>{name}</span></div>"
                }
            },
            depts: { //多选部门
                idKey: "groupId",
                valueString: "<div groupId='{groupId}' class='personData'><div style='width:50px;height:50px;line-height:50px;text-align:center;border:1px solid #e4e4e4;color:#00b7ee;font-size:20px;margin:7px auto;border-radius:50px;' imgUrl='{photo}' class='icon_img'>{listStyle_name}</div><div>{name}</div></div>",
                SelectBox: {
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/groups",
                    dataString: "<div title='{name}' class='autoList' vaule='{groupId}'>{has_groupId}<b class='listStyle_cicle icon_img' imgUrl='{photo}'>{listStyle_name}</b><span>{name}</span><!--<span style='color:#ccc;display:block;'>{majorName} {className}</span>--></div>"
                }
            },
            student: { //单选学生
                vKey: "accountId",
                sKey: "name",
                SelectBox: {
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/students",
                    dataString: "<div title='{name}' class='autoList' vaule='{accountId}'><b class='listStyle_cicle icon_img' imgUrl='{photo}'>{listStyle_name}</b><span>{name}</span><span style='color:#ccc;display:block;'>{majorName} {className}</span></div>"
                }
            },
            students: { //多选学生
                idKey: "accountId",
                valueString: "<div accountId='{accountId}' class='personData'><div style='width:50px;height:50px;line-height:50px;text-align:center;border:1px solid #e4e4e4;color:#00b7ee;font-size:20px;margin:7px auto;border-radius:50px;' imgUrl='{photo}' class='icon_img'>{listStyle_name}</div><div>{name}</div></div>",
                SelectBox: {
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/students",
                    dataString: "<div title='{name}' class='autoList' vaule='{accountId}'>{has_accountId}<b class='listStyle_cicle icon_img' imgUrl='{photo}'>{listStyle_name}</b><span>{name}</span><span style='color:#ccc;display:block;'>{majorName} {className}</span></div>"
                },
                valArr:args.valArr
            },
            classe: { //单选班级
                vKey: "classId",
                sKey: "className",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/classes",
                    dataString: "<div class='autoList' vaule='{classId}'><span>{className}</span><span style='color:#ccc;display:block;'>{headTeacherName} {classAddress}</span></div>"
                }
            },
            paymentClasses: { //新生缴费多选班级
                idKey: "classname",
                valueString: "{classname}",
                type: "input",
                SelectBox: {
                    paramet: {
                        key: "classname"
                    },
                    url: ucIP + "/api/uc/v0.1/welcome/financeQuery/class",
                    dataString: "<div title='{className}' class='autoList' vaule='{classname}'>{has_classname}<span>{className}</span></div>"
                }
            },
            classes: { //多选班级
                idKey: "classId",
                valueString: "<div classId='{classId}' class='personData'><div style='width:50px;height:50px;line-height:50px;text-align:center;border:1px solid #e4e4e4;color:#00b7ee;font-size:20px;margin:7px auto;border-radius:50px;' imgUrl='{photo}' class='icon_img'>{listStyle_className}</div><div>{className}</div></div>",
                SelectBox: {
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/classes",
                    dataString: "<div title='{className}' class='autoList' vaule='{classId}'>{has_classId}<span>{className}</span><!--<span style='color:#ccc;display:block;'>{majorName} {className}</span>--></div>"
                },
                valArr:args.valArr
            },
            enteryear: { //单选年份
                vKey: "enteryear",
                sKey: "enteryear",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "enteryear"
                    },
                    url: ucIP + "/api/uc/v0.1/welcome/financeQuery/enteryear",
                    dataString: "<div title='{enteryear}' class='autoList' ><span>{enteryear}</span></div>"
                }
            },
            enteryears: { //多选年份
                idKey: "enteryear",
                valueString: "<div classId='{enteryear}' class='personData'><div>{enteryear}</div></div>",
                SelectBox: {
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/welcome/financeQuery/enteryear",
                    dataString: "<div title='{enteryear}' class='autoList' vaule='{enteryear}'>{has_enteryear}<span>{enteryear}</span><!--<span style='color:#ccc;display:block;'>{majorName} {enteryear}</span>--></div>"
                }
            },
            payBelt: { //单选收费区间
                vKey: "beltname",
                sKey: "beltname",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "beltname"
                    },
                    url: ucIP + "/api/uc/v0.1/welcome/financeQuery/beltname",
                    dataString: "<div title='{beltname}' class='autoList' ><span>{beltname}</span></div>"
                }
            },
            teacher: {
                vKey: "accountId",
                sKey: "name",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/teachers",
                    dataString: "<div class='autoList' vaule='{accountId}'><b class='listStyle_cicle icon_img' imgUrl='{photo}'>{listStyle_name}</b><span>{name}</span><span style='color:#ccc;display:block;'>{groupName} {jobNumber}</span></div>"
                }
            },
            teachers: {
                idKey: "accountId",
                valueString: "<div accountId='{accountId}' class='personData'><div style='width:50px;height:50px;line-height:50px;text-align:center;border:1px solid #e4e4e4;color:#00b7ee;font-size:20px;margin:7px auto;border-radius:50px;' imgUrl='{photo}' class='icon_img'>{listStyle_name}</div><div>{name}</div></div>",
                SelectBox: {
                    paramet: {
                        pageNum: 1,
                        pageSize: 10,
                        keyword: "",
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/teachers",
                    dataString: "<div title='{name}' class='autoList' vaule='{accountId}'>{has_accountId}<b class='listStyle_cicle icon_img' imgUrl='{photo}'>{listStyle_name}</b><div style='display:inline-block;vertical-align:middle;width:calc(100% - 65px)'><span>{name}<font style='color:#3ec0ef;margin-left:5px;'>{birthday}</font></span><span style='color:#ccc;display:block;'>组织:{groupName}</span></div></div>"
                },
                valArr:args.valArr
            },
            groupRole: { //单选部门角色
                vKey: "id",
                sKey: "name",
                SelectBox: {
                    showNum: false,
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/group/role/getGroupRole",
                    dataString: "<div title='{name}' class='autoList' ><span>{name}</span></div>"
                }
            },
            groupRoles: { //多选角色
                idKey: "id",
                valueString: "<div id='{id}' class='personData'><div style='width:50px;height:50px;line-height:50px;text-align:center;border:1px solid #e4e4e4;color:#00b7ee;font-size:20px;margin:7px auto;border-radius:50px;' imgUrl='{photo}' class='icon_img'>{listStyle_name}</div><div>{name}</div></div>",
                SelectBox: {
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/group/role/getGroupRole",
                    dataString: "<div title='{name}' class='autoList' vaule='{id}'>{has_id}<b class='listStyle_cicle icon_img' imgUrl='{photo}'>{listStyle_name}</b><span>{name}</span></div>"
                }
            },
            groupDepartment: { //多选部门
                idKey: "groupId",
                valueString: "<div groupId='{groupId}' class='personData'><div style='width:50px;height:50px;line-height:50px;text-align:center;border:1px solid #e4e4e4;color:#00b7ee;font-size:20px;margin:7px auto;border-radius:50px;' imgUrl='{photo}' class='icon_img'>{listStyle_name}</div><div>{name}</div></div>",
                SelectBox: {
                    paramet: {
                        key: "keyword"
                    },
                    url: ucIP + "/api/uc/v0.1/groups/org",
                    dataString: "<div title='{name}' class='autoList' vaule='{groupId}'>{has_groupId}<b class='listStyle_cicle icon_img' imgUrl='{photo}'>{listStyle_name}</b><span>{name}</span></div>"
                }
            },
        }
        a.equal(template[name], args);
        return template[name];
    }
    a.buildModel = function(obj, modelName, id, args) {
        args = args || {};
        var html = '',
            fromConfig = {
                id: id
            };
        for (var key in Models[modelName]) {
            var attr = Models[modelName][key].attr || {};
            var _html = '<div class="data width' + (attr.divWidth || '50') + '">';
            _html += '<div class="data_title">' + (attr.notnullflog ? '<b class="red">*</b>' : '') + Models[modelName][key].label + '</div>';
            _html += '<span class="data_error"></span>';
            switch (Models[modelName][key].type) {
                case 'Input':
                    _html += '<input class="input" ' + (attr.readonly ? 'readonly' : '') + ' id="data-' + key + '" type="' + (attr.type || 'text') + '" placeholder="' + (attr.placeholder || '') + '"/>';
                    _html += '</div>';
                    break;
                case 'Radio':
                    var actions = '';
                    for (var i = 0; i < attr.actions.length; i++) actions += '<input type="radio" id="radio' + key + i + '" value="' + attr.actions[i].value + '" ' + (attr.actions[i].checked ? 'checked' : '') + '/><label for="radio' + key + i + '">' + attr.actions[i].name + '</label>';
                    _html += '<span id="data-' + key + '" type="radio">' + actions + '</span>';
                    _html += '</div>';
                    break;
                case 'Img':
                    _html += '<div id="data-' + key + '"></div><span style="color: #ccc">建议尺寸' + attr.width + 'x' + attr.height + '</span>';
                    _html += '</div>';
                    break;
                case 'Calendar':
                    _html += '<input class="input" id="data-' + key + '" type="text" placeholder="' + (attr.placeholder || '') + '"/>';
                    _html += '</div>';
                    break;
                case 'Textarea':
                    _html += '<textarea id="data-' + key + '" class="input" style="height: ' + (attr.height || 90) + 'px;" placeholder="' + (attr.placeholder || '') + '"></textarea>';
                    _html += '</div>';
                    break;
                default:
                    if (args.components && args.components[Models[modelName][key].type]) {
                        _html += args.components[Models[modelName][key].type].init(Models[modelName][key]);
                        _html += '</div>';
                    } else {
                        _html = '';
                    }
                    break;
            }
            html += _html;
        }
        obj.html(html + '<div class="clear asd"></div>');
        for (var key in Models[modelName]) {
            if (key == (args.idKey || 'id')) continue;
            (function(key) {
                var attr = Models[modelName][key].attr || {};
                var config = {};
                var rule = Models[modelName][key].rule;
                if (rule) {
                    config.f = function(v) {
                        if (!a.Verify.NotNull(v)[0] && !rule.NotNull) {
                            return [true];
                        } else {
                            for (var key in rule) {
                                var _v = a.Verify[key](v, rule[key]);
                                if (!_v[0]) {
                                    return _v;
                                }
                            }
                            return [true];
                        }
                    }
                }
                if (Models[modelName][key].type) {
                    switch (Models[modelName][key].type) {
                        case 'Radio':
                            config.o = new a.Radio($('#data-' + key + ' input'));
                            break;
                        case 'Img':
                            config.o = new a.Img($('#data-' + key), "<img style='cursor: pointer;' src='images/headPortrait.png' />", {
                                width: attr.width,
                                height: attr.height,
                                radius: attr.radius,
                                scale: attr.scale
                            });
                            break;
                        case 'Calendar':
                            config.o = $('#data-' + key);
                            config.i = function() {
                                var calendar = new a.Calendar($("#data-" + key), attr.calendarArgs);
                                $("#data-" + key).focus(function() {
                                    var _this = $(this);
                                    _this.prev().hide();
                                    calendar.open(function(d) {
                                        _this.val(d);
                                        calendar.close();
                                    });
                                })
                            }
                            break;
                        default:
                            if (args.components && args.components[Models[modelName][key].type]) {
                                a.equal(config, args.components[Models[modelName][key].type].config);
                            } else {
                                config.o = $('#data-' + key);
                                config.e = attr.e;
                            }
                            break;
                    }
                } else {
                    config = Models[modelName][key].value || '';
                }
                fromConfig[key] = config;
            })(key)
        }
        return fromConfig;
    }
    a.disabled = function(o, args) {
        args = args || {};
        for (var key in o) {
            if (o[key] && typeof o[key] == 'object') {
                var _o = o[key];
                if (_o.o && _o.o.val) {
                    _o = _o.o;
                    if (_o.width) {
                        _o.attr('disabled', 'true');
                        _o.attr('placeholder', '');
                        _o.css(args.style || {
                            background: '#ffffff',
                            border: 'none'
                        });
                    } else if (_o.setReadOnly) {
                        _o.setReadOnly(true);
                    }
                }
            }
        }
        $('#right input,#right textarea').each(function() {
            if (this.type != 'button' && this.type != 'submit') {
                $(this).attr('disabled', 'true');
                $(this).css(args.style || {
                    background: '#ffffff',
                    border: 'none'
                });
            }
        })
    }
    a.dataAnalyzePick = function(callback, defaultType, obj, types) {
        types = types || {
            year: true,
            month: true,
            week: true
        };
        var type = defaultType || '',
            selects = {};
        for (key in types) {
            (function(key, types) {
                if (!type) type = key;
                var yearArray = [];
                for (var i = 0; i < dataDic[key + 's'].length; i++) yearArray.push({
                    id: i,
                    name: dataDic[key + 's'][i]
                });
                for (var _key in types)
                    if (_key != key) yearArray.push({
                        id: _key,
                        name: ''
                    });
                selects[key] = new a.SelectBox({
                    selectMax: 1,
                    onlySelect: true,
                    boxStyle: "width:" + (obj.width() < 200 ? 200 : obj.width()) + "px;border-radius:0px;position:absolute;margin-left:0px;margin-top:0px;left:" + obj.offset().left + "px;top:" + (obj.offset().top + obj.height() + 5) + "px;z-index:" + a.zIndex(4) + 99999,
                    SQLite: new a.SQLite(yearArray),
                    paramet: {},
                    showNum: false,
                    dataString: "<div class='autoList' vaule='{id}'><div style='text-align:center'>{_name}</div></div>",
                    dataStringEval: function(s, k, v, o) {
                        return s.replace('{_' + k + '}', function() {
                            switch (o.id) {
                                case 'year':
                                    return '<div style="color:#ccc;">按年选择>></div>'
                                case 'month':
                                    return '<div style="color:#ccc;">按月选择>></div>';
                                case 'week':
                                    return '<div style="color:#ccc;">按周选择>></div>';
                                case 'section':
                                    return '<div style="color:#ccc;">按学期选择>></div>';
                                default:
                                    return type == 'week' ? '第' + v + '周' : v;
                            }
                        })
                    },
                    action: function(res) {
                        if (res && res.length == 1) {
                            if (/\d/.test(res[0].id)) {
                                callback(type, res[0].name);
                            } else {
                                type = res[0].id;
                                setTimeout(function() {
                                    selects[type].open();
                                }, 300)
                            }
                        }
                    }
                });
            })(key, types)
        }
        selects[type].open();
    }
    a.dataAnalyzePickDept = function(callback, obj) {
        var array = [];
        for (var i = 0; i < dataDic.depts.length; i++) array.push({
            id: i,
            name: dataDic.depts[i]
        });
        var selecter = new a.SelectBox({
            selectMax: 1,
            onlySelect: true,
            SQLite: new a.SQLite(array),
            boxStyle: "width:" + (obj.width() < 200 ? 200 : obj.width()) + "px;border-radius:0px;position:absolute;margin-left:0px;margin-top:0px;left:" + obj.offset().left + "px;top:" + (obj.offset().top + obj.height() + 5) + "px;z-index:" + a.zIndex(4) + 99999,
            paramet: {},
            showNum: false,
            dataString: "<div class='autoList' vaule='{id}'><div style='text-align:center'>{name}</div></div>",
            action: function(res) {
                if (res && res.length == 1) callback(res[0].name);
            }
        });
        selecter.open();
    }
})(window["Y"])