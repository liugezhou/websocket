var ws = require("../demo4/node_modules/nodejs-websocket")
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