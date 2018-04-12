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

// setting static files location './app' for angular app html and js
app.use(express.static(path.join(__dirname, 'static')));
//for socket
io.on('connection', function (socket) {
    console.log("connected");
    var u = "", clr = "";
     socket.on('login',function(userName,color)
     {
        console.log('connectd'+userName); 
        socket.emit('userList', userName,color);
        u = userName;
        clr = color; 
        socket.broadcast.emit('userList', userName,color)
     })
     socket.on('sendMessage',function(userName,message,color)
     {
       console.log("send"); 
       socket.emit('displayMsg', userName,message,color);
       socket.broadcast.emit('displayMsg', userName,message,color)
     })
    socket.on('sendImgMsg',function(userName,imgSrc,color)
     {
       //console.log(imgSrc); 
       socket.emit('displayImg', userName,imgSrc,color);
       socket.broadcast.emit('displayImg',  userName,imgSrc,color)
     })
     socket.on('disconnect', function(){
	 console.log("disconnect");
        socket.emit('disconnec', u,clr);
        socket.broadcast.emit('disconnec', u,clr)
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