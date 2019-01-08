# Test Socket.io

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

### 1.3. Save Socket.io Client When Connection

```javascript
let my_sockets = {};   //用于保存所有的sokcets对象

io.on('connection', (socket) => {
    // 获得客户端传来的参数
    const handshakeData = socket.request;
    const token = handshakeData._query["token"];  
    
    //TODO: 检验token 并获得id。如果认证失败，断开连接disconnect
    
    //将socket对象保存到sockets
    if(!my_sockets[id]){
        my_sockets[id] = socket;
    }
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

### 1.5. Send Message to Client By id

```javascript
const sendMessageToClient = (id, msg) => {
    if(my_sockets[id]){
        return "socket isn't exist";
    }
    my_sockets[id].emit("message", msg);   
}
```


### 1.6. Delete Sockets[token] When disconnect

```javascript
io.on('connection', (socket) => {
    socket.on("disconnect", () => {
        for(let token in sockets){      //这里通过遍历socket,其实也可以建立Map(socket.id, token)的映射
            let tmpSocket = sockets[token]; 
            if(tmpSocket.id === socket.id){
                delete sockets[token];
            }
        }
    })
});
```

## 2. Create Socket.io Client

```
    <script src="/socket.io/socket.io.js"></script>
    <script>
        var socket = io({ query: "token=xxxx" });       //服务器通过 socket.request._query.id 获得id
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