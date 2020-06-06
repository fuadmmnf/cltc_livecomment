const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

const io = require('socket.io')(server);
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'madladsIncqwer1234',
    database: 'chinese_app'
});
connection.connect();


const server = app.listen(3001, function () {
    console.log('server running on port 3001');
});


app.get('get/messages/:live_id', function (req, res) {
    var liveClassMessagesQuery = `SELECT * FROM 'messages' WHERE 'live_id' = ${req.params.live_id}`;
    connection.query(liveClassMessagesQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200);
        res.send(results);
    });
});


io.on('connection', function (socket) {

    socket.on('live_comment-signal', function (data) {

        var storeMessageToTableQuery = `INSERT INTO 'messages' ('id', 'user_id', 'live_id', 'content', 'created_at', 'updated_at') VALUES (NULL, ${data.user_id}, ${data.live_id}, ${data.message}, NULL, NULL);`;
        connection.query(storeMessageToTableQuery, function (error, results, fields) {
            if (error) throw error;
            io.emit('live_comment-submit', results);
        });

    });


    socket.on('quit', function () {
        socket.disconnect();
    });

    socket.on('disconnect', function () {
        console.log('disconnected: ' + socket.id);
        // console.log(socket.id);

    });


});



