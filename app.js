const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.static(path.join('../simpleAdminPanel', 'build')));

const port = process.env.PORT || 5000;

const mc = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1111',
    //password: 'makememinet',
    database: 'cmpsdb'
});

mc.connect();

app.get('/', function (req, res) {
    mc.query('SELECT * FROM news', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, articles: results, message: 'news list.' });
    });
});

app.get('/getGroup', function (req, res) {
    mc.query('SELECT * FROM cmpsdb.groups', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, articles: results, message: 'group list.' });
    });
});

app.get('/getTeachers', function (req, res) {
    console.log("I HERE");
    mc.query('SELECT * FROM cmpsdb.teachers', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, articles: results, message: 'teachers list.' });
    });
});

app.get('/getUsers', function (req, res) {
    console.log("I HERE getUsers");
    mc.query('SELECT * FROM cmpsdb.users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, articles: results, message: 'users list.' });
    });
});

app.post('/getGroupschedule', function (req, res) {
    let group_id = req.body.id;
    mc.query('SELECT * FROM cmpsdb.groupsschedule where numbergroup='+group_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, articles: results, message: 'schedule list.' });
    });
});

app.post('/teachersUpdate', function (req, res) {
    mc.query('TRUNCATE TABLE cmpsdb.teachers', function (error, results, fields) {
        if (error) throw error;
        var sql = "INSERT INTO cmpsdb.teachers (name, avatar, position) VALUES (?,?,?)";
        for(var i = 0; i < req.body.data.length; i++) {
            console.log(req.body.data[i].name);
            mc.query(sql, [req.body.data[i].name, req.body.data[i].avatar, req.body.data[i].position], function (err, result) {
                if (err) throw err;
            });
        }
    });
});

app.post('/newsUpdate', function (req, res) {
    var sql = "INSERT INTO news (title, description, url, urlToImage, who, publishedAt) VALUES (?,?,?,?,?,?)";
        mc.query(sql, [req.body.title, req.body.description, req.body.url, req.body.urlToImage, req.body.who, req.body.publishedAt], function (err, results) {
           if (err) throw err;
           return res.send({ error: false, articles: results, message: 'news added.' });
        });
});

app.post('/userDBUpdate', function (req, res) {
    console.log(req.body);
    var sql = "INSERT INTO users (first_name, last_name, phone_number, email, instagram_link, telegram_link) VALUES (?,?,?,?,?,?)";
    mc.query(sql, [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email, req.body.instagram_link, req.body.telegram_link], function (err, results) {
        if (err) throw err;
        return res.send({ error: false, articles: results, message: 'user added.' });
    });
});

app.post('/groupsUpdate', function (req, res) {
    mc.query('TRUNCATE TABLE cmpsdb.groups', function (error, results, fields) {
        if (error) throw error;
        var sql = "INSERT INTO cmpsdb.groups (name) VALUES (?)";
        for(var i = 0; i < req.body.data.length; i++) {
            mc.query(sql, [req.body.data[i].name], function (err, result) {
                if (err) throw err;
            });
        }
    });
});

app.post('/groupUpdate', function (req, res) {
    console.log("request", req.body.data);
    mc.query('DELETE FROM cmpsdb.groupsschedule WHERE numbergroup=' + req.body.data[0].numbergroup, function (error, results, fields) {
        if (error) {console.log(error); throw error};
        var sql = "INSERT INTO cmpsdb.groupsschedule (numbergroup, day, time, subject) VALUES (?,?,?,?)";
        for(var i = 0; i < req.body.data.length; i++) {
            mc.query(sql, [req.body.data[i].numbergroup, req.body.data[i].day, req.body.data[i].time, req.body.data[i].subject], function (err, result) {
                if (err) throw err;
            });
        }
    });
});

app.use(express.static(path.join(__dirname,'../simpleAdminPanel',  'build')))
    .get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../simpleAdminPanel', 'build/index.html'));
    })
    .listen(port, () => console.log(`Listening on ${ port }`))

module.exports = app;



// app.use((err, request, response, next) => {
//     // логирование ошибки, пока просто console.log
//     console.log(err);
//     response.status(500).send('Something broke!')
// });
// app.listen(7000);
