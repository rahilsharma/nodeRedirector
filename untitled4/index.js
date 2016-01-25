var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var bodyParser = require("body-parser");
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
var objToSend = {
    "createdAt": "2016-01-18T09:25:28.099Z",
    "creatorId": {
        "createdAt": "2015-10-02T14:31:31.422Z",
        "displayName": "ritesh Raj",
        "email": "riteshgrdh@gmail.com",
        "enabled": true,
        "followsStocks": {
            "__type": "Relation",
            "className": "Stock"
        },
        "profilePic": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",
        "updatedAt": "2016-01-10T16:01:46.430Z",
        "userData": {
            "__type": "Pointer",
            "className": "UserData",
            "objectId": "B2MC9ntj92"
        },
        "username": "riteshgrdh@gmail.com",
        "objectId": "fhDsaUqN6S",
        "__type": "Object",
        "className": "_User"
    },
    "ideaText": "19",
    "type": 1,
    "updatedAt": "2016-01-18T09:25:28.380Z",
    "objectId": "nfDjREsXoQ"
};

var numUsers = 0;
var socketIdentifierObject = {};
var socketIdentifierArray = [];
app.get('/getAllIds',function(req,res){
    console.log("came here");
   res.send(socketIdentifierObject);
});
app.get('/sendToUser' , function(req,res){
    console.log("came here");
    var name =  req.query.objId;
    console.log(name);
    var socketId = socketIdentifierObject[name];
    console.log("sending message to user with id " + socketId);
    if (io.sockets.connected[socketId]){
        io.sockets.connected[socketId].emit('message',objToSend);
    }
    res.send(socketId);
});
app.post('handle',function(request,response){
    var query1=request.body.var1;
    var query2=request.body.var2;
    console.log(query1 + query2);
    io.sockets.clients().forEach(function (socket) {
       console.log(socket);
    });
    if (io.sockets.connected[socketid]) {
        io.sockets.connected[socketid].emit('message', 'for your eyes only');
    }
});
io.on('connection', function(socket) {
    var addedUser = false;
// when the client emits 'add user', this listens and executes
socket.on('add user', function (username) {
    console.log("adding user !!!!!" + username);
    if (addedUser) return;
    // we store the username in the socket session for this client

    socket.username = username;
    ++numUsers;
    var tmpObj = {};
    tmpObj.username=username;
    tmpObj.id=socket.id;
    socketIdentifierArray.push(tmpObj);
    //whenver a same user is added user is added remove this user from our object
  //  if (socketIdentifierObject[username]){
  //      delete socketIdentifierObject[username];
  //  }
    socketIdentifierObject[username]=socket.id;
    addedUser = true;
    socket.emit('login', {
        numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
    });
    console.log(socketIdentifierObject);

});

    socket.on('disconnect', function () {
        //delete socket id info our servers
    console.log("a user was disco");
    });

});
http.listen(3000, function(){
    console.log('listening on *:3000');
})