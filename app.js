const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join('../simpleAdminPanel', 'build')));

const port = process.env.PORT || 5000;

const mc = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'test'
});

mc.connect();

app.get('/', function (req, res) {
    mc.query('SELECT * FROM news', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, articles: results, message: 'news list.' });
    });
});

app.get('/group', function (req, res) {
    mc.query('SELECT * FROM test.groups', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, articles: results, message: 'group list.' });
    });
});

app.get('/teachers', function (req, res) {
    console.log("I HERE")
    mc.query('SELECT * FROM test.teachers', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, articles: results, message: 'teachers list.' });
    });
});

app.post('/groupschedule', function (req, res) {
    let group_id = req.body.id;
    mc.query('SELECT * FROM test.groupsschedule where numbergroup='+group_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, articles: results, message: 'schedule list.' });
    });
});

app.post('/teachersUpdate', function (req, res) {
    mc.query('TRUNCATE TABLE test.teachers', function (error, results, fields) {
        if (error) throw error;
        var sql = "INSERT INTO test.teachers (name, avatar, position) VALUES (?,?,?)";
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

app.post('/groupsUpdate', function (req, res) {
    mc.query('TRUNCATE TABLE test.groups', function (error, results, fields) {
        if (error) throw error;
        var sql = "INSERT INTO test.groups (name) VALUES (?)";
        for(var i = 0; i < req.body.data.length; i++) {
            mc.query(sql, [req.body.data[i].name], function (err, result) {
                if (err) throw err;
            });
        }
    });
});

app.post('/groupUpdate', function (req, res) {
    console.log("request", req.body.data);
    mc.query('DELETE FROM test.groupsschedule WHERE numbergroup=' + req.body.data[0].numbergroup, function (error, results, fields) {
        if (error) {console.log(error); throw error};
        var sql = "INSERT INTO test.groupsschedule (numbergroup, day, time, subject) VALUES (?,?,?,?)";
        for(var i = 0; i < req.body.data.length; i++) {
            mc.query(sql, [req.body.data[i].numbergroup, req.body.data[i].day, req.body.data[i].time, req.body.data[i].subject], function (err, result) {
                if (err) throw err;
            });
        }
    });
});

app.listen(port, function () {
    console.log('Node app is running on port ' + port);
});

module.exports = app;
