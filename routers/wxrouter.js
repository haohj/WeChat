var router = require('express').Router();
var weixin = require('../api/weixin');
var fs = require('fs');
//var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart();
var multer = require('multer');
var upload = multer({
	dest: 'upload_tmp/',
	preservePath:true
	
});

var config = require('../config/config');
var aotuConfig = config.wx_config.aotu;
var menu = config.web_config.menu;
var keywords = require('../config/keywords');
var wxuser = require('../vo/wxuser')

router.get('/', function(req, res, next) {
	if(isEmptyObject(req.query)) {
		res.render('login.html')
	} else {
		if(weixin.checkSignature(req)) {
			return res.status(200).send(req.query.echostr);
		}
	}

	function isEmptyObject(obj) {
		for(var key in obj) {
			return false
		};
		return true
	};
});

router.get('/index.html', function(req, res, next) {
	res.render('home.html', {
		menu: menu,
	})
})

router.get('/content.html', function(req, res, next) {
	res.render('index.html', {
		menu: menu,
		type: 'content'
	})
})

router.get('/getUserList', function(req, res, next) {
	weixin.getUserList(function(data) {
		console.log(data)
		var content = ''
		if(data.err) {
			content = '获取ERROR：' + data.msg;
		} else {
			content = JSON.stringify(data.msg);
		}
	});
})

router.get('/image', function(req, res, next) {
	res.render('image-list.html', {
		menu: menu,
	})
})

router.get('/image-add', function(req, res, next) {
	res.render('image-add.html', {
		menu: menu,
	})
})

router.get('/userlist', function(req, res, next) {
	wxuser.findAll().then(function(data) {
			res.render('wx-user-list.html', {
				menu: menu,
				data: data
			})
		},
		function(err) {
			return res.sendStatus(500).send('数据查询失败！')
		})
})

router.get('/editUserRemarkName', function(req, res, next) {
	res.render('index.html', {
		menu: menu
	})
})

router.get('/usergroup', function(req, res, next) {
	res.render('index.html', {
		menu: menu
	})
})

router.post('/', function(req, res, next) {
	weixin.loop(req, res);
});

router.post('/image-add', upload.any(), function(req, res, next) {
	console.log(req.files[0]); // 上传的文件信息
	var des_file = "./upload/" + req.files[0].originalname;
	fs.readFile(req.files[0].path, function(err, data) {
		fs.writeFile(des_file, data, function(err) {
			if(err) {
				console.log(err);
			} else {
				response = {
					message: 'File uploaded successfully',
					filename: req.files[0].originalname
				};
				console.log(response);
				res.end(JSON.stringify(response));
			}
		})
	}) 
});

weixin.token = aotuConfig.token;

weixin.textMsg(function(msg) {
	var msgContent = trim(msg.content);
	var flag = false;
	var resMsg = {
		fromUserName: msg.toUserName,
		toUserName: msg.fromUserName,
		msgType: 'text',
		content: 'Hankin在不断的成长，欢迎您给出宝贵的意见，有任何疑问请回复 help 或 bz',
		funcFlag: 0
	};

	if(!!keywords.exactKey[msgContent]) {
		resMsg.content = keywords.exactKey[msgContent].content;
		flag = true;
	} else if(isKeyInStr(msgContent, '666')) {
		console.log(msg)

		resMsg = {
			fromUserName: msg.toUserName,
			toUserName: msg.fromUserName,
			msgType: 'image',
			mediaId: msg.mediaId,
			funcFlag: 0
		};
		flag = true
	} else {
		flag = true;
	}

	// 去掉前后空格并且转换成大写
	function trim(str) {
		return("" + str).replace(/^\s+/gi, '').replace(/\s+$/gi, '').toUpperCase();
	}

	function isKeyInStr(str, key) {
		str = trim(str);
		key = trim(key);
		if(str.indexOf(key) !== -1) {
			return true;
		}
		return false;
	}

	if(flag) {
		weixin.sendMsg(resMsg);
	}

});

weixin.eventMsg(function(msg) {
	var flag = false;
	var resMsg = {
		fromUserName: msg.toUserName,
		toUserName: msg.fromUserName,
		msgType: 'text',
		content: 'Hankin在不断的成长，欢迎您给出宝贵的意见，有任何疑问请回复 help 或 bz',
		funcFlag: 0
	};

	var eventType = msg.event
	if(eventType === 'subscribe') {
		resMsg.content = 'TOM在此欢迎您！有任何疑问请回复 help 或 bz';
		flag = true;
	} else if(eventType === 'unsubscribe') {
		resMsg.content = 'TOM很伤心，为啥要取消呢?';
		flag = true;
	} else if(msg.event == 'CLICK') {
		if(msg.eventKey == 'getlocationweather') {
			tianqi('', function(data) {
				resMsg.content = data;
				weixin.sendMsg(resMsg);
			});
		} else if(msg.eventKey == 'scancode_push') {

		} else if(msg.eventKey == 'my_info') {
			//TODO:发送的信息
			weixin.getUser({
				openId: msg.fromUserName
			}, function(data) {
				if(data.err) {
					resMsg.content = '获取ERROR：' + data.msg;
				} else {
					resMsg.content = JSON.stringify(data.msg);
				}
				weixin.sendMsg(resMsg);
			});
		}
	} else if(eventType == 'scancode_waitmsg') {
		resMsg.content = '当前操作:' + msg.scanCodeInfo.ScanType[0] + ',扫描结果:' + msg.scanCodeInfo.ScanResult[0];
		flag = true;
		//console.log('扫描事件',msg.scanCodeInfo);
	}
	/*else if(eventType === 'LOCATION') {
		resMsg.content = '上传地理位置纬度：' + msg.Latitude + ',经度：' + msg.Longitude
		flag = true
	}*/
	else {
		flag = true
	}

	if(flag) {
		weixin.sendMsg(resMsg);
	}

})

weixin.imageMsg(function(msg) {})

weixin.locationMsg(function(msg) {})

module.exports = router;