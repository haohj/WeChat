'use strict'
//http://xsh2ms.natappfree.cc
var sha1 = require('sha1')
var WeChat = require('./wechat')
var util = require('./util')
var getRawBody = require('raw-body')

module.exports = function(opts) {
	var wechat = new WeChat(opts)

	return function*(next) {
		var that = this
		var token = opts.token
		var signature = this.query.signature
		var timestamp = this.query.timestamp
		var nonce = this.query.nonce
		var echostr = this.query.echostr

		//1）将token、timestamp、nonce三个参数进行字典序排序
		var str = [token, timestamp, nonce].sort().join('')

		//2）将三个参数字符串拼接成一个字符串进行sha1加密
		var sha = sha1(str)

		//3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
		console.log(this.origin)
		if(this.method === 'GET') {
			if(sha === signature) {
				this.body = echostr + ''
			} else {
				this.body = 'wrong'
			}
		} else if(this.method === 'POST') {
			if(sha !== signature) {
				return false
			}
			var data = yield getRawBody(this.req, {
				length: this.length,
				limit: '1mb',
				encoding: this.charset
			})

			var content = yield util.parseXMLAsync(data)
			var message = util.formatMessage(content.xml)
			//console.log(message)
			//如果是事件类型请求
			if(message.MsgType === 'event') {
				//如果是订阅事件
				if(message.Event === 'subscribe') {
					var now = new Date().getTime()
					that.status = 200
					that.type = 'text/xml'
					var replay = '<xml>' +
						'<ToUserName>< ![CDATA[' + message.FromUserName + '] ]></ToUserName>' +
						'<FromUserName>< ![CDATA[' + message.ToUserName + '] ]></FromUserName>' +
						'<CreateTime>' + now + '</CreateTime>' +
						'<MsgType>< ![CDATA[text] ]></MsgType>' +
						'<Content>< ![CDATA[你好] ]></Content> </xml>'
						console.log(replay)
					that.body = replay
				} else if(message.Event === 'unsubscribe') {
					//如果是取消关注
				} else if(message.Event === 'LOCATION') {
					var now = new Date().getTime()
					that.status = 200
					that.type = 'text/xml'
					var replay = '<xml>' +
						'<ToUserName>< ![CDATA[' + message.FromUserName + '] ]></ToUserName>' +
						'<FromUserName>< ![CDATA[' + message.ToUserName + '] ]></FromUserName>' +
						'<CreateTime>' + now + '</CreateTime>' +
						'<MsgType>< ![CDATA[text] ]></MsgType>' +
						'<Content>< ![CDATA[你好] ]></Content> </xml>'
					that.body = replay
				}
			} else if(message.MsgType === 'text') {
				var now = new Date().getTime()
				that.status = 200
				that.type = 'application/xml'
				var replay = '<xml>' +
					'<ToUserName>< ![CDATA[' + message.FromUserName + '] ]></ToUserName>' +
					'<FromUserName>< ![CDATA[' + message.ToUserName + '] ]></FromUserName>' +
					'<CreateTime>' + now + '</CreateTime>' +
					'<MsgType>< ![CDATA[text] ]></MsgType>' +
					'<Content>< ![CDATA[你好] ]></Content> </xml>'
				that.body = replay
				console.log(that.body)
			}
		}

	}
}