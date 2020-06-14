var express = require('express');
var fs = require('fs');
var cors = require('cors');
var https = require('https');
var app = express();
app.use(cors());
app.get('/', function (req, res) {
    res.send('hello world')
});

const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app)
    .listen(3003, function () {
    });



const io = require('socket.io')(server);

io.on('connection', function (socket) {

    socket.on('live_comment-signal', function (data) {
        // var storeMessageToTableQuery = `INSERT INTO messages (id, user_id, live_id, content, created_at, updated_at) VALUES (NULL, ${data.user_id}, ${data.live_id}, '${data.message}', NULL, NULL)`;
        // connection.query(storeMessageToTableQuery, function (error, results, fields) {
        //     if (error) throw error;
        //     console.log(results);
        // });
        io.emit('live_comment-submit', data);

    });


    socket.on('quit', function () {
        socket.disconnect();
    });

    socket.on('disconnect', function () {
        console.log('disconnected: ' + socket.id);
        // console.log(socket.id);

    });


});
