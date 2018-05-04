const router = require('express').Router();
const weixin = require('../api/weixin');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
	dest: 'upload_tmp/',
	preservePath: true

});

const config = require('../config/config');
const aotuConfig = config.wx_config.aotu;
const menu = config.web_config.menu;
const keywords = require('../config/keywords');
const wxuser = require('../vo/wxuser')

weixin.token = aotuConfig.token;

router.get('/', function(req, res, next) {
	if (isEmptyObject(req.query)) {
		res.render('login.html')
	} else {
		if (weixin.checkSignature(req)) {
			return res.status(200).send(req.query.echostr);
		}
	}

	function isEmptyObject(obj) {
		for (var key in obj) {
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
		if (data.err) {
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
	//console.log(req.files[0]); // 上传的文件信息
	//console.log(req.body)
	//console.log(req.files[0].mimetype)
	//console.log(req.files[0].originalname)
	var type = req.files[0].mimetype.split('/')[0]

	var des_file = "./upload/" + req.files[0].originalname;
	fs.readFile(req.files[0].path, function(err, data) {
		fs.writeFile(des_file, data, function(err) {
			if (err) {
				console.log(err);
			} else {
				response = {
					message: 'File uploaded successfully',
					filename: req.files[0].originalname
				};

				var options = {
					filePath: des_file,
					fileName: req.files[0].originalname,
					type: type,
					duration: req.body.type
				}
				weixin.uploadMaterial(options, function(data) {
					console.log(data);
				})
				//如果成功，则调用微信上传素材的方法
				res.redirect(301, '/image');
			}
		})
	})
});


router.get('/wx-menu-list', (req, res, next) => {
	res.render('menu-list.html', {
		menu: menu,
	})
})

router.get('/deleteMenu', (req, res, next) => {
	console.log('后台接收的删除菜单指令');
	weixin.deleteMenu().then((data) => {
		res.status(200).send({
			sussce: false,
			data: data.msg
		})
	}, (err) => {
		res.status(200).send({
			sussce: false,
			errMsg: '删除失败！'
		})
	})
})

router.get('/query-menu-list', (req, res, next) => {
	console.log('后台接收的查询菜单指令');
	weixin.queryMenu().then((data)=>{
		res.status(200).send({
			sussce:true,
			msg:data
		})
	},(err)=>{
		res.status(200).send({
			sussce:false,
			msg:'查询失败'
		})
	})
})

router.get('/publish-menu', (req, res, next) => {
	console.log('后台接收的发布菜单指令');
	//查询菜单
	weixin.queryMenu().then((data) => {
		//成功
		console.log('菜单:');
		console.log(data);
	}, (data) => {
		//失败
		console.log('失败了:');
		console.log(data);
	})

	let options = {
		"button": [{
			"type": "click",
			"name": "发送位置",
			"key": "0"
		}]
	}
	weixin.createMenu(options).then((data) => {
		res.status(200).send({
			sussce: false,
			data: data
		})
	}, (err) => {
		res.status(200).send({
			sussce: false,
			errMsg: '发布失败！'
		})
	})
})



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

	if (!!keywords.exactKey[msgContent]) {
		resMsg.content = keywords.exactKey[msgContent].content;
		flag = true;
	} else if (isKeyInStr(msgContent, '666')) {
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
		return ("" + str).replace(/^\s+/gi, '').replace(/\s+$/gi, '').toUpperCase();
	}

	function isKeyInStr(str, key) {
		str = trim(str);
		key = trim(key);
		if (str.indexOf(key) !== -1) {
			return true;
		}
		return false;
	}

	if (flag) {
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
	if (eventType === 'subscribe') {
		resMsg.content = 'TOM在此欢迎您！有任何疑问请回复 help 或 bz';
		flag = true;
	} else if (eventType === 'unsubscribe') {
		resMsg.content = 'TOM很伤心，为啥要取消呢?';
		flag = true;
	} else if (msg.event == 'CLICK') {
		if (msg.eventKey == 'getlocationweather') {
			tianqi('', function(data) {
				resMsg.content = data;
				weixin.sendMsg(resMsg);
			});
		} else if (msg.eventKey == 'scancode_push') {

		} else if (msg.eventKey == 'my_info') {
			//TODO:发送的信息
			weixin.getUser({
				openId: msg.fromUserName
			}, function(data) {
				if (data.err) {
					resMsg.content = '获取ERROR：' + data.msg;
				} else {
					resMsg.content = JSON.stringify(data.msg);
				}
				weixin.sendMsg(resMsg);
			});
		}
	} else if (eventType == 'scancode_waitmsg') {
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

	if (flag) {
		weixin.sendMsg(resMsg);
	}

})

weixin.imageMsg(function(msg) {})

weixin.locationMsg(function(msg) {})

module.exports = router;