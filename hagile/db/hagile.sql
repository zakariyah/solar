/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50140
Source Host           : localhost:3306
Source Database       : experiment

Target Server Type    : MYSQL
Target Server Version : 50140
File Encoding         : 65001

Date: 2011-12-06 17:59:37
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `browsing`
-- ----------------------------
DROP TABLE IF EXISTS `browsing`;
CREATE TABLE `browsing` (
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) NOT NULL,
  `id_hit` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of browsing
-- ----------------------------

-- ----------------------------
-- Table structure for `feedback`
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_game` varchar(40) NOT NULL,
  `id_player` varchar(40) NOT NULL,
  `question` varchar(40) NOT NULL,
  `answer` text,
  UNIQUE KEY `id_game` (`id_game`,`id_player`,`question`),
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`id_player`) REFERENCES `players` (`id_player`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `games` (`id_game`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of feedback
-- ----------------------------

-- ----------------------------
-- Table structure for `actions`
-- ----------------------------
DROP TABLE IF EXISTS `actions`;
CREATE TABLE `actions` (
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_game` varchar(40) NOT NULL,
  `round` tinyint(3) unsigned NOT NULL,
  `id_player` varchar(40) NOT NULL,
  `action` tinyint(1) unsigned NOT NULL,
  UNIQUE KEY `id_game` (`id_game`,`round`,`id_player`),
  KEY `id_player` (`id_player`),
  CONSTRAINT `contributions_ibfk_2` FOREIGN KEY (`id_player`) REFERENCES `players` (`id_player`),
  CONSTRAINT `contributions_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `games` (`id_game`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of contributions
-- ----------------------------

-- ----------------------------
-- Table structure for `dropout`
-- ----------------------------
DROP TABLE IF EXISTS `dropout`;
CREATE TABLE `dropout` (
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_player` varchar(40) NOT NULL,
  `id_assignment` varchar(40) NOT NULL,
  UNIQUE KEY `id_player` (`id_player`,`id_assignment`) USING BTREE,
  CONSTRAINT `dropout_ibfk_1` FOREIGN KEY (`id_player`, `id_assignment`) REFERENCES `players` (`id_player`, `id_assignment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dropout
-- ----------------------------

-- ----------------------------
-- Table structure for `gameplay`
-- ----------------------------
DROP TABLE IF EXISTS `gameplay`;
CREATE TABLE `gameplay` (
  `id_game` varchar(40) NOT NULL,
  `round` tinyint(3) unsigned NOT NULL,
  `id_phase` varchar(40) NOT NULL,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NOT NULL,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  UNIQUE KEY `id_game` (`id_game`,`round`,`id_phase`),
  CONSTRAINT `gameplay_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `games` (`id_game`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gameplay
-- ----------------------------

-- ----------------------------
-- Table structure for `games`
-- ----------------------------
DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id_game` varchar(40) NOT NULL,
  `id_run` varchar(40),
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `num_rounds` tinyint(3) unsigned NOT NULL,
  `num_players` tinyint(3) unsigned NOT NULL,
  `cc_payoff` double(7,3) NOT NULL,
  `dd_payoff` double(7,3) NOT NULL,
  `cd_payoff` double(7,3) NOT NULL,
  `dc_payoff` double(7,3) NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `analysis` tinyint(1) unsigned,
  PRIMARY KEY (`id_game`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of games
-- ----------------------------

-- ----------------------------
-- Table structure for `payments`
-- ----------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id_player` varchar(40) NOT NULL,
  `id_game` varchar(40) NOT NULL,
  `round` tinyint(3) unsigned NOT NULL,
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `earning` double(7,3),
  `payout` double(9,5),
  UNIQUE KEY `id_player` (`id_player`,`id_game`,`round`),
  KEY `id_game` (`id_game`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`id_game`) REFERENCES `games` (`id_game`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`id_player`) REFERENCES `players` (`id_player`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of payments
-- ----------------------------

-- ----------------------------
-- Table structure for `players`
-- ----------------------------
DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `id_player` varchar(40) NOT NULL,
  `id_assignment` varchar(40) NOT NULL,
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `player_type` varchar(30) NOT NULL DEFAULT 'HUMAN',
  `id_hit` varchar(40) NOT NULL,
  `ip_address` varchar(45),
  `country_code` char(2),
  `last_ping` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `active` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `processed` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `rostered` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `contactable` tinyint(1) unsigned,
  UNIQUE KEY `player_assignment` (`id_player`,`id_assignment`),
  KEY `id_player` (`id_player`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of players
-- ----------------------------

-- ----------------------------
-- Table structure for `roster`
-- ----------------------------
DROP TABLE IF EXISTS `roster`;
CREATE TABLE `roster` (
  `id_player` varchar(40) NOT NULL,
  `id_game` varchar(40) NOT NULL,
  `id_assignment` varchar(40) NOT NULL,
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `callsign` varchar(40) NOT NULL,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  UNIQUE KEY `id_player` (`id_player`,`id_game`,`id_assignment`),
  KEY `id_game` (`id_game`),
  CONSTRAINT `roster_ibfk_2` FOREIGN KEY (`id_player`) REFERENCES `players` (`id_player`),
  CONSTRAINT `roster_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `games` (`id_game`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of roster
-- ----------------------------
