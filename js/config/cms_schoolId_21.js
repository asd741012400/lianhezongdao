Y.Components = function(args){
    args = args || {};
    var _this = this;
    this.from = args.from || [];
    this.data = args.data || {};
    this.html = args.html || '';
    this.isData = args.isData || false;
    var html = '<div style="height:830px">';
    html += '<div class="b_content">\
                <div class="b_continer">\
                    <h4 style="font-size:20px;font-weight:bold;margin-bottom:30px;">填写报名表</h4>\
                    <span style=" margin:0 auto; display:block;">报名须知：身份证号、姓名将引用到报名信息中，以上信息属实，如有虚假，责任自负。</span>\
                    <hr>\
                    <div class="pat1">\
                        <b>基本信息</b>\
                        <div class="from">\
                            <ul class="bm_box">\
                                <li id="name"><span><font style="color: #ff0000;">*</font>姓名</span>\
                                    <input type="text" class="text_b" value="' + (!this.isData ? '' : '{name}') + '" placeholder="输入你的姓名" readonly />\
                                </li>\
                                <li id="sex"><span>性别</span>\
                                    {_sex}\
                                </li>\
                                <li id="idcard"><span><font style="color: #ff0000;">*</font>身份证号码</span>\
                                    <input type="text" class="text_b" value="' + (!this.isData ? '' : '{idcard}') + '" placeholder="输入身份证号码" readonly />\
                                </li>\
                                <li id="phone"><span><font style="color: #ff0000;">*</font>手机号码</span>\
                                    <input type="text" class="text_b" value="' + (!this.isData ? '' : '{phone}') + '" placeholder="输入手机号码" readonly />\
                                </li>\
                            </ul>\
                            <div class="shangc" id="imgUrl">\
                                <div class="shangc_1">{_imgUrl}</div>\
                            </div>\
                        </div>\
                    </div>\
                    <div style="clear:both;"></div>\
                    <div id="fromEdit"></div>\
                </div>\
                <style>\
                    .from{ margin:20px;}\
                    .b_continer{padding:20px; background:#fff; height:auto;}\
                    .b_continer h4{ text-align:center; font-weight:normal; color:#333; margin:10px 0px;}\
                    .b_continer span{font-size:14px; text-align:center;}\
                    .b_continer hr{ border:2px solid #28c3e6; margin:10px 0px;}\
                    .b_continer b{ font-size:14px; color:#2268af; float:left; display:block; width:150px; margin-left:20px; margin-top:15px;}\
                    .bm_box{ float:left; width:550px;}\
                    .bm_box li{ height:auto; line-height:30px; width:100%; margin-bottom:10px; clear:both;}\
                    .bm_box li span{ font-size:14px; color:#333; padding:5px 15px; width:100px; display:block; float:left; text-align:left;}\
                    .bm_box li input{ float:left; height:30px; font-size:13px; line-height:30px; border:1px solid #eee; text-indent:5px; color:#666; outline:none; background:#f8f8f8; width:180px;}\
                    .bm_box .text_b{ width:280px;}\
                    .bm_box .text_c{ width:400px;}\
                    .bm_box .text_d{ width:70px; border:none;}\
                    .bm_box li select{ float:left;width:260px; height:30px; font-size:13px;line-height:30px; border:1px solid #eee; outline:none;background:#f8f8f8;}\
                    .bm_box li textarea{ float:left;border:1px solid #eee; font-size:13px;width:500px; outline:none; vertical-align:top; padding:5px; margin-bottom:10px;background:#f8f8f8;}\
                    .bm_box li img{ padding:0px 10px; vertical-align:middle; float:left;}\
                    .bm_box li i{ font-size:12px; color:#333; padding:0px 10px; height:30px; line-height:30px; display:block; float:left; margin-right:30px; font-style:normal}\
                    .shangc{ float:left; width:60px; margin-left:-70px;}\
                    .shangc_1{ width:100px; background:#eee; height:150px; display:block;font-size:14px; text-align:center; line-height:150px; overflow:hidden;}\
                    .scpic{ display:block; margin-top:10px;}\
                    .sl_text{ width:100px; font-size:12px; color:#999; height:30px; line-height:30px; float:left; margin-right:10px;}\
                    .shangc span{ font-size:12px; text-align:center; color:#999;}\
                    .bm_box li em{font-style:normal; float:left; display:block; width:18px;}\
                    .rk2{font-size:14px; width:1000px; margin-top:20px;height:auto;}\
                    .rk_content2{border-left:1px solid #e3e3e3; display:block;height:auto;}\
                    .rk_content2 li{ display:block;  padding:0px; background:#fff; width:32%; float:left;}\
                    .rk_content2 li a{ display:block; height:70px; line-height:40px; color:#666666; background:#f8f8f8; padding:10px 10px;border:1px solid #eee; margin-right:10px; margin-bottom:10px;}\
                    .rk_content2 li a:hover{ background:#eee;}\
                    .rk_content2 li a img{width:37px; height:37px; padding-top:5px; margin-left:45%;}\
                    .rk_content2 li a span{font-size:14px; line-height:30px; display:block;text-align:center; margin-bottom:10px;}\
                    .btn{ width:400px;margin:30px auto; height:auto;}\
                    .btn a{ display:block; height:30px;line-height:30px; width:120px; text-align:center;font-size:13px; color:#666;background:#f8f8f8;\
                    border:1px solid #eee; border-radius:6px; float:left; margin:0 10px;}\
                    .btn a:hover{ background:#ff9812; color:#fff;}\
                    ul li{list-style-type:none;}\
                </style>\
            </div>'
    html += '</div>';
    this.show = function(){
        var fromData = '';
        this.data = this.data || {};
        this.data.values = this.data.values || {};
        Y.confirmx(html._eval(this.data,null,function(s,o){
            var v = _this.data.sex || 1;
            s = s.replace('{_sex}','<input name="sex" type="radio" style="width:15px;" readonly ' + (v == 1 ? 'checked' : '') + ' /><i>男</i>\<input name="sex" type="radio" style="width:15px;" readonly ' + (v == 0 ? 'checked' : '') + ' /><i>女</i>');
            v = _this.data.imgUrl;
            s = s.replace('{_imgUrl}',v ? '<img width="100" src="' + v + '" />' : '<span>1寸照片</span>');
            return s;
        }),function(){
            _this.from = fromData.components;
        },{drag:false,title:_this.isData ? '报名信息' : '报名表设计',_w:1000,_h:940,initFn:function(){
            fromData = CSShelper({
                status:{readonly:_this.isData},
                fromData:{components:Y.clone(_this.from,true)},
                styles:{
                    width:'1002px',
                    left:'50%',
                    marginLeft:'-500px'
                },
                htmls:{
                    addComponent:_this.isData ? '<span></span>' : '<div style="text-align:center;color:#59a9e1;line-height:50px;cursor:pointer;"><img class="position1" src="images/icon_addFrom_c.png" />添加报名项</div>',
                    addFrom:_this.isData ? '<span></span>' : '<div style="text-align:center;color:#59a9e1;line-height:100px;cursor:pointer;"><img class="position1" src="images/icon_addFrom.png" />添加表单</div>'
                },
                dom:$('#fromEdit')[0],
                Verify:$.Verify,
                verifyMethods:{
                    Phone:{
                        title:'是否电话号码',
                        type:'checkbox'
                    },
                    NotNull:{
                        title:'不能为空',
                        type:'checkbox'
                    },
                    IDCard:{
                        title:'身份证号码',
                        type:'checkbox'
                    },
                    Email:{
                        title:'是否邮箱',
                        type:'checkbox'
                    },
                    Date:{
                        title:'日期格式(yyyy-MM-dd)',
                        type:'checkbox'
                    },
                    PositiveInt:{
                        title:'是否正整数',
                        type:'checkbox'
                    },
                    MaxLength:{
                        title:'最大长度',
                        type:'number'
                    },
                    MinLength:{
                        title:'最小长度',
                        type:'number'
                    },
                    MaxNumber:{
                        title:'最大值',
                        type:'number'
                    },
                    MinNumber:{
                        title:'最小值',
                        type:'number'
                    },
                    Regx:{
                        title:'正则表达式',
                        type:'textarea'
                    }
                },
                componentConfig:{
                    container:{
                        name:'新建表单项',
                        template:'<div><b id="containerTitle{id}">{label}</b><div class="from"><ul class="bm_box" id="container{id}"></ul></div><div class="clear"></div></div>',
                        attr:{
                            label:{
                                type:'text',
                                title:'表单容器',
                                rule:{NotNull:true,MaxLength:15}
                            }
                        }
                    },
                    /*classify1:{
                        name:'常用组件',
                        componentClassify:true
                    },
                    name:{
                        name:'姓名',
                        template:'<li><span>{_canNotFlag}姓名</span><input value="{_id}" type="text" class="text_b" maxlength="{maxlength}" placeholder="{placeholder}" readonly /><div class="clear"></div></li>',
                        templateEvalFinal:function(s,o){
                            return s.replace(new RegExp('{_canNotFlag}'),o.canNotFlag ? '<font style="color: #ff0000;">*</font>' : '').replace(new RegExp('{_id}'),_this.data.values[o.id] || '');
                        },
                        attr:{
                            label:{
                                type:'text',
                                title:'姓名',
                                defaultValue:'姓名'
                            },
                            maxlength:{
                                type:'number',
                                title:'最大字符数',
                                defaultValue:20
                            },
                            placeholder:{
                                type:'text',
                                title:'占位字符',
                                defaultValue:'请输入真实姓名'
                            },
                            canNotFlag:{
                                type:'checkbox',
                                title:'不能为空标记'
                            }
                        }
                    },*/
                    classify2:{
                        name:'自定义组件',
                        componentClassify:true
                    },
                    input:{
                        name:'单行输入框',
                        template:'<li><span>{_canNotFlag}{label}</span><input id="input{id}" type="{type}" class="text_b" maxlength="{maxlength}" placeholder="{placeholder}" value="{defaultValue}" readonly /><div class="clear"></div></li>',
                        templateEvalFinal:function(s,o){
                            return s.replace(new RegExp('{_canNotFlag}'),o.canNotFlag ? '<font style="color: #ff0000;">*</font>' : '');
                        },
                        setVal:!_this.isData ? '' : function(data){
                            $('#input' + data.id).val(_this.data.values[data.id])
                        },
                        attr:{
                            label:{
                                type:'text',
                                title:'标题(必填)',
                                rule:{NotNull:true,MaxLength:5}
                            },
                            type:{
                                type:'select',
                                actions:[
                                    {name:'普通文本(text)',value:'text'},
                                    {name:'数字(number)',value:'number'},
                                    {name:'密码(password)',value:'password'},
                                    {name:'邮箱(email)',value:'email'},
                                    {name:'网址(url)',value:'url'},
                                    {name:'电话号码(tel)',value:'tel'}
                                ],
                                defaultValue:'text'
                            },
                            defaultValue:{
                                type:'text',
                                title:'默认值'
                            }, 
                            maxlength:{
                                type:'number',
                                title:'最大字符数'
                            },
                            placeholder:{
                                type:'text',
                                title:'占位字符'
                            },
                            canNotFlag:{
                                type:'checkbox',
                                title:'不能为空标记'
                            }
                        }
                    },
                    textarea:{
                        name:'多行输入框',
                        template:'<li><span>{_canNotFlag}{label}</span><textarea id="textarea{id}" class="text_b" maxlength="{maxlength}" placeholder="{placeholder}" rows="{rows}" readonly>{defaultValue}</textarea><div class="clear"></div></li>',
                        templateEvalFinal:function(s,o){
                            return s.replace(new RegExp('{_canNotFlag}'),o.canNotFlag ? '<font style="color: #ff0000;">*</font>' : '');
                        },
                        setVal:!_this.isData ? '' : function(data){
                            $('#textarea' + data.id).val(_this.data.values[data.id])
                        },
                        attr:{
                            label:{
                                type:'text',
                                title:'标题(必填)',
                                rule:{NotNull:true,MaxLength:5}
                            },
                            defaultValue:{
                                type:'text',
                                title:'默认值'
                            },
                            rows:{
                                type:'number',
                                title:'行数',
                                defaultValue:3
                            },
                            maxlength:{
                                type:'number',
                                title:'最大字符数'
                            },
                            placeholder:{
                                type:'text',
                                title:'占位字符'
                            },
                            canNotFlag:{
                                type:'checkbox',
                                title:'不能为空标记'
                            }
                        }
                    },
                    radio:{
                        name:'单选框',
                        template:'<li><span>{_canNotFlag}{label}</span>{_actions}<div class="clear"></div></li>',
                        templateEval:function(s,k,v,o){
                            return s.replace(new RegExp('{_' + k + '}'),function(){
                                var options = '';
                                for(var i = 0; i < v.length; i ++) options += '<input style="width:12px;" ' + (v[i].selected ? 'checked' : '') + ' value="' + v[i].value + '" type="radio" name="radio' + o.id + '" id="radio' + o.id + '_' + i + '" /><i>' + v[i].name + '</i>';
                                return options;
                            })
                        },
                        templateEvalFinal:function(s,o){
                            return s.replace(new RegExp('{_canNotFlag}'),o.canNotFlag ? '<font style="color: #ff0000;">*</font>' : '');
                        },
                        setVal:!_this.isData ? '' : function(data){
                            for(var i = 0; i < data.attr.actions.length; i ++) if(data.attr.actions[i].value == _this.data.values[data.id]) $('#radio' + data.id + '_' + i)[0].checked = true;
                        },
                        attr:{
                            label:{
                                type:'text',
                                title:'标题(必填)',
                                rule:{NotNull:true,MaxLength:5}
                            },
                            canNotFlag:{
                                type:'checkbox',
                                title:'不能为空标记'
                            },
                            actions:{
                                type:'actions',
                                value:[],
                                title:'选项'
                            }
                        }
                    },
                    select:{
                        name:'下拉选择框',
                        template:'<li><span>{_canNotFlag}{label}</span><select class="text_b" id="select{id}">{_actions}</select><div class="clear"></div></li>',
                        templateEval:function(s,k,v,o){
                            return s.replace(new RegExp('{_' + k + '}'),function(){
                                var options = '';
                                for(var i = 0; i < v.length; i ++) {
                                    options += '<option ' + (v[i].selected ? 'selected' : '') + ' value="' + v[i].value + '" >' + v[i].name + '</option>';
                                }
                                return options;
                            })
                        },
                        templateEvalFinal:function(s,o){
                            return s.replace(new RegExp('{_canNotFlag}'),o.canNotFlag ? '<font style="color: #ff0000;">*</font>' : '');
                        },
                        setVal:!_this.isData ? '' : function(data){
                            $('#select' + data.id).val(_this.data.values[data.id]);
                        },
                        attr:{
                            label:{
                                type:'text',
                                title:'标题(必填)',
                                rule:{NotNull:true,MaxLength:5}
                            },
                            canNotFlag:{
                                type:'checkbox',
                                title:'不能为空标记'
                            },
                            actions:{
                                type:'actions',
                                value:[],
                                title:'选项'
                            }
                        }
                    },
                    checkbox:{
                        name:'多选框',
                        template:'<li><span>{_canNotFlag}{label}</span><div style="width:720px;">{_actions}</div><div class="clear"></div></li>',
                        templateEval:function(s,k,v,o){
                            return s.replace(new RegExp('{_' + k + '}'),function(){
                                var options = '';
                                for(var i = 0; i < v.length; i ++) {
                                    options += '<input style="width:15px;" ' + (v[i].selected ? 'checked' : '') + ' value="' + v[i].value + '" type="checkbox" name="checkbox' + o.id + '" id="checkbox' + o.id + '_' + i + '" /><i>' + v[i].name + '</i>';
                                }
                                return options;
                            })
                        },
                        templateEvalFinal:function(s,o){
                            return s.replace(new RegExp('{_canNotFlag}'),o.canNotFlag ? '<font style="color: #ff0000;">*</font>' : '');
                        },
                        setVal:!_this.isData ? '' : function(data){
                            var values = '|' + _this.data.values[data.id].join('|') + '|';
                            for(var i = 0; i < data.attr.actions.length; i ++) {
                                if(values.indexOf('|' + data.attr.actions[i].value + '|') > -1) $('#checkbox' + data.id + '_' + i)[0].checked = true;
                            }
                        },
                        attr:{
                            label:{
                                type:'text',
                                title:'标题(必填)',
                                rule:{NotNull:true,MaxLength:5}
                            },
                            canNotFlag:{
                                type:'checkbox',
                                title:'不能为空标记'
                            },
                            actions:{
                                type:'actions',
                                value:[],
                                title:'选项'
                            }
                        }
                    }
                }
            });
        }})
    }
}

Y.configs = {
    imgEditConfig:{
        entrance:{width:37,height:37},
        carousel:{width:1014,height:318},
        link:{width:160,height:40},
        topic1:{width:992,height:69},
        topic2:{width:320,height:82},
        topic3:{width:320,height:82},
        topic4:{width:320,height:82},
        topic5:{width:153,height:93},
        channel:{width:480,height:320}
    }
}