/*
Navicat MySQL Data Transfer

Source Server         : 本地数据库
Source Server Version : 50716
Source Host           : localhost:3306
Source Database       : test2

Target Server Type    : MYSQL
Target Server Version : 50716
File Encoding         : 65001

Date: 2018-05-04 17:32:38
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tb_user
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
