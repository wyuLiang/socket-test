const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

let id2Socket = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

io.use(function(socket, next) {
    const handshakeData = socket.request;
    const id = handshakeData._query['id'];
    if(!id2Socket[id]){
        id2Socket[id] = socket;
    }
    next();
});

io.on("connection", function(socket){

    console.log("a user connected");

    socket.on("disconnect", function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        console.log('message ', + msg);
    });
});

http.listen(3000, function(){
    console.log("listening on *:3000");
});

setInterval(function(){
    if(id2Socket["1"]){
        id2Socket["1"].emit("message", "123456");
        console.log(id2Socket["1"]);
    }
}, 3000);