'use strict'

var mysql = require('mysql');
var config = require('../config/config');
var dbConfig = config.db_config;
var conn = mysql.createConnection(dbConfig)

conn.connect();

/**
查询所有数据
@param {String} tableName
@return {Array} objArray
*/
exports.findAll = (tb) => {
	return new Promise((resolve, reject) => {
		var sql = 'SELECT * FROM ' + tb
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
@param {String} id
@param {String} tableName
@return {Object} obj
*/
exports.findById = (id, tb) => {
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
@param {Object} obj
@param {String} tableName
@return {JSObject} msg
*/
exports.save = (obj, tb) => {
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
@param {String} id
@param {String} tableName
@return {JSObject} msg
*/
exports.remove = (id, tb) => {
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
@param {Object} obj
@param {String} tableName
@return {JSObject} msg
*/
exports.update = (obj, tb) => {
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