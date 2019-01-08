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
let sockets = {};   //用于保存所有的sokcets对象

io.on('connection', (socket) => {
    // 获得客户端传来的参数
    const handshakeData = socket.request;
    const id = handshakeData._query['id'];
    
    //将socket对象保存到sockets
    if(!sockets[id]){
        sockets[id] = socket;
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