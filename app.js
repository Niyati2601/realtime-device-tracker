const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log('a user connected');
    socket.on('sendLocation', function(data) {
        io.emit('receiveLocation', {id: socket.id, ...data});
    });

    socket.on('disconnect', function() {
        io.emit('user disconnected', socket.id);
    });
});

app.get('/', (req, res) => {
    res.render("index");
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
