const express = require ('express')
const http = require ('http')
const path = require ('path')
const {Server} = require ('socket.io')

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.resolve("./public")));


io.on('connection',(socket) => {
    socket.on('user-message', (message)=>{
        io.emit('message', message)
    });
});


const PORT = process.env.PORT ||3000 ;

app.get('/', (req,res) => { 
    return res.sendFile('/public/index.html')
})

server.listen(PORT,() => console.log (`server is running on port ${PORT}`));