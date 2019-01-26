! function(e) {

    Date.prototype.only = function() { var e = this.getTime().toString(); return (e = - -e.substr(e.length - 9, 9)) + Math.ceil(1e4 * Math.random()) };
    var t, x = (t = 0, function(e) { return 1e3 * (e || 4) + t++ });
    function m(e, t) { if (!e || "object" != typeof e) return e; if (t && JSON) return JSON.parse(JSON.stringify(e)); var n = e.constructor === Array ? [] : {}; for (var o in e) n[o] = "object" != typeof e ? e[o] : m(e[o]); return n }
    function y(e, t) { if (!e || !t || "object" != typeof e || "object" != typeof t) throw "typeof arguments must be object and not null"; for (var n in t) e[n] && t[n] && "object" == typeof e[n] && "object" == typeof t[n] ? y(e[n], t[n]) : e[n] = t[n] }
    function a(e, t, n, o) { var i = e; if ("string" == typeof t) return this.replace(new RegExp("{.*}", "g"), t); for (var p in t) { var a = t[p];
            a = null == a || null == a ? "" : a, i = (i = i.replace(new RegExp("{" + p + "}", "g"), a)).replace(new RegExp("{listStyle_" + p + "}", "g"), "string" == typeof a ? a.charAt(0) : "?"), n && (i = n(i, p, a, t)) } return o && (i = o(i, t)), i }
    function b(e, t) { t = t || {}; var n = document.createElement(e); for (var o in t) "style" != o && (n[o] = t[o]); if (t.style)
            for (var o in t.style) n.style[o] = t.style[o]; if (t.attr)
            for (o in t.attr) n.setAttribute(o, t.attr[o]); return n }
    var I = 0,
        l = "",
        w = { title: "", description: "", data: {}, id: I, btns: [{ type: 1, url: "posturl", name: "提交" }, { type: 2, url: "agreeurl", name: "通过" }, { type: 3, url: "refuseurl", name: "拒绝" }], components: [] },
        d = { readonly: !1, edit: !0 },
        L = "",
        k = "",
        C = { element: "", btns: "", edit: "" },
        o = "",
        O = "",
        H = {},
        i = {},
        r = '<optgroup label="Attention Seekers">\t  <option value="bounce">bounce</option>\t  <option value="flash">flash</option>\t  <option value="pulse">pulse</option>\t  <option value="rubberBand">rubberBand</option>\t  <option value="shake">shake</option>\t  <option value="swing">swing</option>\t  <option value="tada">tada</option>\t  <option value="wobble">wobble</option>\t</optgroup>\t<optgroup label="Bouncing Entrances">\t  <option value="bounceIn">bounceIn</option>\t  <option value="bounceInDown">bounceInDown</option>\t  <option value="bounceInLeft">bounceInLeft</option>\t  <option value="bounceInRight">bounceInRight</option>\t  <option value="bounceInUp">bounceInUp</option>\t</optgroup>\t<optgroup label="Bouncing Exits">\t  <option value="bounceOut">bounceOut</option>\t  <option value="bounceOutDown">bounceOutDown</option>\t  <option value="bounceOutLeft">bounceOutLeft</option>\t  <option value="bounceOutRight">bounceOutRight</option>\t  <option value="bounceOutUp">bounceOutUp</option>\t</optgroup>\t<optgroup label="Fading Entrances">\t  <option value="fadeIn">fadeIn</option>\t  <option value="fadeInDown">fadeInDown</option>\t  <option value="fadeInDownBig">fadeInDownBig</option>\t  <option value="fadeInLeft">fadeInLeft</option>\t  <option value="fadeInLeftBig">fadeInLeftBig</option>\t  <option value="fadeInRight">fadeInRight</option>\t  <option value="fadeInRightBig">fadeInRightBig</option>\t  <option value="fadeInUp">fadeInUp</option>\t  <option value="fadeInUpBig">fadeInUpBig</option>\t</optgroup>\t<optgroup label="Fading Exits">\t  <option value="fadeOut">fadeOut</option>\t  <option value="fadeOutDown">fadeOutDown</option>\t  <option value="fadeOutDownBig">fadeOutDownBig</option>\t  <option value="fadeOutLeft">fadeOutLeft</option>\t  <option value="fadeOutLeftBig">fadeOutLeftBig</option>\t  <option value="fadeOutRight">fadeOutRight</option>\t  <option value="fadeOutRightBig">fadeOutRightBig</option>\t  <option value="fadeOutUp">fadeOutUp</option>\t  <option value="fadeOutUpBig">fadeOutUpBig</option>\t</optgroup>\t<optgroup label="Flippers">\t  <option value="flip">flip</option>\t  <option value="flipInX">flipInX</option>\t  <option value="flipInY">flipInY</option>\t  <option value="flipOutX">flipOutX</option>\t  <option value="flipOutY">flipOutY</option>\t</optgroup>\t<optgroup label="Lightspeed">\t  <option value="lightSpeedIn">lightSpeedIn</option>\t  <option value="lightSpeedOut">lightSpeedOut</option>\t</optgroup>\t<optgroup label="Rotating Entrances">\t  <option value="rotateIn">rotateIn</option>\t  <option value="rotateInDownLeft">rotateInDownLeft</option>\t  <option value="rotateInDownRight">rotateInDownRight</option>\t  <option value="rotateInUpLeft">rotateInUpLeft</option>\t  <option value="rotateInUpRight">rotateInUpRight</option>\t</optgroup>\t<optgroup label="Rotating Exits">\t  <option value="rotateOut">rotateOut</option>\t  <option value="rotateOutDownLeft">rotateOutDownLeft</option>\t  <option value="rotateOutDownRight">rotateOutDownRight</option>\t  <option value="rotateOutUpLeft">rotateOutUpLeft</option>\t  <option value="rotateOutUpRight">rotateOutUpRight</option>\t</optgroup>\t<optgroup label="Specials">\t  <option value="hinge">hinge</option>\t  <option value="rollIn">rollIn</option>\t  <option value="rollOut">rollOut</option>\t</optgroup>\t<optgroup label="Zoom Entrances">\t  <option value="zoomIn">zoomIn</option>\t  <option value="zoomInDown">zoomInDown</option>\t  <option value="zoomInLeft">zoomInLeft</option>\t  <option value="zoomInRight">zoomInRight</option>\t  <option value="zoomInUp">zoomInUp</option>\t</optgroup>\t<optgroup label="Zoom Exits">\t  <option value="zoomOut">zoomOut</option>\t  <option value="zoomOutDown">zoomOutDown</option>\t  <option value="zoomOutLeft">zoomOutLeft</option>\t  <option value="zoomOutRight">zoomOutRight</option>\t  <option value="zoomOutUp">zoomOutUp</option>\t</optgroup>';
    function u(e, t) {
        if (d.readonly) return !1;
        if (l[e.type]) {
            c();
            var n = b("div", { style: { color: "#000", position: "fixed", zIndex: x(), background: "#000", color: "#fff", padding: "10px 15px", left: (t.clientX + 230 > document.body.clientWidth ? document.body.clientWidth - 240 : t.clientX) + "px", top: t.clientY + "px", width: "230px", display: "flex", lineHeight: "1" } });
            n.appendChild(b("span", {
                    innerHTML: "编辑",
                    style: { flex: 1, marginRight: "10px", borderRight: "1px solid #6d6d6d" },
                    onclick: function() {
                        s(l[e.type], e.parentId, e)
                    }
                })),
                n.appendChild(b("span", {
                    innerHTML: "删除",
                    style: { flex: 1, marginRight: "10px", borderRight: "1px solid #6d6d6d" },
                    onclick: function() {
                        ! function(o) {
                            Y.confirmx("是否删除！",function(){
                                "container" == o.type ? Y.confirmx("删除表单会同时删除表单下的内容,是否继续删除?",function(){
                                    for (var e = o.id, t = [], n = 0; n < w.components.length; n++) w.components[n].id != e && w.components[n].parentId != e && t.push(w.components[n]);
                                    w.components = t, T(), c()
                                }):function(){
                                    for (var e = o.id, t = [], n = 0; n < w.components.length; n++) w.components[n].id != e && w.components[n].parentId != e && t.push(w.components[n]);
                                    w.components = t, T(), c()
                                }()
                            })
                        }(e)
                    }
                })), n.appendChild(b("span", { innerHTML: "上移", style: { flex: 1, marginRight: "10px", borderRight: "1px solid #6d6d6d" }, onclick: function() { p(e, -1) } })), n.appendChild(b("span", { innerHTML: "下移", style: { flex: 1, marginRight: "10px", borderRight: "1px solid #6d6d6d" }, onclick: function() { p(e, 1) } })), n.appendChild(b("span", { innerHTML: "取消", style: { flex: 1 }, onclick: function() { n.style.display = "none" } })), C.elementStyle = this.getAttribute("style"), this.style.border = "1px dashed #ff0000", C.element = this, C.btns = n, O.appendChild(n, null)
        }
    }
    function c() { C.element && C.element.setAttribute("style", C.elementStyle), C.btns && C.btns.parentNode && C.btns.parentNode.removeChild(C.btns), C.edit && C.edit.parentNode && C.edit.parentNode.removeChild(C.edit), C.select && C.select.parentNode && C.select.parentNode.removeChild(C.select), C.editFrom && C.editFrom.parentNode && C.editFrom.parentNode.removeChild(C.editFrom) }
    function s(d, r, u) {
        C.btns && (C.btns.style.display = "none");
        var c = m(d.attr),
            s = u ? m(u.rule) : {};
        s = s || {};
        var f = u ? u.attr : {},
            e = { position: "fixed", zIndex: x(), bottom: "0px", left: "0px", background: "#fff", minHeight: "200px", width: "100%", boxShadow: "0 0 10px #ccc", textAlign: "left" };
        y(e, H);
        var t = b("div", { style: e }),
            n = b("div", { style: { textAlign: "right", height: "40px", background: "#f8f8f8", borderTop: "1px solid #e4e4e4", borderBottom: "1px solid #e4e4e4", color: "#08974e", lineHeight: "40px", padding: "0px 10px" } });
        n.appendChild(b("span", { innerHTML: (u ? "" : "新增") + '<span style="font-size:1.2rem;margin:5px;">' + d.name + "</span>设置", style: { float: "left", fontSize: "0.8rem" } })), n.appendChild(b("span", { innerHTML: "取消", style: { marginRight: "10px" }, onclick: function() {
            C.edit && (C.edit.style.display = "none") } })),
        n.appendChild(b("span", { innerHTML: "完成", onclick: function() {
                    var _n = 0
                    var e = !0,
                    id = $(".idKey").val(),
                    t = [];
                    for (var n in c) {
                        var o = f[n];
                        if (c[n].rule && "object" == typeof c[n].rule)
                        for (var i in c[n].rule) {
                            var p, a = c[n].title,
                                l = c[n].rule[i];
                                if (0 != l)
                                if (L[i] && "function" == typeof L[i])
                                if (!(p = L[i](o, l))[0]) { e = !1, t.push(a + p[1]); break } }
                    if ("function" == typeof c[n].verify)(p = c[n].verify.call(c[n], o, c))[0] || (e = !1, t.push(p[1]));

                    w.components.forEach(function(i,index){
                        if (u===undefined) {
                            if((i.attr.idKey==id)&&id){
                                _n++
                            }
                        }else{
                            if (u.index!=index) {
                                if((i.attr.idKey==id)&&id){
                                    _n++
                                }
                            };
                        };

                    })

                    if(f.label==''){Y.alertx('标题不能为空','',{toast:true,height:70});return false};
                    if(s.MaxLength&&s.MinLength&&Number(s.MaxLength)<=Number(s.MinLength)){Y.alertx('最大长度必须大于最小长度','',{toast:true,height:70});return false};if(s.MaxNumber&&s.MinNumber&&Number(s.MaxNumber)<=Number(s.MinNumber)){Y.alertx('最大值必须大于最小值','',{toast:true,height:70});return false}
                    c[n].value = o }
                    if(_n>0){
                        Y.alertx('该id已经被占用','',{toast:true,height:70});
                        return false;
                    }else{
                        f.idKey=id;
                    }
                     e ? (u ? (u.rule = s, u.attr = f, u.label = f.label) : w.components.push({ parentId: r, attr: f, rule: s, label: f.label, type: d.type, id: (new Date).only() }), T()) : alert(t.join("\n\r"));


                     }

                      })),
        t.appendChild(n);
        var o = b("div", { style: { borderBottom: "1px solid #06a052", margin: "15px 5px 5px 5px", textAlign: "left" } }),
            i = document.body.clientHeight / 2,
            l = b("div", { style: { maxHeight: i + "px", margin: "10px 5px", display: "none", overflow: "auto" } }),
            p = b("div", { style: { maxHeight: i + "px", margin: "10px 5px", display: "none", overflow: "auto" } }),
            a = b("span", { innerHTML: "基础属性", style: { marginLeft: "10px", padding: "4px 10px" }, onclick: function() { v(0, this, h, l, p) } });
        o.appendChild(a);
        var h = b("span", { innerHTML: "验证方式", style: { marginLeft: "10px", padding: "4px 10px" }, onclick: function() { v(1, this, a, p, l) } });
        for (var g in o.appendChild(h), t.appendChild(o), R(".div" + I, "width:46%;height:30px;line-height:30px;overflow:hidden;border:1px solid #e7e7e7;margin-left:2%;float:left;color:#adadad;margin-bottom:10px;"), c) ! function(p) {
            u || (f[p] = void 0 !== c[p].defaultValue ? c[p].defaultValue : "");
            var e = b("div", { className: "div" + I }),
                a = "";
            if ("checkbox" === c[p].type) e.innerHTML = '<label for="check' + p + I + '" style="float:left;font-size:0.8rem;margin-left:5px;">' + c[p].title + "</label>", (a = b("input", { type: "checkbox", id: "check" + p + I, style: { float: "right", marginRight: "10%", marginTop: "8px" }, onchange: function() { f[p] = this.checked } })).checked = !!f[p];
            else if ("select" === c[p].type) { for (var t = "", n = 0; n < c[p].actions.length; n++) f[p] = null == f[p] && c[p].actions[n].selected ? c[p].actions[n].value : f[p], t += '<option value="' + c[p].actions[n].value + '"' + (c[p].actions[n].selected ? " selected" : "") + ">" + c[p].actions[n].name + "</option>";
                (a = b("select", { innerHTML: t, style: { border: "none", height: "30px", lineHeight: "30px", padding: "0px 5px", width: "96%", background: "none", opacity: .5 }, onchange: function() { f[p] = this.value } })).value = f[p] || "" } else if ("textarea" === c[p].type) e.style.width = "95%", e.style.height = "auto", (a = b("textarea", { placeholder: c[p].title, style: { border: "none", padding: "5px", width: "95%", background: "none", height: "40px", opacity: .5 }, onchange: function() { f[p] = this.value } })).value = f[p] || "";
            else if ("actions" === c[p].type) {
                e.style.width = "95%", e.style.height = "auto", a = b("div", { innerHTML: '<div style="margin-left:10px;">' + c[p].title + "</div>", style: { width: "95%" } });
                f[p] = f[p] || c[p].value,
                    function() {
                        a.innerHTML = "";
                        var i = arguments.callee;
                        a.appendChild(b("div", { innerHTML: "选项", style: { marginLeft: "10px" } }));
                        for (var e = 0; e < f[p].length; e++) ! function(e) {
                            var t = b("div", { className: 'CSShelperList' });
                            t.appendChild(b("input", { placeholder: "选项" + (e + 1), value: f[p][e].name, style: { border: "none", width: "38%", float: "left", height: "30px" }, onchange: function() { f[p][e].name = this.value, "" == f[p][e].value && (f[p][e].value = this.value) } })), t.appendChild(b("input", { placeholder: "值(value)", value: f[p][e].value, style: { border: "none", width: "23%", float: "left", height: "30px", margin: "0px 1%" }, onchange: function() { f[p][e].value = this.value, "" == f[p][e].value && (f[p][e].value = f[p][e].name) } }));
                            var n = b("span", {
                                    innerHTML: '<label for="checkboxlabel' + e + '">默认选中</label>',
                                    style: { float: "left", display: "block", width: "37%", overflow: "hidden", textAlign: "right", fontSize: "0.8rem" }
                                });
                                if (d.type=='radio') {
                                    var o = b("input", {
                                        type: "radio",
                                        name:"checkboxlabel",
                                        id: "checkboxlabel" + e,
                                        attr:{ data:f[p][e].selected },
                                        style: { marginLeft: "5px", marginRight: "15px" },
                                        onclick: function() {
                                            if ($(this).attr('data') === 'true'){
                                                $(this).prop('checked', false);
                                                $(this).attr('data', false);

                                            }else{
                                                $(this).prop('checked', true);
                                                $(this).attr('data', true);
                                            }
                                            $(this).parents('.CSShelperList').siblings().find("input[name='checkboxlabel']").prop('checked',false).attr('data',false)
                                            $('.CSShelperList').each(function(i){
                                                f[p][i].selected = $(this).find("input[name='checkboxlabel']").prop('checked')
                                            })
                                        }
                                    });

                                };
                                if (d.type=='checkbox') {
                                    var o = b("input", {
                                        type: "checkbox",
                                        id: "checkboxlabel" + e,
                                        style: { marginLeft: "5px", marginRight: "15px" },
                                        onclick: function() {
                                            f[p][e].selected = this.checked
                                        }
                                    });
                                }
                            f[p][e].selected && (o.checked = !0),
                                n.appendChild(o),
                                n.appendChild(b("span", {
                                    innerHTML: "删",
                                    style: { color: "#d74a4a", textDecoration: "underline" },
                                    onclick: function() {
                                        Y.confirmx("确定删除此选项?",function(){
                                            f[p][e].selected ? Y.alertx("必选项无法删除") : (f[p].splice(e, 1), i())
                                        })
                                    }
                                })),
                                t.appendChild(n), a.appendChild(t)
                        }(e);
                        a.appendChild(b("div", { innerHTML: "+ 添加选项", style: { color: "#d74a4a", fontSize: "0.8rem", textAlign: "left", borderTop: "1px solid #e4e4e4", marginLeft: "10px" }, onclick: function() { f[p].push({ value: "", name: "", selected: !1 }), i() } }))
                    }()
            } else "object" == typeof c[p].type ? (R("*:focus", "outline:none;"), a = b("input", { placeholder: c[p].title, type: "text", style: { border: "none", height: "30px", lineHeight: "30px", padding: "0px 5px", width: "95%", background: "none" } }), c[p].type.i(a, f[p]), f[p] = c[p].type.v) : (R("*:focus", "outline:none;"), (a = b("input", { placeholder: c[p].title,min:c[p].min,maxLength:c[p].maxlength||99, type: c[p].type,className: p, style: { border: "none", height: "30px", lineHeight: "30px", padding: "0px 5px", width: "95%", background: "none" },onkeyup:function(){if(c[p].type=='number') this.value=this.value.replace(/\D/g,'');if(this.value<c[p].min) this.value=''}, onchange: function() { if (p!='idKey') {f[p] = this.value};} })).value = f[p] || "");
            e.appendChild(a), l.appendChild(e)
        }(g);
        for (var g in k) ! function(e) { var t = b("div", { className: "div" + I }),
                n = ""; "checkbox" == k[e].type ? (t.innerHTML = '<label for="check' + e + I + '" style="float:left;font-size:0.8rem;margin-left:5px;">' + k[e].title + "</label>", (n = b("input", { type: "checkbox", id: "check" + e + I, style: { float: "right", marginRight: "10%", marginTop: "8px" }, onchange: function() { s[e] = this.checked } })).checked = !!s[e]) : "textarea" == k[e].type ? (t.style.width = "95%", t.style.height = "auto", (n = b("textarea", { placeholder: k[e].title, style: { border: "none", padding: "5px", width: "95%", background: "none", height: "40px", opacity: .5 }, onchange: function() { s[e] = this.value } })).value = s[e] || "") : (n = b("input", { placeholder: k[e].title,min:k[e].min, style: { border: "none", height: "30px", lineHeight: "30px", padding: "0px 5px", width: "95%", background: "none" }, attr: { type: k[e].type }, onkeyup:function(){this.value=this.value.replace(/\D/g,'');if(this.value<k[e].min) this.value=''},onchange: function() {s[e] = this.value } })).value = s[e] || "", t.appendChild(n), p.appendChild(t) }(g);
        function v(e, t, n, o, i) { t.style.background = "#06a052", t.style.color = "#fff", o.style.display = "block", n.style.background = "none", n.style.color = "#06a052", i.style.display = "none" } l.appendChild(b("div", { style: { clear: "both" } })), p.appendChild(b("div", { style: { clear: "both" } })), t.appendChild(l), t.appendChild(p), v(0, a, h, l, p), O.appendChild(t), C.edit = t
    }
    function p(e, t) {
        for (
            var n = e.parentId,
                o = !1,
                i = null,
                p = null,
                a = null,
                l = 0; l < w.components.length; l++)
            if (w.components[l].parentId == n)
                if (w.components[l].id == e.id) p = l, o = !0;
                else if (o) {
            if (a) break;
            a = l
        } else i = p = l;
        var d = w.components[p].index;
        0 < t && w.components[a] ? (w.components[p].index = w.components[a].index, w.components[a].index = d) : t < 0 && w.components[i] && (w.components[p].index = w.components[i].index, w.components[i].index = d), w.components.sort(function(e, t) { return e.index - t.index }), T(!0)
    }
    function R(e, t) { var n = e + "{" + t + "}"; - 1 == o.innerHTML.indexOf(n) && (o.innerHTML = o.innerHTML + n) }
    function f(n) { C.btns && (C.btns.style.display = "none"); var e = { position: "fixed", zIndex: x(), bottom: "0px", left: "0px", background: "#fff", minHeight: "200px", width: "100%", boxShadow: "0 0 10px #ccc", textAlign: "left" };
        y(e, H); var t = b("div", { style: e }),
            o = b("div", { style: { textAlign: "right", height: "40px", background: "#f8f8f8", borderTop: "1px solid #e4e4e4", borderBottom: "1px solid #e4e4e4", color: "#08974e", lineHeight: "40px", padding: "0px 10px" } });
        o.appendChild(b("span", { innerHTML: "新增控件", style: { float: "left", fontSize: "1.2rem" } })), o.appendChild(b("span", { innerHTML: "取消", style: { marginRight: "10px" }, onclick: function() { C.select && (C.select.style.display = "none") } })), t.appendChild(o); var i = b("div", { style: { maxHeight: document.body.clientHeight + "px", margin: "10px 5px", textAlign: "left" } }); for (var p in l) "container" != p && (l[p].componentClassify ? i.appendChild(b("div", { innerHTML: l[p].name, style: { margin: "10px 5px", borderBottom: "1px solid #e4e4e4", lineHeight: "30px" } })) : function(e) { var t = b("span", { style: { display: "inline-block", margin: "5px", border: "1px solid #e4e4e4", padding: "0px 10px", color: "#7d7c7c" }, innerHTML: l[e].name, onclick: function() { l[e].type = e, s(l[e], n) } });
            i.appendChild(t) }(p));
        t.appendChild(i), O.appendChild(t), C.select = t }
    function T(e) {
        c(), l && (O.innerHTML = "");
        var p = {};
        //e||w.components.sort(function(e,t){var n=e.parentId-t.parentId;return 0==n&&(n=e.id-t.id),n});
        for (var t = 0; t < w.components.length; t++) ! function(e) {
            var t = w.components[e],
                n = l[t.type],
                o = m(t.attr);
            if (o.id = t.id, t.index = e, n) {
                var i = b("div", { innerHTML: a(a(n.template, o, n.templateEval, n.templateEvalFinal), t, n.templateEval, n.templateEvalFinal) });
                d.edit && i.addEventListener("click", function(e) { u.call(this, t, e) }, !0), "container" == t.type ? (O.appendChild(i), p["_" + t.id] = document.getElementById("container" + t.id)) : p["_" + t.parentId] ? p["_" + t.parentId].appendChild(i) : O.appendChild(i), n.setVal && n.setVal(t)
            }
        }(t);
        if (l) {
            for (var n in p) ! function(e) { p[e].appendChild(b("div", { innerHTML: i.addComponent || '<div style="padding:10px;background:#e4e4e4;border:1px dashed #e4e4e4;color:#000;">+ 添加控件</div>', style: { padding: "10px", textAlign: "center", color: "#ccc", width: "50%", margin: "0px auto" }, onclick: function() { c(), f(e.replace("_", "")) } })) }(n);
            O.appendChild(b("div", {
                innerHTML: i.addFrom || '<div style="padding:10px;border:1px dashed #e4e4e4;background:#fff;">添加表单</div>',
                style: { padding: "0px 10px 10px 10px", textAlign: "center", color: "#ccc" },
                onclick: function() {
                    c(),
                        function() {
                            if (d.readonly) return;
                            var e = m(l.container);
                            for (var t in e.id = (new Date).only(),
                                    e.type = "container",
                                    e.parentId = 0, e.attr) e.attr[t] = e.attr[t].defaultValue || "";
                            e.label = e.name,
                                e.attr.label = e.name,
                                delete e.template,
                                w.components.push(e),
                                T()
                        }()
                }
            }))
        }
    }
    e.CSShelper = function(e) {
        return O = (e = e || {}).dom || document.body,
            (l = e.componentConfig) ? (e.animates instanceof Array && (animates = animates.concat(e.animates)),
                w = e.fromData || w,
                y(d, e.status),
                i = e.htmls || {},
                L = e.Verify || {},
                H = e.styles || {},
                I = (new Date).only(),
                k = e.verifyMethods || {},
                e.build ? e.build() : T(), (o = b("style")).type = "text/css",
                document.getElementsByTagName("head")[0].appendChild(o), w) : (document.body.appendChild(b("link", { attr: { rel: "stylesheet", href: "https://daneden.github.io/animate.css/animate.min.css" } })),
                function() {
                    var e = { position: "fixed", zIndex: x(), bottom: "0px", right: "0px", background: "#fff", minHeight: "100px", width: "250px", boxShadow: "0 0 10px #ccc" };
                    y(e, H);
                    var t = b("div", { style: e }),
                        n = b("div", { style: { textAlign: "right", height: "40px", background: "#f8f8f8", borderTop: "1px solid #e4e4e4", borderBottom: "1px solid #e4e4e4", color: "#08974e", lineHeight: "40px", padding: "0px 10px" } });
                    n.appendChild(b("span", { innerHTML: "动画预览", style: { float: "left", fontSize: "1.2rem" } }));
                    var o = b("div", { style: { maxHeight: document.body.clientHeight / 2 + "px", margin: "10px 5px" } });
                    n.appendChild(b("span", { innerHTML: "关闭", style: { marginRight: "10px" }, onclick: function() { t.parentNode && t.parentNode.removeChild(t) } }));
                    var i = b("input", { placeholder: "css选择器", style: { border: "1px solid #e4e4e4", height: "30px", lineHeight: "30px", padding: "0px 5px", width: "95%", background: "none" }, value: "" });
                    o.appendChild(i);
                    var p = !1,
                        a = b("select", { innerHTML: '<option value="" selected>请选择动画</option>' + r, style: { border: "1px solid #e4e4e4", height: "40px", lineHeight: "40px", padding: "0px 5px", width: "99%", background: "none", marginTop: "10px" }, onchange: function() { if (p) return !1;
                                p = !0; var e = document.querySelector(i.value || "*"),
                                    t = a.value,
                                    n = e.className;
                                e.className = n + " animated " + t, e.bindedEnd || e.addEventListener("webkitAnimationEnd", function() { p = !1, e.className = n }) } });
                    o.appendChild(a), t.appendChild(n), t.appendChild(o), O.appendChild(t)
                }(), !1)
    }
}(window);