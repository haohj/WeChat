'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routers/wxrouter')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const app = express()

var identityKey = 'skey'

app.use(session({
    name: identityKey,
    secret: 'chyingp', // 用来对session id相关的cookie进行签名
    store: new FileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
    resave: false, // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 10 * 1000 // 有效期，单位是毫秒
    }
}))


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