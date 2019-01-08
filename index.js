const app = require("express")();
const http = require("http").Server(app).listen(3000);
const io = require("socket.io")(http);

let sockets = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

io.use(function(socket, next) {
    const handshakeData = socket.request;
    const id = handshakeData._query['id'];
    if(!sockets[id]){
        sockets[id] = socket;
    }
    next();
});

io.on("connection", function(socket){

    console.log("a user connected");

    socket.on("disconnect", function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        console.log('message ', msg);
    });
});