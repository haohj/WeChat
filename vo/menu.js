'use strict'

var mysql = require('mysql');
var config = require('../config/config');
var dbConfig = config.db_config;
var conn = mysql.createConnection(dbConfig)

conn.connect();

/**
查询所有数据
*/
exports.findAll = () => {
	return new Promise((resolve, reject) => {
		var sql = 'SELECT * FROM tb_menu'
		conn.query(sql, (err, results, fields) => {
			if(err) {
				return reject(err)
			}
			return resolve(results)
		})
	})
}

/**
通过id查询
*/
exports.findById = (id) => {
	return new Promise((resolve, reject) => {
		var sql = 'SELECT * FROM tb_menu'
		conn.query(sql, (err, results, fields) => {
			if(err) {
				return reject(err)
			}
			return resolve(results)
		})
	})
}

/**
保存操作
*/
exports.save = (obj) => {
	return new Promise((resolve, reject) => {
		var sql = 'SELECT * FROM tb_menu'
		conn.query(sql, (err, results, fields) => {
			if(err) {
				return reject(err)
			}
			return resolve(results)
		})
	})
}

/**
删除操作
*/
exports.remove = (id) => {
	return new Promise((resolve, reject) => {
		var sql = 'SELECT * FROM tb_menu'
		conn.query(sql, (err, results, fields) => {
			if(err) {
				return reject(err)
			}
			return resolve(results)
		})
	})
}

/**
更新操作
*/
exports.update = (obj) => {
	return new Promise((resolve, reject) => {
		var sql = 'SELECT * FROM tb_menu'
		conn.query(sql, (err, results, fields) => {
			if(err) {
				return reject(err)
			}
			return resolve(results)
		})
	})
}