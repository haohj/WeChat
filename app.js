'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routers/wxrouter')
const session = require('express-session')
const cookieParser = require('cookie-parser');

const app = express()

app.use(cookieParser('sessiontest'));
app.use(session({
    secret: 'sessiontest', //与cookieParser中的一致
    resave: true,
    saveUninitialized: true
}));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
//app.use(bodyParser({uploadDir:'./uploads'}))
// parse application/json
app.use(bodyParser.json())

app.engine('html', require('express-art-template'))

app.use('/public/', express.static('public')); //设置今天文件目录
app.use('/node_modules/', express.static('./node_modules')); //设置今天文件目录

app.use(router)

app.use(function(req, res, next) {
    res.status(404);
    res.render('404.html');
});

app.listen(3000, function() {
    console.log('server starting 3000')
})