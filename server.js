var express = require('express'),
 path = require('path'),
 bodyParser = require('body-parser'),
 routes = require('./routes/web'), //web routes
 apiRoutes = require('./routes/api'), //api routes
 connection = require("./config/db"); //mongodb connection
var cors = require('cors');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(cors());
// parse application/json 
app.use(bodyParser.json());
//array to store connected users
var onlineUsers = [];
// setting static files location './app' for angular app html and js
app.use(express.static(path.join(__dirname, 'static')));
//for socket
io.on('connection', function (socket) {
    var u = "", clr = "", id="", i=0;
     socket.on('login',function(userName,email,color)
     {
         console.log('connectd'+userName); 
         
            var index = onlineUsers.findIndex(x => x.email==email); 
            console.log(onlineUsers)
            if(index<0){
                console.log('connectd'+userName); 
                u = userName;
                clr = color; 
                id = socket.id;
                var obj = new Object();
                obj.id=socket.id;
                obj.name=userName;
                obj.email=email;
                obj.color=color;
                onlineUsers.push(obj);
            }
            console.log(onlineUsers)
            socket.emit('userList', userName,color,id,onlineUsers);
            socket.broadcast.emit('userList', userName,color,id,onlineUsers)
      
     })
     socket.on('sendMessage',function(email,userName,message,color)
     {
       console.log(id+"send"); 
       socket.emit('displayMsg', email,userName,message,color,id);
       socket.broadcast.emit('displayMsg', email,userName,message,color,id)
     })
    socket.on('sendToIndividual',function(data)
     {
        console.log(data.fromEmail)
        var index = onlineUsers.findIndex(x => x.email==data.fromEmail);
       console.log(index)
//        var strObj = JSON.stringify(onlineUsers[index]);
//        var senderObj = JSON.parse(strObj)
//        console.log(senderObj.id)
//        socket.to(senderObj.id).emit('sendMsg',{email:data.fromEmail, msg:data.msg,from:data.from,clr:data.clr});
//        socket.broadcast.to(senderObj.id).emit('sendMsg',{msg:data.msg,from:data.from,clr:data.clr});
       
        socket.to(data.toId).emit('sendMsg',{email:data.fromEmail,msg:data.msg,from:data.from,clr:data.clr});
        socket.broadcast.to(data.toId).emit('sendMsg',{msg:data.msg,from:data.from,clr:data.clr});
     })
    socket.on('sendImgMsg',function(userName,imgSrc,color)
     {
       //console.log(imgSrc); 
       socket.emit('displayImg', userName,imgSrc,color,id);
       socket.broadcast.emit('displayImg',  userName,imgSrc,color,id)
     })
     socket.on('disconnect', function(){
        var index = onlineUsers.findIndex(x => x.id==id);
        console.log("index "+index);
        onlineUsers.splice(index, 1);
        console.log(onlineUsers)
        socket.emit('out', onlineUsers);
        socket.broadcast.emit('out', onlineUsers)
    })	
})
// setting static files location './node_modules' for libs like angular, bootstrap
app.use(express.static('node_modules'));
 
// configure our routes
app.use('/', routes);
app.use('/api', apiRoutes);

// setting port number for running server
var port = process.env.PORT || 8000;

// starting express server
server.listen(port, function() {
 console.log("Server is running at : http://localhost:" + port);
});