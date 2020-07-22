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