const sha1 = require('sha1')
const xml2js = require('xml2js') //xml转json库
const events = require('events')
const emitter = new events.EventEmitter()
const util = require('../util/util') //获取token工具库
const request = require('request') //http请求库
const fs = require('node-fs'); //文件操作库
const formstream = require('formstream'); //http发送post请求构造表单数据的库

var config = require('../config/config');
var aotuConfig = config.wx_config.aotu;

var WeiXin = function() {
	this.data = '';
	this.msgType = 'text';
	this.fromUserName = '';
	this.toUserName = '';
	this.funcFlag = 0;
}

WeiXin.prototype.checkSignature = function(req) {
	this.signature = req.query.signature
	this.timestamp = req.query.timestamp
	this.nonce = req.query.nonce
	this.echostr = req.query.echostr

	var str = [this.token, this.timestamp, this.nonce].sort().join('')
	var sha = sha1(str)

	return (sha == this.signature)

}

//处理请求数据，将xml格式数据转换为json
WeiXin.prototype.loop = function(req, res) {
	this.res = res;
	var that = this;
	var buf = '';
	req.setEncoding('utf-8');
	req.on('data', function(chunk) {
		buf += chunk;
	});
	req.on('end', function() {
		xml2js.parseString(buf, function(err, json) {
			if (err) {
				err.status = 400;
			} else {
				req.body = json;
			}
		});
		that.data = req.body.xml;

		//测试发送文本信息
		/*if(that.data.MsgType[0] === 'text') {
			var msg = {
				"toUserName": that.data.FromUserName[0],
				"fromUserName": that.data.ToUserName[0],
				"createTime": that.data.CreateTime[0],
				"msgType": that.data.MsgType[0],
				"content": 'helloworld',
				"msgId": that.data.MsgId[0],
			};

			var time = Math.round(new Date().getTime() / 1000);
			var funcFlag = 0;
			var output = "" +
				"<xml>" +
				"<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
				"<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
				"<CreateTime>" + time + "</CreateTime>" +
				"<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
				"<Content><![CDATA[" + msg.content + "]]></Content>" +
				"<FuncFlag>" + funcFlag + "</FuncFlag>" +
				"</xml>";
			that.res.type('xml');
			that.res.send(output);
		}*/

		that.parse();
	});
}

WeiXin.prototype.textMsg = function(callback) {
	emitter.on('weixinTextMsg', callback);
	return this;
}

WeiXin.prototype.eventMsg = function(callback) {
	emitter.on('weixinEventMsg', callback);
	return this;
}

WeiXin.prototype.imageMsg = function(callback) {
	emitter.on('weixinImageMsg', callback);
	return this;
}

WeiXin.prototype.locationMsg = function(callback) {
	emitter.on('weixinLocationMsg', callback);
	return this;
}

WeiXin.prototype.parse = function() {
	this.msgType = this.data.MsgType[0] ? this.data.MsgType[0] : 'text';
	switch (this.msgType) {
		case 'text':
			this.parseTextMsg();
			break;
		case 'event':
			this.parseEventMsg();
			break;
		case 'image':
			this.parseImageMsg();
			break;
		case 'location':
			this.parseLocationMsg();
			break;
	}
}

WeiXin.prototype.sendMsg = function(msg) {
	switch (msg.msgType) {
		case 'text':
			this.sendTextMsg(msg);
			break;
		case 'news':
			this.sendNewsMsg(msg);
			break;
		case 'image':
			this.sendImageMsg(msg);
			break;
			/*case 'location':
				this.sendLocationMsg(msg);
				break;*/
	}
}

WeiXin.prototype.parseImageMsg = function() {
	var msg = {
		"toUserName": this.data.ToUserName[0],
		"fromUserName": this.data.FromUserName[0],
		"createTime": this.data.CreateTime[0],
		"msgType": this.data.MsgType[0],
		"picUrl": this.data.PicUrl[0],
		"msgId": this.data.MsgId[0],
		"mediaId": this.data.MediaId[0]
	};
	emitter.emit('weixinImageMsg', msg);
	return this;
}

WeiXin.prototype.parseTextMsg = function() {
	var msg = {
		"toUserName": this.data.ToUserName[0],
		"fromUserName": this.data.FromUserName[0],
		"createTime": this.data.CreateTime[0],
		"msgType": this.data.MsgType[0],
		"content": this.data.Content[0],
		"msgId": this.data.MsgId[0],
	};
	emitter.emit('weixinTextMsg', msg);
	return this;
}

WeiXin.prototype.parseEventMsg = function() {
	var eventKey = '';
	if (this.data.EventKey) {
		eventKey = this.data.EventKey[0];
	}
	var msg = {
		"toUserName": this.data.ToUserName[0],
		"fromUserName": this.data.FromUserName[0],
		"createTime": this.data.CreateTime[0],
		"msgType": this.data.MsgType[0],
		"event": this.data.Event[0],
		"eventKey": eventKey
	}

	if (this.data.ScanCodeInfo) {
		msg.scanCodeInfo = this.data.ScanCodeInfo[0];
	}

	if (this.data.Latitude) {
		msg.Latitude = this.data.Latitude[0];
	}

	if (this.data.Longitude) {
		msg.Longitude = this.data.Longitude[0];
	}

	emitter.emit("weixinEventMsg", msg);
	return this;
}

WeiXin.prototype.parseLocationMsg = function() {
	var msg = {
		"toUserName": this.data.ToUserName[0],
		"fromUserName": this.data.FromUserName[0],
		"createTime": this.data.CreateTime[0],
		"msgType": this.data.MsgType[0],
		"locationX": this.data.Location_X[0],
		"locationY": this.data.Location_Y[0],
		"scale": this.data.Scale[0],
		"label": this.data.Label[0],
		"msgId": this.data.MsgId[0]
	};
	emitter.emit('weixinLocationMsg', msg);
	return this;
}

WeiXin.prototype.sendTextMsg = function(msg) {
	if (msg.content == '') {
		this.res.type('string');
		this.res.send('');
		return this;
	}

	var time = Math.round(new Date().getTime() / 1000);
	var funcFlag = msg.funcFlag ? msg.funcFlag : this.funcFlag;
	var output = "" +
		"<xml>" +
		"<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
		"<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
		"<CreateTime>" + time + "</CreateTime>" +
		"<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
		"<Content><![CDATA[" + msg.content + "]]></Content>" +
		"<FuncFlag>" + funcFlag + "</FuncFlag>" +
		"</xml>";
	this.res.type('xml');
	this.res.send(output);

	return this;
}

//TODO:
WeiXin.prototype.sendLocationMsg = function(msg) {
	return this;
}

WeiXin.prototype.sendImageMsg = function(msg) {
	var time = Math.round(new Date().getTime() / 1000);
	var output = "" +
		"<xml>" +
		"<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
		"<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
		"<CreateTime>" + time + "</CreateTime>" +
		"<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
		"<Image>" +
		"<MediaId><![CDATA[" + msg.mediaId + "]]></MediaId>" +
		"</Image>" +
		"</xml>";
	this.res.type('xml');
	this.res.send(output);
	return this;
}

//获取用户信息
WeiXin.prototype.getUser = function(options, callback) {
	var self = this;
	util.getToken(aotuConfig, function(result) {
		if (result.err) {
			return callback({
				err: 1,
				msg: result.err
			});
		}
		var access_token = result.data.access_token;
		var url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + options.openId + '&lang=';
		if (options.lang) {
			url += options.lang;
		} else {
			url += 'zh_CN';
		}
		request.get({
			url: url
		}, function(error, httpResponse, body) {
			if (error) return callback({
				err: 1,
				msg: error
			});
			return callback({
				err: 0,
				msg: JSON.parse(body)
			});
		});
	});
}

//获取用户信息
WeiXin.prototype.getUserList = function(options, callback) {
	var that = this;
	util.getToken(aotuConfig, function(result) {
		if (result.err) {
			return callback({
				err: 1,
				msg: result.err
			});
		}
		var access_token = result.data.access_token;
		var url = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + access_token
		if (options) {
			url += '&next_openid=' + options.openId
		}
		request.get({
			url: url
		}, function(error, httpResponse, body) {
			if (error) return callback({
				err: 1,
				msg: error
			});
			return callback({
				err: 0,
				msg: JSON.parse(body)
			});
		});
	});
}

//用户上传临时素材
WeiXin.prototype.uploadMaterial = function(options, callback) {
	var that = this;
	util.getToken(aotuConfig, function(result) {
		if (result.err) {
			return callback({
				err: 1,
				msg: result.err
			});
		}
		let access_token = result.data.access_token;
		let filePath = options.filePath
		let fileName = options.fileName
		let uploadType = ''
		if (options.type == 'image') {
			uploadType = 'image'
		} else if (options.type == 'audio') {
			uploadType = 'voice'
		} else if (options.type == 'video') {
			uploadType = 'video'
		} else if (options.type == 'thumb') {
			uploadType = 'thumb'
		}

		if (options.duration == 0) {
			//上传临时素材
			fs.stat(filePath, function(err, stat) {
				//uploadType就是媒体文件的类型，image,voice,video,thumb等
				var url = 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token=' + access_token + '&type=' + uploadType;
				var form = formstream();
				//将文档中媒体文件需要的filename，filelength参数加到要上传的表单，content-type不知道为啥没有，可能自带吧
				form.file('media', filePath, fileName, stat.size);
				var upload = request.post(url, {
					headers: form.headers()
				}, function(err, httpResponse, body) {
					if (err) {
						return console.error('上传失败:', err);
					}
					console.log('上传成功！服务器相应结果:', body);
				});
				//不懂这个是干嘛的
				form.pipe(upload);
			});

		} else {

		}
	});
}

module.exports = new WeiXin();