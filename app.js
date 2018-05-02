'use strict'
var express = require('express')
var bodyParser = require('body-parser')
var router = require('./routers/wxrouter')

var app = express()

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