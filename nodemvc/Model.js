var DB=require("./DB"),$=require("./tool");function Model(h,e){this.schemas=e,this.find=function(e,t,s){var a={};for(var i in e)this.schemas[i]&&this.schemas[i].submit&&(e[i]=this.schemas[i].submit(e[i])),null!=e[i]&&this.schemas[i]&&(a[i]=e[i]);DB.find(h,a,t,s)},this.dataFormat=function(e,t){var s={},a=[];for(var i in t?e:this.schemas)if(this.schemas[i]&&"object"==typeof this.schemas[i]){if(null==e[i]?this.schemas[i].value?s[i]="function"==typeof this.schemas[i].value?this.schemas[i].value():this.schemas[i].value:s[i]="":s[i]=e[i],this.schemas[i].rule)if(this.schemas[i].rule.NotNull||$.Verify.NotNull(s[i])[0])for(var h in this.schemas[i].rule){var r=this.schemas[i].rule[h];if(0!=r)(u=$.Verify[h](s[i],r))[0]||a.push(this.schemas[i].label+u[1])}else;var u;if(this.schemas[i].verify)(u=this.schemas[i].verify(s[i],s))[0]||a.push(this.schemas[i].label+u[1]);this.schemas[i].submit&&(s[i]=this.schemas[i].submit(s[i],s))}else s[i]=this.schemas[i];return 0==a.length?{result:!0,data:s}:{result:!1,errorMsg:a.join(",")}},this.insert=function(t,s,e){if((t=this.dataFormat(t)).result){this.schemas.id&&(t.data.id=t.data.id?t.data.id:$.Guid());var a=$.date().toLocalString();t.data.createTime=null==t.data.createTime?a:t.data.createTime,t.data.state=0,DB.insert(h,t.data,function(e){e.result?s({result:!0,data:t.data.id}):s(e)})}else s(t)},this.update=function(e,t,s,a){(t=this.dataFormat(t,!0)).result?(t.data.updateTime=null==t.data.updateTime?$.date().toLocalString():t.data.updateTime,DB.update(h,e,t.data,s,a)):s(t)},this.remove=function(e,t,s){(s=s||{}).real?DB.remove(h,e,t,s):DB.update(h,e,{state:-1},t,s)},this.list=function(e,t){(e=e||{}).query.state={$ne:-1},e.query.pageSize=e.query.pageSize||10,e.query.pageNum=e.query.pageNum||1,DB.jsList({name:h,keys:{},args:e},function(e){e.result?t(e.data):t(e)})}}module.exports=Model;