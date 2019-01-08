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

    if(token !== "token"){      //这里进行权限认证
        console.log("##### token is fail ####");
        return next(new Error("fail"));     //客户端可以通过socket.on('error'，err => {})监听
    }

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