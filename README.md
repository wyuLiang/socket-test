# Test Socket.io

> 个人笔记

## 1. Create Socket.io Server


### 1.1. Socket.io Server Constructor

```javascript
/**
 * Server constructor.
 *
 * @param {http.Server|Number|Object} srv http server, port or options
 * @param {Object} [opts]
 * @api public
 */
     
 function Server(srv, opts){ /*...*/ };
```

### 1.2. Create Socket.io Server By Http.Server

```javascript
const app = require("express")();
const http = require("http").Server(app).listen(3000);
const io = require("socket.io")(http);
```

### 1.3. 连接时进行token认证，及存储socket对象

```javascript
let my_sockets = {};   //用于保存所有的sokcets对象

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


```

### 1.4. Accept Message From Client

```javascript
io.on('connection', (socket) => {
    socket.on("chat message", msg => {
        console.log('message', msg);
    })
})
```

### 1.5. Send Message to Client By user_id

```javascript
const sendMessageToClient = (user_id, msg) => {
    if(my_sockets[user_id]){
        return "socket isn't exist";
    }
    my_sockets[user_id].emit("message", msg);   
}
```


### 1.6. Delete Sockets[token] When disconnect

```javascript
io.on('connection', (socket) => {
    socket.on("disconnect", () => {
        for(let user_id in sockets){      //这里通过遍历找到对应的socket，其实也可以通过Map(socket.id, user_id)找到socket
            let tmpSocket = sockets[user_id]; 
            if(tmpSocket.id === socket.id){
                delete sockets[user_id];
            }
        }
    })
});
```

## 2. Create Socket.io Client

```
    <script src="/socket.io/socket.io.js"></script>
    <script>
        //这里每个用户的token都不一样，由于前端不熟，这里暂时写成常量。
        var socket = io({ query: "token=xxxx" });       //服务器通过 socket.request._query.token 获得token
        //or
        var socket = io( url, {query: "token=xxxx"});   //url默认是当前的服务器地址，即localhost:3000
        
        socket.on("message", msg => {             //监听服务器的message消息
            console.log("on message", msg);
        });                                 
        
        socket.emit("chat messaage", "client msg"); //发送chat message 到服务器
    </script>
```


### 3. WebSocket Client Connect Socket.io Server

**WebSocket client 如何连接Socket.io Server ？**
