/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50716
Source Host           : localhost:3306
Source Database       : test2

Target Server Type    : MYSQL
Target Server Version : 50716
File Encoding         : 65001

Date: 2018-05-05 15:16:47
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `tb_menu`
-- ----------------------------
DROP TABLE IF EXISTS `tb_menu`;
CREATE TABLE `tb_menu` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '菜单名称',
  `type` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '菜单类型',
  `key` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `sub_button` int(10) DEFAULT NULL COMMENT '是否是子菜单',
  `url` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `appid` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `pagepath` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `media_id` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of tb_menu
-- ----------------------------

-- ----------------------------
-- Table structure for `tb_user`
-- ----------------------------
DROP TABLE IF EXISTS `tb_user`;
CREATE TABLE `tb_user` (
  `id` varchar(36) NOT NULL,
  `create_name` varchar(50) DEFAULT NULL COMMENT '创建人名称',
  `create_date` datetime DEFAULT NULL COMMENT '创建日期',
  `update_name` varchar(50) DEFAULT NULL COMMENT '修改人名称',
  `update_date` datetime DEFAULT NULL COMMENT '修改日期',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `openid` varchar(50) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL COMMENT '电话',
  `password` varchar(32) DEFAULT NULL COMMENT '密码',
  `realname` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_user
-- ----------------------------
