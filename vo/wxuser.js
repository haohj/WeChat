'use strict'

var mysql = require('mysql');
var config = require('../config/config');
var dbConfig = config.db_config;
var conn = mysql.createConnection(dbConfig)

conn.connect();

/**
查询所有数据
*/
exports.findAll = function() {
    return new Promise(function(resolve, reject) {
        var sql = 'SELECT * FROM tb_user'
        conn.query(sql, function(err, results, fields) {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/**
通过id查询
*/
exports.findById = function(id) {
    return new Promise(function(resolve, reject) {
        var sql = 'SELECT * FROM tb_user where id=' + id
        conn.query(sql, function(err, results, fields) {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/**
保存操作
*/
exports.save = function(student, callback) {
    return new Promise(function(resolve, reject) {
        var sql = 'SELECT * FROM tb_user where id=' + id
        conn.query(sql, function(err, results, fields) {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/**
删除操作
*/
exports.remove = function(id, callback) {
    return new Promise(function(resolve, reject) {
        var sql = 'SELECT * FROM tb_user where id=' + id
        conn.query(sql, function(err, results, fields) {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/**
更新操作
*/
exports.update = function(student, callback) {
    return new Promise(function(resolve, reject) {
        var sql = 'SELECT * FROM tb_user where id=' + id
        conn.query(sql, function(err, results, fields) {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/**
查询登录的用户名密码是否在数据库中存在
*/
exports.isExists = function(username, password) {
    return new Promise(function(resolve, reject) {
        var sql = 'SELECT * FROM tb_user where username="' + username + '" and password="' + password + '"';
        conn.query(sql, function(err, results, fields) {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}