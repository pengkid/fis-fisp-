# fis学习笔记

记录一下自己学习fis的过程中的知识点，多动动手，记一记吧。


## 什么是fis

fis是专门为解决前端开发过程中自动化构建，性能优化，模块化开发（框架），开发规范，代码部署等问题的前端工程化构建工具。
实际上，fis是一个集成开发解决方案，专治各种不服。说白了就是，用多了会颓废，不思进取那种。


## fis的基本指令

三条指令，满足你的一切愿望。

* `fis install` 此命令安装一些公共库组件比如 jQuery、echarts，组件都放在 https://github.com/fis-components 仓库中。
* `fis release` 命令用于编译并发布的你的项目，拥有多个参数调整编译发布操作。
* `fis server` 命令可以启动一个本地调试服务器用于预览fis release产出的项目。

### fis release 指令

可以跟`webpack`类比，`fis release`也是一个打包指令，也需要一个相当于入口文件的配置文件，即`fis-conf.js`。
没有`fis-conf.js`也可以打包，也可以起到压缩等效果，但是命令行会抛出一个`WARNI`。

#### 资源压缩

* `fis release -o` 压缩静态资源代码（比如js，css） 
* `fis release -m` 给代码加版本号（比如js，css）

#### 资源监听

* `fis release -w` 监听文件更新变化(预览的项目在刷新页面后会同步更新)
* `fis release -l` 自动刷新，搭配文件监听使用

#### 添加域名

* `fis release --D` 给指定的资源添加特定的域名，需要`fis-conf.js`中设置相关指令

```js
fis.config.set('roadmap.domain', {
  //所有css文件添加http://localhost:8080作为域名
  '**.css': 'http://localhost:8080'
});

fis.config.set('roadmap.path', [{
  //所有的js文件
  reg: '**.js',
  //发布到/static/js/xxx目录下
  release: '/static/js$&'
}, {
  //所有的css文件
  reg: '**.css',
  //发布到/static/css/xxx目录下
  release: '/static/css$&'
}, {
  //所有image目录下的.png，.gif文件
  reg: /^\/images\/(.*\.(?:png|gif))/i,
  //发布到/static/pic/xxx目录下
  release: '/static/pic/$1'
}]);
```
>> 这个功能类似于`webpack`中的`publicpath`，给输出文件制定一个公共头，常用于CDN。
>> 编译后的html会自动加载带特定域名，且指定路径的静态资源。如果同时还设置了`pack`，那么`pkg`会生成在`static`文件对应的里面。


## 资源合并

`fis`打包的项目中，理论上应该含有一个`fis-conf.js`文件。
`fis-conf.js`里面定义了一些打包指令和插件指令。
`fis`可以通过pack来进行资源文件的合并，比如需要将公共库文件打包在一起，可以修改`fis-conf.js`配置，加入pack配置。

```js
fis.config.set('pack', {
  '/pkg/lib.js': [
    'js/lib/jquery.js',
    'js/lib/underscore.js',
    'js/lib/backbone.js',
    'js/lib/backbone.localStorage.js',
  ],
  '/pkg/aio.css': '**.css'
});
```

函数接受两个参数，第一个是字符串“pack”，表示要打包，第二个参数是一个对象，键名表示打包的路径，键值为需要打包的文件。
执行`fis release -p`后，`fis`会按照我们的设定，生成对应的包，类似于`webpack`的打包功能。

>> 注意，fis只是单纯的打包，而不会对页面的资源进行替换（坑）

### fis-postpackager-simple插件

如果想打包后自动替换，可以通过`fis-postpackager-simple`这个插件，并且在`fis-conf.js`中写入命令`fis.config.set('modules.postpackager', 'simple')`。**编译后，独立加载的静态资源就会被替换成打包的文件。**

此外，利用simple插件还可以按页面进行自动合并，将没有通过pack设置打包的零散资源自动合并起来。

```js
//开启autoCombine可以将零散资源进行自动打包
fis.config.set('settings.postpackager.simple.autoCombine', true);
```


## 更多插件

`fis`作为一款前端集成解决方案工具，还提供了各种的插件，可以方便将各种拓展语言转换为native语言。
比如说可以将CoffeeScript编译为JavaScript、Less编译为CSS、前端模板预编译等等。

安装 
```js
npm install -g fis-parser-less
```

使用
```js
//modules.parser.less表示设置后缀名为less的文件的parser，第二个less表示使用fis-parser-less进行编译
fis.config.set('modules.parser.less', 'less');
//将less文件编译为css
fis.config.set('roadmap.ext.less', 'css');
```

当然，还有很多的类似插件，比如`fis-parser-sass`,`fis-parser-jade`等等。（具体用法详见对应的github指南）


## 高级用法

`fis`更加黑科技的是，它对前端领域的语言能力（html，css，js）的扩展。

### 资源定位

获取任何开发中所使用资源的线上路径。

翻译成俗话就是：在开发环境中，可以直接写死资源文件的名字和路径，不用关心`fis`打包后的版本号，以及发布到线上的路径等。
因为，`fis`做了一层语言拓展，在打包的时候自动会帮你处理这一切问题。

```html
  <!-- html的资源定位语法就是直接写资源名即可 -->

  <!--源码：
  <img title="百度logo" src="images/logo.gif"/>
  
  编译后-->
  <img title="百度logo" src="/firstblood/images/logo_74e5229.gif"/>
          
  <!--源码：
  <link rel="stylesheet" type="text/css" href="demo.css">
              
  编译后-->
  <link rel="stylesheet" type="text/css" href="/firstblood/demo_7defa41.css">
          
  <!--源码：
  <script type="text/javascript" src="demo.js"></script>
              
  编译后-->
  <script type="text/javascript" src="/firstblood/demo_33c5143.js"></script>
```

```js
  //js中的资源定位语法是__uri('')，同样是直接写名字和路径

  //源码:
  var img = __uri('images/logo.gif');
  var css = __uri('demo.css');
  var js = __uri('demo.js');
  
  //编译后:
  var img = '/firstblood/images/logo_74e5229.gif';
  var css = '/firstblood/demo_7defa41.css';
  var js = '/firstblood/demo_33c5143.js';
```

```css
  /*-- css的资源定位语法 --*/

  /*-- 源码 --*/
  .style {
    background: url('images/body-bg.png');
    _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='images/body-bg.png');
  }
    
  /*-- 编译后 --*/
  .style {
    background: url('/firstblood/images/body-bg_1b8c3e0.png');
    _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/firstblood/images/body-bg_1b8c0.png');
  }
```

>> 官方定义：资源定位能力，可以有效的分离开发路径与部署路径之间的关系，工程师不再关心资源部署到线上之后去了哪里，变成了什么名字，这些都可以通过配置来指定。而工程师只需要使用相对路径来定位自己的开发资源即可。这样的好处是 资源可以发布到任何静态资源服务器的任何路径上而不用担心线上运行时找不到它们，而且代码具有很强的可移植性，甚至可以从一个产品线移植到另一个产品线而不用担心线上部署不一致的问题。

### 内容嵌入

把一个文件的内容(文本)或者base64编码(图片)嵌入到另一个文件中。

没什么好解释的，通过特定的代码指令`?__inline`（html&css）或者`__line`(js)，`fis`可以把另一个文件的内容嵌入到该文件中，减少`http`请求。

```html
  <!--源码：
  <img title="百度logo" src="images/logo.gif?__inline"/>
  
  编译后-->
  <img title="百度logo" src="data:image/gif;base64,R0lGODlhDgGBALMAAGBn6eYxLvvy9PnKyfOene1qZ8/..."/>
  
  <!--源码：
  <link rel="stylesheet" type="text/css" href="demo.css?__inline">
  
  编译后-->
  <style type="text/css">img { border: 5px solid #ccc; }</style>
  
  <!--源码：
  <script type="text/javascript" src="demo.js?__inline"></script>
  
  编译后-->
  <script type="text/javascript">console.log('inline file');</script>
```

```js
  // 编译前
  __inline('demo.js');
  var img = __inline('images/logo.gif');
        
  // 编译后
  console.log('inline file');
  var img = 'data:image/gif;base64,R0lGOD....'；
```

```css
  /*-- 源码 --*/
  @import url('demo.css?__inline');
  .style {
    background: url('images/logo.gif?__inline');
    /*filter不支持base64，所以没做处理*/
    _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='images/body-bg.png?__inline');
  }
  
  /*-- 编译后--*/
  img { border: 5px solid #ccc; }
  .style {
    background: url('data:image/gif;base64,R0lGODlhDgGBALMAAGBn6eYxLvvy9PnKyfOene1qZ8/R+Ker84WK7ubn');
    /*filter不支持base64，所以没做处理*/
    _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/firstblood/images/body-bg_1b8c3e0.png?__inline');
  }
```

>> 官方定义：内容嵌入可以为工程师提供诸如图片base64嵌入到css、js里，前端模板编译到js文件中，将js、css、html拆分成几个文件最后合并到一起的能力。有了这项能力，可以有效的减少http请求数，提升工程的可维护性。`fis`不建议用户使用内容嵌入能力作为组件化拆分的手段，因为下面这个能力会更适合组件化开发。

### 依赖声明

>> 官方定义：依赖声明为工程师提供了声明依赖关系的编译接口。fis在执行编译的过程中，会扫描这些编译标记，从而建立一张**静态资源关系表**，它会被产出为一份`map.json`文件，这份文件详细记录了项目内的静态资源开发路径、线上路径、资源类型以及**依赖关系**和**资源打包信息**。这样，使用fis作为编译工具的产品线，就可以将这张表提交给后端或者前端框架去运行时根据组件使用情况来按需加载资源或者资源所在的包，从而提升前端页面运行性能。

说的有点抽象，但是只需要记住一点:

* `fis`打包后，会生成一个`map.json`，一个记录着对应关系的配置文件，里面两个键值对`res`和`pkg`，前者涵盖静态资源的开发路径`uri`，资源类型`type`，依赖关系`deps`，所在包`pkg`，后者是在`fis-conf.js`中设置了`pkg`后，对应生成的包名和打包信息。


## roadmap详解

这里单独记录一下`roadmap`，因为这个玩意的配置略微有点复杂。

### roadmap.path

path配置的是目录规范

* reg 匹配文件

```
通过 * 可以匹配一级目录下的任意文件，也可以通过 *.js 指定后缀名，还可以指定更详细的目录 /a/*.js。

通过 ** 可以匹配任意路径深度的文件或目录，通过灵活组合，可以快速的指定目录或文件

/a/a.js
/b.js
/a/a/a.js

*.js      => /b.js
/a/*.js   => /a/a.js
**.js     => /a/a.js,  /b.js, /a/a/a.js
**/a/*.js => /a/a/a.js
```
>> 除此之外，还可以使用正则表达式。
