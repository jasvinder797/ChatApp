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
    var u = "",
        clr = "",
        id = "",
        i = 0;
    //socket.broadcast.emit('userList',onlineUsers)
    socket.on('login', function (userName, email, color) {
        u = userName;
        clr = color;
        id = socket.id;
        // console.log("****"+onlineUsers)
        var index = onlineUsers.findIndex(x => x.email == email);
        if (index < 0) {
            console.log("****" + index)
            var obj = new Object();
            obj.id = socket.id;
            obj.name = userName;
            obj.email = email;
            obj.color = color;
            onlineUsers.push(obj);
            console.log(onlineUsers)
        }
        socket.emit('userList', onlineUsers);
        socket.broadcast.emit('userList', onlineUsers)
    })
    socket.on('sendMessage', function (email, userName, message, color) {
        console.log(id + "send");
        socket.emit('displayMsg', email, userName, message, color, id);
        socket.broadcast.emit('displayMsg', email, userName, message, color, id)
    })
    socket.on('sendToIndividual', function (data) {
        console.log(socket.id)
        socket.broadcast.to(data.toId).emit('sendMsg', {
            msg: data.msg,
            from: data.from,
            clr: data.clr,
            fromEmail: data.fromEmail
        });
    })
    socket.on('sendImgMsg', function (fromMail, userName, imgSrc, color) {
        socket.emit('displayImg', fromMail, userName, imgSrc, color, id);
        socket.broadcast.emit('displayImg', fromMail, userName, imgSrc, color, id)
    })
    socket.on('sendImgMsgInd', function (data) {
        socket.broadcast.to(data.toId).emit('displayImgInd', {
            img: data.img,
            from: data.from,
            clr: data.clr,
            fromEmail: data.fromEmail
        })
    })
    socket.on('disconnect', function () {
        var index = onlineUsers.findIndex(x => x.id == socket.id);
        console.log("socket Id >>> " + socket.id);
        console.log("index Id >>> " + index);
        if (index >= 0) {
            onlineUsers.splice(index, 1);
        }
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
server.listen(port, function () {
    console.log("Server is running at : http://localhost:" + port);
});
