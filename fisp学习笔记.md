# fisp学习笔记

记录一下自己学习`fisp`的过程中的知识点，多动动手，记一记吧。


## 什么是fisp

`fisp`是对`fis`的一种拓展，基于PHP的前端集成解决方案，面向自动化，减少人工管理静态资源成本和风险，全自动优化页面性能、减少服务器开销；面向定制化，包括PC、Mobile、I18n等大量个性化解决方案。


## 详解目录结构

fisp项目应该遵循的目录规则。

### page目录

在模块中，用户可直接访问浏览的页面（即url）称为页面模板（*.tpl），存放在 模块根目录/page 下，url 访问路径为 /模块名/page/ 页面名，例如 path_to_user_module/page/view.tpl，访问 url 为：/user/page/view。


### widget目录

用于存放各种组件：

* 模板组件
存放在 模块根目录/widget 下，每个 widget 包含至少一个与 widget 目录 同名 的 tpl，同时可以有与 widget 同名 的 js、css 作为其静态资源。组件存储方式为：
```js
  tpl ：path_to_module/widget/组件名/组件名.tpl
  js ：path_to_module/widget/组件名/组件名.js
  css ：path_to_module/widget/组件名/组件名.css
```

* JS组件
独立 js 代码片段，JS 组件可以封装 CSS 组件的代码。组件存储的方式为：
```js
  js ：path_to_module/widget/ui/组件名/组件名.js
```

* CSS组件
独立 css 代码片段。可以被其他 css，js，模板引用。组件存储方式为：
```js
  css ：path_to_module/widget/ui/组件名/组件名.css
```


### test目录

fis 开发环境允许在本地开发中设置测试数据进行调试（在开发环境数据是写死的，上线的数据是后端接口给的），测试数据以页面模板为单位进行组织，其存储方式为：
```js
  tpl：path_to_module/page/模块名/页面名.tpl
  data：path_to_module/test/page/页面名.json(或php)
```


### static目录

非组件资源目录，包括模板页面引用的静态资源和其他静态资源（favicon,crossdomain.xml等）。


### plugin目录

存放模板插件，如jquery，vue等(可选，对于特殊需要的产品线，可以独立维护)。


### fis-conf.js

每一个模块下都应该有对应的 fis-congf.js

```js
fis.config.merge({
    // 制定命名空间，避免静态资源的名字冲突。可以为任意值，可以不跟模块根目录相同
    namespace : 'home',
    // 设置打包项，键名是打包的路径（包含最终的包名），键值是需要打包的静态资源，记得要 fis release -p 才能生效
    // 注意，打包路径最终会作一次处理，pkg生成在 /static/module/pkg ，因为在实际项目中是多模块开发，所以static中会有多个module，而不同module对应的pkg都会生成在这个 /static/module/ 里面
    pack : {
        'static/pkg/aio.css' : [
            'static/lib/css/bootstrap.css',
            'static/lib/css/bootstrap-responsive.css',
            // * 表示匹配一级目录下的任意文件，**表示匹配任意路径深度的文件或目录
            'widget/**.css'
        ],
        'static/pkg/aio.js' : [
            'static/lib/js/jquery-1.10.1.js',
            'widget/**.js'
        ]
    }
});
```


## 资源的引用规则

### page 如何引入 widget

在 *.tpl 中通过widget插件加载组件（模块化页面片段），name属性对应文件路径和模块名，即文件目录路径：
```js
{%widget
    name="common:widget/sidebar/sidebar.tpl"
    data=$docs
%}
```

### page 如何引入 widget 目录下的静态资源

* 加载模版
根据目录规范widget目录下的静态资源将被进行组件化封装 ，同名依赖原则：使用widget下的组件（模版）时，该组件的同名css和js也会被加载（组件化思想），就相当于它们是一个整体，只是没有写在一起而已。
```js
{%widget
    name="common:widget/sidebar/sidebar.tpl"
    data=$docs
%}
```

* 加载js
  * 使用某个widget下的tpl模版时，js自动加载并引入，但虽说是组件整体化,自动加载js，引入了数据和方法，但在模板中真正使用js，必须放到 {%script%} {%/script%} 之间，用它来代替js的内联用法。
  * 通过`{%script%}require('/widget/a.js');{%/script%}`引入，并且调用其中的数据和方法。

* 加载css
  * 同名依赖，当使用某个widget下的js时或者使用某个widget下的tpl模版时，同名css自动加载并生效
  * 通过smarty的require插件 `{%require name="home:widget/a.css"%}`


## 模版开发的种种

上面提到过，页面模版就是在 /module/page/ 里面的tpl文件，用于给用户直接访问的（url形式）。

### 前言-fisp的蜜汁打包

先看一段代码，很常规的依赖声明：
```js
  {%require name="home:static/lib/css/bootstrap.css"%}
  {%require name="home:static/lib/css/bootstrap-responsive.css"%}
  {%require name="home:static/lib/js/jquery-1.10.1.js"%}
```

但是，要搞清楚4点：
1. 资源的引用路径和名字可以直接写死为开发路径，在fisp release -m打包后，生成的html会自动补上编译后的路径和版本号(fisp的资源定位能力)，反正直接写死就可以。
2. 在fisp release打包后，会在服务器的根目录生成一个static目录，里面会有开发时对应的模块目录，每个模块目录下会保存着原来模块的static结构，外加一个widget结构。
3. 在fisp release -p打包后（前提是在fis-conf.js中设置了pack），会在/static/module/下生成一个整合资源包pkg，而且html对资源的引用会自动调整为整合资源包的内容，而不再是独立的静态资源（无需像fis那样借助插件实现）。
4. fis release的顺序，永远都是先处理版本号(-m)&压缩(-o)&域名前缀(-D)，最后才是打包(-p)。

### 标签插件

* 使用html插件{%html%}{%/html%}替换普通html标签，设置页面运行的前端框架，以及控制整体页面输出。
* 使用head插件{%head%}{%/head%}替换head标签，主要为控制加载同步静态资源使用
* 使用body插件{%body%}{%/body%}替换body标签，主要为可控制加载JS资源，编译后会在页面底部集中输出JS静态资源。
* 使用script插件{%script%}{%/script%}代替script标签，收集使用JS组件的代码块
  * 使用异步JS组件的JS代码块，`{%script%}require.async("home:static/ui/B/B.js",function(m){...});{%/script%}`，必须通过插件包裹
  * 其他情况下，没有强制要求

layout.tpl：
```js
<!DOCTYPE html>
{%html framework="common:static/mod.js" class="expanded"%}
    {%head%}
        <meta charset="utf-8"/>
        <meta content="{%$description%}" name="description">
        <title>{%$title%}</title>
        {%block name="block_head_static"%}{%/block%}
    {%/head%}
    {%body%}
    {%block name="content"%}{%/block%}
    {%/body%}
{%/html%}
```

layout.tpl定义了页面的整体输出结构，给后面开发的具体模版页面所承继，模版页面承继后的主要操作就是根据block写入各种组件，标签，脚本，将其补充完整

```js
{%extends file="common/page/layout.tpl"%}
{%block name="block_head_static"%}
    <!--[if lt IE 9]>
        <script src="/lib/js/html5.js"></script>
    <![endif]-->
    {%require name="home:static/lib/css/bootstrap.css"%}
    {%require name="home:static/lib/css/bootstrap-responsive.css"%}
    {%require name="home:static/lib/js/jquery-1.10.1.js"%}
{%/block%}
{%block name="content"%}
    <div id="wrapper">
        <div id="sidebar">
            {%widget
                name="common:widget/sidebar/sidebar.tpl"
                data=$docs
            %}
        </div>
        <div id="container">
            {%widget name="home:widget/slogan/slogan.tpl"%}
            {%foreach $docs as $index=>$doc%}
                {%widget
                    name="home:widget/section/section.tpl"
                    call="section"
                    data=$doc index=$index
                %}
            {%/foreach%}
        </div>
    </div>
    {%require name="home:static/index/index.css"%}
    {%* 通过script插件收集JS片段 *%}
    {%script%}var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F70b541fe48dd916f7163051b0ce5a0e3' type='text/javascript'%3E%3C/script%3E"));{%/script%}
{%/block%}
```

### 模版组件

只要在widget目录下的Smarty模板（*.tpl）即为模板组件， 目录下有与模板同名的 JS、CSS 文件，FIS 会自动添加依赖关系处理，在模板渲染时进行同步加载。