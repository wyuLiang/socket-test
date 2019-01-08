const app = require("express")();
const http = require("http").Server(app).listen(3000);
const io = require("socket.io")(http);

let sockets = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

io.use(function(socket, next) {     //middleware
    const handshakeData = socket.request;
    const token = handshakeData._query.token;
    if(!sockets[token]){
        sockets[token] = socket;
    }
    next();
});

io.on("connection", function(socket){

    console.log("a user connected");

    socket.on("disconnect", function(){
        console.log('user disconnected', socket.id);
        for(let key in sockets){
            let tmp = sockets[key];
            if(tmp.id === socket.id){
                delete sockets[key];
                break;
            }
        }
        console.log(Object.keys(sockets).length);
    });

    socket.on('chat message', function(msg){
        console.log('message ', msg);
        io.emit("message", msg);
    });
});