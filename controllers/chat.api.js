var express = require("express"),
router = express.Router();
var app = express();
var path = require("path");
var server = require('http').Server(app);
var io = require('socket.io')(server);
router.get("/", function(req, res) {
    res.send("dk")
    app.use(express.static(path.join(__dirname,"static")))
    io.on('connection', function (socket) {
    console.log("connected");
        res.send("hello")
//     socket.on('userName',function(userName,color)
//     {
//       console.log('user'); 
//       socket.emit('userList', userName,color);
//       socket.broadcast.emit('userList', userName,color)
//     })
//      socket.on('sendMessage',function(userName,message,color)
//     {
//       console.log("send"); 
//       socket.emit('displayMsg', userName,message,color);
//       socket.broadcast.emit('displayMsg', userName,message,color)
//     })
	// socket.on('disconnect', function(){
	// console.log("disconnect");
    //        socket.emit('userList', data);
    //      socket.broadcast.emit('userList', data)
    //    })	
});
})

module.exports = router;