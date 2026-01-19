
-- ------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- LiverpoolRummy implementation :  © Bryan Chase <bryanchase@yahoo.com>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

-- This is the file where you are describing the database schema of your game
-- Basically, you just have to export from PhpMyAdmin your table structure and copy/paste
-- this export here.
-- Note that the database itself and the standard tables ("global", "stats", "gamelog" and "player") are
-- already created and must not be created here

-- Note: The database schema is created from this file when the game starts. If you modify this file,
--       you have to restart a game to see your changes in database.

ALTER TABLE `player` ADD `gone_down` tinyint(1) UNSIGNED NOT NULL DEFAULT '0';
ALTER TABLE `player` ADD `buying` tinyint(1) UNSIGNED NOT NULL DEFAULT '0';
ALTER TABLE `player` ADD `buy_count` tinyint(1) UNSIGNED NOT NULL DEFAULT '0';
-- I might need to add a DB field to track players who already took a penatly this turn:
--ALTER TABLE `player` ADD `tookLPPenalty` int(1) UNSIGNED NOT NULL DEFAULT '0';
--ALTER TABLE `player` ADD `meldAType` tinyint(1) UNSIGNED NOT NULL DEFAULT '0';
--ALTER TABLE `player` ADD `meldBType` tinyint(1) UNSIGNED NOT NULL DEFAULT '0';
--ALTER TABLE `player` ADD `meldCType` tinyint(1) UNSIGNED NOT NULL DEFAULT '0';

-- Example 1: create a standard "card" table to be used with the "Deck" tools (see example game "hearts"):

CREATE TABLE IF NOT EXISTS `wishList` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `player_id` int(10) unsigned NOT NULL,
  `card_type` varchar(16) NOT NULL,
  `card_type_arg` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `card` (
  `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `card_type` varchar(16) NOT NULL,
  `card_type_arg` int(11) NOT NULL,
  `card_location` varchar(16) NOT NULL,
  `card_location_arg` int(11) NOT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `prepAreas` (
  `player_id` int(10) unsigned NOT NULL,
  `areaA` varchar(100),
  `areaB` varchar(100),
  `areaC` varchar(100),
  `areaJ` varchar(100),
  PRIMARY KEY (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- Example 2: add a custom field to the standard "player" table
ALTER TABLE `player` ADD `player_my_custom_field` INT UNSIGNED NOT NULL DEFAULT '0';
