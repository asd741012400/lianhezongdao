# jsCommons
还在为多个项目同时运作，来来回回，反反复复修改通用的组件而手忙脚乱?
这里提供一套公共的JavaScript工具库，单个工具单独管理，自由组合后分发到项目本地文件。使代码更规范，有效提高代码可复用性，同时提高代码质量。

## 配置项目清单
新增一个config.js文件，配置需要发布到的项目文件路径
* 常用web项目
```
module.exports = {
	mis_tool:{//mis项目tool.js文件
		options:{//入口替换项
			prototypes:{
				prototypes:true//内置对象扩展
			},
			tools:{
				window:true,//web常用扩展
				zIndex:true,//css z-index 层级管理
				clone:true,//对象复制
				equal:true,//对象赋值
				precent:true,//数字百分比
				setImgSize:true,//计算图片居中位置
				utf16to8:true,
				string:true,//String扩展
				Verify:true,//验证规则
				Item:true,//队列
				Ajax:true,//通用Ajax
				Storage:true,//本地存储管理
				SQLite:true,//模拟数据库
				Indicator:true//轮播器
			}
		},
		entry:'./entrys/window.js',//入口文件
		//entry:'var a = {};\r{{tools}}',//入口可以是字符串
		output: './tool.js'//生成文件
	},
	//文件移动功能 移动tools/CSShelper.js 到'../Le/No1'目录下
	No1_NodeMVC:{//项目名称
		type:'move',//文件移动类型
		options:{
			tools:{//所属文件夹
				CSShelper:true//自定义表单工具
			}
		},
		output: '../Le/No1'
	}
	...
}
```
* 发布
```
node build 发布未压缩文件
node build -min 发表压缩文件
```
-----------------------------------------------------------
## API文档
所有的工具类按照配置入口文件自定义命名空间，文档中统一使用"Y"，
相互引用的工具请在config文件中添加。
### Ajax
+ 统一数据请求方式
+ 必要引用 Storage/string/Item
+ 使用方式
```
//url 请求地址
//fn 回调函数,默认返回的数据都进行JSON.parse处理
//args 配置项
var ajax = new Y.Ajax(url,fn,args);
ajax.action();
```
+ POST方式
```
var data = {id:'123',name:'xxx'};
var ajax = new Y.Ajax('http://test/{id}',fn,{
	meth:'POST',
	data:data
});
ajax.action();
```
+ 统一请求头信息方式
```
Y.Storage.set('ajaxHeader',[{key:"accessToken",vaule:'xxxx'},{key:"groupId",vaule:'999'}])
```
+ 统一返回结果处理(常用于登录失效处理)
```
Y.Storage.set('loginAction',function(responseText,fn){
    if(responseText && responseText.indexOf && responseText.indexOf("accessToken") > 0){
        alert("需要重新登录");
        location.href = "login.html";
    }
    var o = {};
    try{
        o = JSON.parse(responseText);
        if(o.errorMsg) o.errorMsg = o.errorMsg.replace("accessToken","登录");
    }catch(_e){
        o = {errorMsg:"未知错误"};
    }
    fn(o);
})
```
> 统一返回错误结果风格,默认JSON格式。服务器返回信息如果有errorMsg则使用服务器错误信息

+ 中断上传
```
ajax.abort()
```
+ args配置

 参数 | 说明 | 类型 | 默认值 
 --- | --- | --- | ---
 data | 请求实体(可以为文件类型FormData) | * | -- 
 dataJson | 非GET方式上传时设置生效,设置使用json格式或HTTP Param格式上传,false时使用json格式 | Boolean | false 
 header | 附加头信息[{key:'',vaule:''}] | Array | [] 
 loading | 请求中的loading对象，loading对象必须提供open及close方法	| Object | -- 
 meth | HTTP方式,GET/POST/PUT/DELETE | String | GET 
 contentType | HTTP contentType | String | application/json;charset=utf-8 
 dataType | 返回数据解析类型 | String | json 
 async	| 异步/同步	| Boolean | true 
 loginAction | 请求完成后调用方法 | Function | -- 
 progress | 请求进度调用方法 | Function | -- 
 cache	| GET方法是否使用缓存 | Boolean	| true 
 timeout | 超时时间,可全局设置Y.Storage.set('ajaxTimeOut',30000)	| Number | 0 
 storageName | 缓存数据名称 | String | -- 
 storage | 缓存数据配置 | Object | -- 
 Item | 设置是否使用队列 | Boolean/Object(Y.Item) | false 

-----------------------------------------------------------

### clone

+ 对象深度拷贝

+ 使用方式

```
//obj1 需要克隆的对象
var obj1 = {a:1};
var obj2 = Y.clone(obj1);
```

-----------------------------------------------------------

### equal

+ 对象深度赋值

+ 使用方式

```
var obj1 = {a:1};
var obj2 = {b:2};
Y.equal(obj1,obj2);
//obj1 = {a:1,b:2};
```

-----------------------------------------------------------


### Guid

+ 生成Guid

+ 使用方式

```
Y.Guid();
//示例 00AEFBA335C94414BF643143DFCF2F98
```

-----------------------------------------------------------

### date

+ 扩展时间对象

+ 使用方式

```
var sysDate = new Date();
var date1 = Y.date(sysDate);
```

+ 格式化

```
//返回示例 2018-03-12 12:32:11
date1.Format('yyyy-MM-dd hh:mm:ss');
```

+ 解析

```
//返回系统时间对象
date1.parse('2018-03-12 12:32:11');
date1.parse('2018-03-12','date');
date1.parse('12:32:11','time');
```

+ 周信息

```
//返回星期几
date1.weekDay();
```

+ 年龄计算

```
//y m d 出生年月日
date1.age(y,m,d);
```

-----------------------------------------------------------

### string

+ 扩展字符串对象

+ 使用方式

```
var s = 'abcdefgabcd';
s = Y.string(s1);
```

+ 全局替换

```
s.replaceAll('a','b');
```

+ 字符串模板解析_eval

```
//遍历对象对字符串模板进行替换，使用{xx}表示对象的属性。实现字符串模板解析
//o 数据来源
//fn 解析函数
someString._eval(o,fn)

//示例
var s1 = '他的名字叫{name},他今年{age}岁'._eval({name:'李明',age:10});
//s1 = '他的名字叫小明,他今年10岁'

//特殊的替换{listStyle_xx},用于提取xx属性第一个字符,多应用于列表展示首字符
var s2 = '{name}姓{listStyle_name}'._eval({name:'李明',age:10});
//s2 = '李明姓李'


//可以自定义特殊替换，通过传入fn函数对自定义的特殊替换进行解析
var s3 = '{name}是个{is_age}'._eval({name:'李明',age:10},function(_s,k,v,o){
    //_s s3的当前状态
    //k 对象属性
    //v 对象属性对应的值
    //o 遍历的对象

    //返回一个解析后的字符串
    return _s.replace(new RegExp("{is_" + k + "}","g"),function(){
        if(v > 18){
            return '成人';
        }else{
            return '未成年人';
        }
    })
})
//s3 '李明是个未成年人'
```

-----------------------------------------------------------

### SQLite

+ 模拟数据库

+ 必要引用 clone

+ 使用方式

```
var data = [{a:1,b:2},{a:3,b:4}];
var sql = new Y.SQLite(data);
```

+ 操作模仿Mongdb

```
//query 查询条件
//fn 回调函数
//args 其他配置

//查询 查询返回的数据是对原数据的拷贝
sql.find(query,fn,args)
//新增
sql.insert(_data,fn)
//更新
sql.update(query,_data,fn,args)
//删除
sql.remove(query,fn,args)
```

+ args配置

 参数 | 说明 | 类型 | 默认值 
 --- | --- | --- | ---
 sortFn | 查询排序函数 | function | -- 
 findOne | 查询一个 | Boolean | false
 pageNum | 查询分页当前页(不存在返回数据数组,存在返回{pageSize:pageSize,pageNum:pageNum,rows:rows,total:rows.length}) | Number | 1
 pageSize | 查询分页大小 | Number | 100000000

 -----------------------------------------------------------

### Storage

+ 状态管理


+ 初始化

```
var args = {
	times:0,//存储数据可以次数 0时不限
	timeSpan:0,//数据保存时间,毫秒为单位 0时不限
	type:0 //数据保存方式,默认0表示，保存在dom中;1表示保存在浏览器的localStorage中(保存在浏览器缓存中的数据只能为String类型)
}
Y.Storage.init(key,{type:1})
```

+ 用法

```
Y.Storage.set(key,value)
Y.Storage.get(key)
```

 -----------------------------------------------------------

### Verify

+ 验证

+ 初始化

+ 用法

```
//验证身份证
var v = Y.Verify.IDCard(idCart)
//v = [false,'错误信息']
```

+ 验证清单

 参数 | 说明 | 示例
 --- | --- | ---
 Name | 姓名 | Y.Verify.Name('张三')
 Phone | 电话号码 | Y.Verify.Phone('17215545454')
 IDCard | 身份证 | Y.Verify.IDCard('5023145124589654')
 Email | 邮箱 | Y.Verify.Email('313@qq.com')
 Date | 一般日期(使用“-”分隔,例如:2018-01-01) | Y.Verify.Date('2017-12')
 PositiveInt | 正整数 | Y.Verify.PositiveInt(12)
 NotNull | 不能为空 | Y.Verify.NotNull('')
 MaxLength | 最大长度 | Y.Verify.MaxLength('aa',18)
 MinLength | 最小长度 | Y.Verify.MinLength('aa',6)
 MaxNumber | 最大值 | Y.Verify.MaxNumber(12,21)
 MinNumber | 最小值 | Y.Verify.MinNumber(12,21)
 Regx | 正则 | Y.Verify.Regx('asdasd',/\d/)