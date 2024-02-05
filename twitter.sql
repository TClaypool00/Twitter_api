-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2024 at 05:40 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `twitter`
--
CREATE DATABASE IF NOT EXISTS `twitter` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `twitter`;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `email_existts` (IN `email` VARCHAR(255), IN `user_id` INT)   BEGIN
IF user_id IS NULL THEN
	SELECT EXISTS(SELECT * FROM users u WHERE u.email = email) AS email_exists;
ELSE
	SELECT EXISTS(SELECT * FROM users u WHERE u.email = email AND u.user_id = user_id) AS email_exists;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_single_user_by_email` (IN `email` VARCHAR(255))   SELECT * FROM users u
WHERE LOWER(u.email) = LOWER(email)
LIMIT 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_tweet` (IN `tweet_text` VARCHAR(255), IN `user_id` INT)   BEGIN
	DECLARE tweet_id INT;

	INSERT INTO tweets (tweet_text, user_id)
	VALUES(tweet_text, user_id);
    
    SET tweet_id = LAST_INSERT_ID();
    
    SELECT t.tweet_id, t.create_date FROM tweets t WHERE t.tweet_id = tweet_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_user` (IN `username` VARCHAR(255), IN `first_name` VARCHAR(255), IN `last_name` VARCHAR(255), IN `email` VARCHAR(255), IN `password` VARCHAR(255), IN `phone_number` VARCHAR(255))   INSERT INTO users
(username, first_name, last_name, email, password, phone_number)
VALUES (username, first_name, last_name, email, password, phone_number)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `phone_number_exists` (IN `phone_number` VARCHAR(10), IN `user_id` INT)   BEGIN
IF user_id IS NULL THEN
	SELECT EXISTS(SELECT * FROM users u WHERE u.phone_number = phone_number) AS phone_number_exists;
ELSE
	SELECT EXISTS(SELECT * FROM users u WHERE u.phone_number = phone_number AND u.user_id = user_id) AS phone_number_exists;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `username_exists` (IN `username` VARCHAR(255), IN `user_id` INT)   BEGIN
IF user_id IS NULL THEN
	SELECT EXISTS(SELECT * FROM users u WHERE u.username = username) AS username_exists;
ELSE
	SELECT EXISTS(SELECT * FROM users u WHERE u.username = username AND u.user_id = user_id) AS username_exists;
END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `refresh_token_id` int(11) NOT NULL AUTO_INCREMENT,
  `toekn` varchar(255) NOT NULL,
  `expires_at` date NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`refresh_token_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tweets`
--

CREATE TABLE IF NOT EXISTS `tweets` (
  `tweet_id` int(11) NOT NULL AUTO_INCREMENT,
  `tweet_text` varchar(255) NOT NULL,
  `create_date` date NOT NULL DEFAULT curdate(),
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`tweet_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(10) NOT NULL,
  `date_created` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `tweets`
--
ALTER TABLE `tweets`
  ADD CONSTRAINT `tweets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
