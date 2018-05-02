'use strict'

var mysql = require('mysql');
var conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123',
	database: 'test2'
})

conn.connect();

/**
查询所有数据
*/
exports.findAll = function() {
	return new Promise(function(resolve, reject) {
		var sql = 'SELECT * FROM tb_user'
		conn.query(sql, function(err, results, fields) {
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
exports.findById = function(id, callback) {
	fs.readFile(dbPath, 'utf8', function(err, data) {
		if(err) {
			return callback(err);
		}
		var students = JSON.parse(data).students

		var stu = students.find(function(item) {
			return item.id === id
		})
		callback(null, stu)
	})
}

/**
保存操作
*/
exports.save = function(student, callback) {
	fs.readFile(dbPath, 'utf8', function(err, data) {
		if(err) {
			return callback(err);
		}

		var students = JSON.parse(data).students

		if(students.length > 0) {
			student.id = students[students.length - 1].id + 1
		} else if(students.length - 1 > 0) {
			student.id = 2
		} else {
			student.id = 1
		}

		students.push(student)

		var fileData = JSON.stringify({
			students: students
		})

		fs.writeFile(dbPath, fileData, function(err) {
			return callback(err)
		})
	})
}

/**
删除操作
*/
exports.remove = function(id, callback) {
	//从文件中读取数据
	fs.readFile(dbPath, 'utf8', function(err, data) {
		if(err) {
			return callback(err);
		}
		var students = JSON.parse(data).students

		var index = students.findIndex(function(item) {
			return item.id === id
		})

		students.splice(index, 1);

		//将数据保存到文件中
		var fileData = JSON.stringify({
			students: students
		})
		fs.writeFile(dbPath, fileData, function(err) {
			return callback(err)
		})
	})
}

/**
更新操作
*/
exports.update = function(student, callback) {
	//从文件中读取数据
	fs.readFile(dbPath, 'utf8', function(err, data) {
		if(err) {
			return callback(err);
		}
		var students = JSON.parse(data).students

		var stu = students.find(function(item) {
			return item.id === student.id || item.id.toString() === student.id
		})

		for(var key in student) {
			if((typeof stu[key]) == 'number' && (typeof student[key]) == "string") {
				stu[key] = parseInt(student[key])
			} else {
				stu[key] = student[key]
			}
		}

		//将数据保存到文件中
		var fileData = JSON.stringify({
			students: students
		})
		fs.writeFile(dbPath, fileData, function(err) {
			return callback(err)
		})
	})
}