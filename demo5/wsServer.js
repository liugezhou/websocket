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