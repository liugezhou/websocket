在进行webSocket实践总结之前，怎么也得对webSocket有一个简单、大体的学习与了解。
于是在进行实现一个简单的webSocket聊天代码实例之前我们可以先去读一读，来自阮大神的博客：[webScoket](http://www.ruanyifeng.com/blog/2017/05/websocket.html)
### 准备
>###### HTML和CSS基础知识
>###### JS基础知识
>###### 用过NodeJS
***
###开始
###### 一、最简单的websocket体验
>1. 在桌面文件新建一个socket文件夹，根目录下新建demo1文件夹，该文件夹下新建一个index.html 。
源代码如下：

    
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>WebSocket</title>
    </head>
    <body>
        <h1>Socket Test</h1>
        <input type="text" id="lmz_sendText">
        <button id="lmz_sendBtn">发送</button>
        <div id="lmz_recv"></div>
        <br>
        <span>欢迎关注[六个周]公众号</span>
        <script type="text/javascript">
            var websocket = new WebSocket("ws://echo.websocket.org/");
            websocket.onopen = function(){
                console.log("open 了");
                document.getElementById("lmz_recv").innerHTML="Connected";
            }
            websocket.close = function(){
                 console.log("close 了");
            }
            websocket.onmessage = function(e){
                console.log(e.data);
                 document.getElementById("lmz_recv").innerHTML=e.data;
            }

             document.getElementById("lmz_sendBtn").onclick = function(){
                 var txt =  document.getElementById("lmz_sendText").value;
                 websocket.send(txt);
             }
        </script>
    </body>
    </html>
>阅读以上源代码，非常清晰，主要是四个方法：`.onopen`、`.onclose`、`.onmessage`、`.send`

>打开浏览器进行调试，进入页面时，页面初始显示为：

![1.png](https://upload-images.jianshu.io/upload_images/2054455-30b7e26cfe7e168c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
>在框中输入文字点击发送，页面显示为如下：

![2.png](https://upload-images.jianshu.io/upload_images/2054455-83727d517d764b46.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>解析：我们在最初的这个demo中使用的是websocket的server（ws://echo.websocket.org/），可以通过浏览器的调试窗口看到：

![3.png](https://upload-images.jianshu.io/upload_images/2054455-e8ab784ff8581c1b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 二、使用node搭建一个自己的websocket_server
>**首先确保本地安装了node**
>1. 首先在socket文件夹下新建一个demo2文件夹。终端进入到demo2文件夹下，执行脚本命令`npm init `
>2. github上搜索  # **[nodejs-websocket](https://github.com/sitegui/nodejs-websocket)**，在该文件下继续执行脚本命令：`npm install nodejs-websocket`,此时的项目结构是这样的：

![npm.png](https://upload-images.jianshu.io/upload_images/2054455-9c1dd885c8935c1b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
>3.在demo2文件夹下新建一个wsServer.js服务，依据github上说明将代码copy到wsServer.js中，代码附上(服务端做的是一个将小写转换为大写的操作)：

    //wsServer.js
    var ws = require("nodejs-websocket")

    // Scream server example: "hi" -> "HI!!!"
    var server = ws.createServer(function (conn) {
	    console.log("New connection")
	    conn.on("text", function (str) {//此为对从客户端接受到的字母进行大写转换
		    console.log("Received "+str)
		    conn.sendText(str.toUpperCase()+"!!!")
	    })
	    conn.on("close", function (code, reason) {
	    	console.log("Connection closed")
	    })
    }).listen(8001)
>4.将我们开始的index.html文件复制下来，修改ws://echo.websocket.org/服务为ws://localhost:8001/，
>5.测试--终端中执行脚本命令：`node wsServer.js `，浏览器与服务器的显示如下：

![wsServer.png](https://upload-images.jianshu.io/upload_images/2054455-227c948478976ace.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 三、实现简单聊天功能-1
1.首先在socket目录下将demo2复制一份为demo3,修改index.html文件与wxServer.js文件即可。
2.修改index.html的项目局部业务代码

    index.html
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>WebSocket</title>
    </head>
    <body>
    <h1>Socket Test</h1>
    <input type="text" id="lmz_sendText">
    <button id="lmz_sendBtn">发送</button>
    <script type="text/javascript">
        var websocket = new WebSocket("ws://localhost:8001/");
        function showMessage(str){
            var div = document.createElement("div");
            div.innerHTML = str;
            document.body.appendChild(div);
            }

        websocket.onopen = function(){
            console.log("open 了");
            document.getElementById("lmz_sendBtn").onclick = function(){
             var txt =  document.getElementById("lmz_sendText").value;
             if(txt){
                websocket.send(txt);
             }
         }
        }
        websocket.close = function(){
             console.log("close 了");
        }
        websocket.onmessage = function(e){
            console.log(e.data);
            showMessage(e.data)
        } 
        </script>
    </body>
    </html>
3.修改wxServer.js代码，实现简单的聊天功能.
  
    var ws = require("nodejs-websocket")
    var PORT = 8001

    var clientCount = 0;//客户端数量

    var server = ws.createServer(function (conn) {
	console.log("New connection")
	clientCount++
	conn.nickname = "user" + clientCount //定义进来聊天群人的nickname
	broadcast(conn.nickname +" comes in") //每当有人进来就发布一个广播
	conn.on("text", function (str) {
		console.log("Received "+str)
		broadcast(str)//每当有人发送信息就有一个广播
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
		broadcast(conn.nickname +" left") //每当有人离开就发布一个广播
	})
    }).listen(PORT)

    console.log("websocket server listening on port " + PORT)

    function broadcast(str){
	server.connections.forEach(function(connection){
		connection.sendText(str)
	})
    }
4.测试：在对上述两个文件代码进行修改后，我们在终端中进入到node3项目目录下，node运行成功后，先打开一个窗口（user1.png）,再打开一个窗口（user2.png）,再打开一个窗口（user3.png）。效果如下：

![user1.png](https://upload-images.jianshu.io/upload_images/2054455-75911665d193aba5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![user2.png](https://upload-images.jianshu.io/upload_images/2054455-7702c4412b140f7d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![user3.png](https://upload-images.jianshu.io/upload_images/2054455-af0f0d4cc3599a2a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

紧接着，我们在窗口三的input框输入一段文字，点击发送，三个窗口同时输出了input框内容，则说明代码运行成功，效果如图。

![user-enter.png](https://upload-images.jianshu.io/upload_images/2054455-5f54e2189b7e2b55.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 四、实现简单聊天功能优化-2
新建femo4文件夹，复制demo3项目结构与代码。主要是对打开界面用户的进入、离开的文字颜色以及说明谁在打字做了一个小小的优化，代码如下：
###### #wsServer.js

    var ws = require("nodejs-websocket")
    var PORT = 8001

    var clientCount = 0;//客户端数量

    // Scream server example: "hi" -> "HI!!!"
    var server = ws.createServer(function (conn) {
	console.log("New connection")
	clientCount++
	conn.nickname = "user" + clientCount //定义进来聊天群人的nickname
	var mes = {}
	mes.type = "enter"
	mes.data = conn.nickname +" comes in"
	//每当有人进来就发布一个广播(JSON.stringify:将一个JavaScript值(对象或者数组)转换为一个 JSON字符串)
	broadcast(JSON.stringify(mes)) 
	conn.on("text", function (str) {
		var mes = {}
		mes.type = "message"
		mes.data = conn.nickname + ' says: '+str
		broadcast(JSON.stringify(mes)) //每当有人发送信息就有一个广播
	})
	conn.on("close", function (code, reason) {
		var mes = {}
		mes.type = "leave"
		mes.data = conn.nickname +" left"
		broadcast(JSON.stringify(mes)) //每当有人离开就发布一个广播
	})
    }).listen(PORT)

    console.log("websocket server listening on port " + PORT)

    function broadcast(str){
	server.connections.forEach(function(connection){
		connection.sendText(str)
	})
    }

###### index.html

    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>WebSocket</title>
    </head>
    <body>
    <h1>Socket Test</h1>
    <input type="text" id="lmz_sendText">
    <button id="lmz_sendBtn">发送</button>
    <script type="text/javascript">
        var websocket = new WebSocket("ws://localhost:8001/");
        function showMessage(str,type){
            var div = document.createElement("div");
            div.innerHTML = str;
            if(type=="enter"){
                div.style.color="green";
            }else if(type=="leave"){
                div.style.color="red";
            }
            document.body.appendChild(div);
            }

        websocket.onopen = function(){
            console.log("open 了");
            document.getElementById("lmz_sendBtn").onclick = function(){
             var txt =  document.getElementById("lmz_sendText").value;
             if(txt){
                websocket.send(txt);
             }
         }
        }
        websocket.close = function(){
             console.log("close 了");
        }
        websocket.onmessage = function(e){
            var mes = JSON.parse(e.data)
            showMessage(mes.data,mes.type)
        }
        </script>
    </body>
    </html>
主要是在进入（onpen）、离开（onclose）、会话（onmessage）三个客户端与服务端的方法中对数据进行格式化、进行了一个JSON封装、解析，然后进行的显示。效果图如下：
![优化.png](https://upload-images.jianshu.io/upload_images/2054455-7d8e8ef47a0af1d9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
回看wsServer.js中的代码，发现出现了很多对象的格式化封装，像mes.type这样定义比较冗余的，这个过程应该由框架来做，然后我们使用socket.io来实现。
###### 五、socket.io入门_1
学习一门新技术的最好方式是看官方文档，[socket.io](https://socket.io/demos/chat/),一定要慢慢适应看英文技术文档，我相信学习的内容越多，知识面越宽广越需要我们观看官方技术文档的能力，就好比学vue最好的教程一定是vue官方文档。

在浏览的过程中，首先体验了一下官方文档的聊天demo，地址戳这里：https://socket.io/demos/chat/，感觉这就是全世界最大的一个群聊，虽然体验的时候保持在20多个人上下，但是与一个名为Nick的小伙伴的一些聊天，瞬间感觉有些不一样，大伙也不妨去试试，挺有意思的。
ok,back here!

新建一个demo5文件，与之前代码一样，同理修改html与js文件，并在官网下载一个client的js文件，服务端需要npm install 一下socket.io(版本均为最新2.2.0版)，代码直接附上。效果跟第四部分相同。
###### index.html

    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>WebSocket</title>
    <script type="text/javascript" src="socket.io-2.2.0.js"></script>
    </head>
    <body>
    <h1>Socket Test</h1>
    <input type="text" id="lmz_sendText">
    <button id="lmz_sendBtn">发送</button>

    <script type="text/javascript">
        var socket = io("ws://localhost:8001/");
        function showMessage(str,type){
            var div = document.createElement("div");
            div.innerHTML = str;
            if(type=="enter"){
                div.style.color="green";
            }else if(type=="leave"){
                div.style.color="red";
            }
            document.body.appendChild(div);
        }

    document.getElementById("lmz_sendBtn").onclick = function(){
        var txt =  document.getElementById("lmz_sendText").value;
        if(txt){
            socket.emit('message',txt)
        }
    }

    socket.on('enter',function(data){
        showMessage(data,'enter')
	})

	socket.on('message',function(data){
        showMessage(data,'message')
	})

    socket.on('leave',function(data){
        showMessage(data,'leave')
	})
       
        </script>
    </body>
    </html>
##### wsServer.js

    var app = require('http').createServer()
    var io = require('socket.io')(app)

    var PORT = 8001

    var clientCount = 0;//客户端数量

    app.listen(PORT)

        io.on('connection',function(socket){
	clientCount++
	socket.nickname = 'user' + clientCount //定义进来聊天群人的nickname

	io.emit('enter',socket.nickname + ' comes in ')

	socket.on('message',function(str){
		io.emit('message',socket.nickname + ' says: '+str)
	})

	socket.on('disconnect',function(){
		io.emit('leave',socket.nickname +" left")
	})
    })
    console.log("websocket server listening on port " + PORT)
这一部分需要对源码进行一个简单的梳理，最终的代码结构目录如下：
![Finnal.png](https://upload-images.jianshu.io/upload_images/2054455-2c50ed5f1b7024f2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

官方例子待更新。


如有疑问请添加我的微信号：18231133236。欢迎交流！
更多内容，请访问的我的个人博客：[https://www.liugezhou.online](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.liugezhou.online).
您也可以关注我的个人公众号：【Dangerous Wakaka】

![wechatDangerous.jpg](https://upload-images.jianshu.io/upload_images/2054455-9ac6a46a295334aa.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

