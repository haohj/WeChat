'use strict'

var fs = require('fs')
var Promise = require('bluebird')

exports.readFileAsync = function(fpath, encoding) {
	return new Promise(function(resolve, reject) {
		fs.readFile(fpath, encoding, function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
}

exports.writeFileAsync = function(fpath, content) {
	return new Promise(function(resolve, reject) {
		fs.writeFile(fpath, content, function(err) {
			if(err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})
}