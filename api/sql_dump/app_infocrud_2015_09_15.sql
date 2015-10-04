-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 15, 2015 at 11:32 AM
-- Server version: 5.0.51b-community-nt
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `app_infocrud`
--

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` mediumint(8) unsigned NOT NULL auto_increment,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrator'),
(2, 'members', 'General User');

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `ip_address` varchar(15) NOT NULL,
  `login` varchar(100) NOT NULL,
  `time` int(11) unsigned default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `rest_user_loggedin`
--

CREATE TABLE IF NOT EXISTS `rest_user_loggedin` (
  `id` bigint(20) NOT NULL auto_increment COMMENT 'Primary Id',
  `username` varchar(100) NOT NULL,
  `sess_key` text NOT NULL,
  `date_loggedin` datetime default '0000-00-00 00:00:00',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `rest_user_loggedin`
--

INSERT INTO `rest_user_loggedin` (`id`, `username`, `sess_key`, `date_loggedin`) VALUES
(3, 'admin2', 'f77a7b11f5a62686289e0c27a5ecfecd', '2015-09-14 12:41:30'),
(5, 'admin1', '7f514be665e2c8931a2c8a8cd15dbec4', '2015-09-15 10:08:57'),
(6, 'ravindra', '10fbac168cfdbd62c13fed71eef4fe83', '2015-09-14 13:45:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `ip_address` varchar(15) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) default NULL,
  `email` varchar(100) NOT NULL,
  `activation_code` varchar(40) default NULL,
  `forgotten_password_code` varchar(40) default NULL,
  `forgotten_password_time` int(11) unsigned default NULL,
  `remember_code` varchar(40) default NULL,
  `created_on` int(11) unsigned NOT NULL,
  `last_login` int(11) unsigned default NULL,
  `active` tinyint(1) unsigned default NULL,
  `first_name` varchar(50) default NULL,
  `last_name` varchar(50) default NULL,
  `company` varchar(100) default NULL,
  `phone` varchar(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `ip_address`, `username`, `password`, `salt`, `email`, `activation_code`, `forgotten_password_code`, `forgotten_password_time`, `remember_code`, `created_on`, `last_login`, `active`, `first_name`, `last_name`, `company`, `phone`) VALUES
(15, '192.168.40.50', 'admin', '$2y$08$tBu4si6VAP/Ahaqy.uDcBOzTQE3q8qS23SjLxypDpt4s4aMN5Y9NS', NULL, 'admin@admin.com', NULL, NULL, NULL, NULL, 1442225011, 1442225012, 1, 'admin', 'lastadmin', NULL, NULL),
(17, '192.168.40.50', 'admin2', '$2y$08$zuSqaTBWFN5CGAhd/aIY7.Ev2Y8EVF9Bx0uRQlpY/IDOT/nP0eFnm', NULL, 'some@asdkf.com', NULL, NULL, NULL, NULL, 1442227290, 1442227290, 1, 'New', 'Admin', NULL, NULL),
(18, '192.168.40.50', 'admin1', '$2y$08$H1rRc.BK861zjf5tBUWF5ulgJw.z9PEGkXn8dv0fDAZE91iJ6xoA6', NULL, 'some@asdkfa.com', NULL, NULL, NULL, NULL, 1442227387, 1442304537, 1, 'New', 'Admin2', NULL, NULL),
(19, '192.168.40.17', 'ravindra', '$2y$08$mvRBG0wfcIL8D91ft2QAfecqXklKCFHVtyBDyAOVwWaHOpe6PQYo6', NULL, 'dhakalravindra@yahio.com', NULL, NULL, NULL, NULL, 1442231090, 1442231154, 1, 'ravindra', 'dhakal', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_groups`
--

CREATE TABLE IF NOT EXISTS `users_groups` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `user_id` int(11) unsigned NOT NULL,
  `group_id` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `uc_users_groups` (`user_id`,`group_id`),
  KEY `fk_users_groups_users1_idx` (`user_id`),
  KEY `fk_users_groups_groups1_idx` (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `users_groups`
--

INSERT INTO `users_groups` (`id`, `user_id`, `group_id`) VALUES
(16, 15, 2),
(18, 17, 2),
(19, 18, 2),
(20, 19, 2);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD CONSTRAINT `fk_users_groups_groups1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_users_groups_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
