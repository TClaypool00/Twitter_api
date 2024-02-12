-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 12, 2024 at 03:57 AM
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `comment_exists` (IN `comment_id` INT, IN `user_id` INT)   BEGIN
	IF user_id IS NULL THEN
    	SELECT EXISTS(SELECT * FROM comments c WHERE c.comment_id = comment_id) AS comment_exists;
    ELSE
    	SELECT EXISTS(SELECT * FROM comments c WHERE c.comment_id = comment_id AND c.user_id = user_id) AS comment_exists;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_comment` (IN `c_id` INT)   BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    	ROLLBACK;
    END;
    
    START TRANSACTION;
    DELETE FROM likes
    WHERE comment_id = c_id;
    
    DELETE FROM comments
    WHERE comment_id = c_id;
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_like` (IN `l_id` INT)   BEGIN
	DELETE FROM likes
    WHERE like_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_tweet` (IN `id` INT)   BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    	ROLLBACK;
    END;

	START TRANSACTION;
    DELETE FROM likes
    WHERE tweet_id = id;
    
    DELETE FROM tweets
    WHERE tweet_id = id;
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `email_existts` (IN `email` VARCHAR(255), IN `user_id` INT)   BEGIN
IF user_id IS NULL THEN
	SELECT EXISTS(SELECT * FROM users u WHERE u.email = email) AS email_exists;
ELSE
	SELECT EXISTS(SELECT * FROM users u WHERE u.email = email AND u.user_id = user_id) AS email_exists;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_comment_by_id` (IN `c_id` INT, IN `u_id` INT)   BEGIN
	SELECT c.*, EXISTS(SELECT * FROM likes l WHERE l.user_id = u_id AND l.comment_id = c_id) AS liked FROM vw_comments c WHERE c.comment_id = c_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_single_user_by_email` (IN `email` VARCHAR(255))   SELECT * FROM users u
WHERE LOWER(u.email) = LOWER(email)
LIMIT 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_tweet_by_id` (IN `tweet_id` INT, IN `user_id` INT)   BEGIN
	SELECT t.*, EXISTS(SELECT * FROM likes l WHERE l.tweet_id = tweet_id AND l.user_id = user_id) AS liked FROM vw_tweets t WHERE t.tweet_id = tweet_id
    LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_comment` (IN `comment_text` VARCHAR(255), IN `user_id` INT, IN `tweet_id` INT)   BEGIN
	INSERT INTO comments (comment_text, user_id, tweet_id)
    VALUES(comment_text, user_id, tweet_id);
    
    SELECT c.comment_id, c.create_date FROM comments c WHERE c.comment_id = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_tweet` (IN `tweet_text` VARCHAR(255), IN `user_id` INT)   BEGIN
	DECLARE tweet_id INT;

	INSERT INTO tweets (tweet_text, user_id)
	VALUES(tweet_text, user_id);
    
    SET tweet_id = LAST_INSERT_ID();
    
    SELECT t.tweet_id, t.create_date FROM tweets t WHERE t.tweet_id = tweet_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_tweet_like` (IN `user_Id` INT, IN `tweet_id` INT)   BEGIN
	INSERT INTO likes (user_id, tweet_id)
    VALUES (user_id, tweet_id);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_user` (IN `username` VARCHAR(255), IN `first_name` VARCHAR(255), IN `last_name` VARCHAR(255), IN `email` VARCHAR(255), IN `password` VARCHAR(255), IN `phone_number` VARCHAR(255))   INSERT INTO users
(username, first_name, last_name, email, password, phone_number)
VALUES (username, first_name, last_name, email, password, phone_number)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `like_exists` (IN `l_id` INT, IN `u_id` INT)   BEGIN
	IF u_id IS NULL THEN
    	SELECT EXISTS(SELECT * FROM likes l WHERE l.like_id = l_id) AS like_exists;
    ELSE
    	SELECT EXISTS(SELECT * FROM likes l WHERE l.like_id = l_id AND l.user_id = u_id) AS like_exists;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `phone_number_exists` (IN `phone_number` VARCHAR(10), IN `user_id` INT)   BEGIN
IF user_id IS NULL THEN
	SELECT EXISTS(SELECT * FROM users u WHERE u.phone_number = phone_number) AS phone_number_exists;
ELSE
	SELECT EXISTS(SELECT * FROM users u WHERE u.phone_number = phone_number AND u.user_id = user_id) AS phone_number_exists;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tweet_exists` (IN `tweet_id` INT, IN `user_id` INT)   BEGIN
	IF user_id IS NULL THEN
    	SELECT EXISTS(SELECT * FROM tweets t WHERE t.tweet_id = tweet_id) AS tweet_exists;
    ELSE
    	SELECT EXISTS(SELECT * FROM tweets t WHERE t.tweet_id = tweet_id AND t.user_id = user_id) AS tweet_exists;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tweet_like_exists` (IN `user_id` INT, IN `tweet_id` INT)   BEGIN
	SELECT EXISTS(SELECT * FROM likes l WHERE l.user_id = user_id AND l.tweet_id = tweet_id) AS like_exists;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_comment` (IN `c_id` INT, IN `c_text` VARCHAR(255))   BEGIN
	UPDATE comments
    SET comment_text = c_text, update_date = CURRENT_TIMESTAMP()
    WHERE comment_id = c_id;
    
    SELECT c.update_date FROM comments c WHERE c.comment_id = c_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_tweet` (IN `tweet_id` INT, IN `tweet_text` VARCHAR(255))   BEGIN
	UPDATE tweets
    SET tweet_text = tweet_text, update_date = CURRENT_DATE()
    WHERE tweet_id = tweet_id;
    
    SELECT t.update_date FROM tweets t
    WHERE t.tweet_id = tweet_id;
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
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_text` varchar(255) NOT NULL,
  `create_date` date NOT NULL DEFAULT curdate(),
  `update_date` date DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `tweet_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `tweet_id` (`tweet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE IF NOT EXISTS `likes` (
  `like_id` int(11) NOT NULL AUTO_INCREMENT,
  `create_date` date NOT NULL DEFAULT curdate(),
  `user_id` int(11) NOT NULL,
  `tweet_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`like_id`),
  KEY `user_id` (`user_id`),
  KEY `tweet_id` (`tweet_id`),
  KEY `comment_id` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `update_date` date DEFAULT NULL,
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

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_comments`
-- (See below for the actual view)
--
CREATE TABLE IF NOT EXISTS `vw_comments` (
`comment_id` int(11)
,`comment_text` varchar(255)
,`create_date` date
,`update_date` date
,`user_id` int(11)
,`tweet_id` int(11)
,`first_name` varchar(255)
,`last_name` varchar(255)
,`like_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_tweets`
-- (See below for the actual view)
--
CREATE TABLE IF NOT EXISTS `vw_tweets` (
`tweet_id` int(11)
,`tweet_text` varchar(255)
,`create_date` date
,`update_date` date
,`user_id` int(11)
,`first_name` varchar(255)
,`last_name` varchar(255)
,`like_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Structure for view `vw_comments`
--
DROP TABLE IF EXISTS `vw_comments`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_comments`  AS SELECT `c`.`comment_id` AS `comment_id`, `c`.`comment_text` AS `comment_text`, `c`.`create_date` AS `create_date`, `c`.`update_date` AS `update_date`, `c`.`user_id` AS `user_id`, `c`.`tweet_id` AS `tweet_id`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, count(`l`.`like_id`) AS `like_count` FROM ((`comments` `c` left join `likes` `l` on(`c`.`comment_id` = `l`.`comment_id`)) join `users` `u` on(`u`.`user_id` = `c`.`user_id`)) GROUP BY 11  ;

-- --------------------------------------------------------

--
-- Structure for view `vw_tweets`
--
DROP TABLE IF EXISTS `vw_tweets`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_tweets`  AS SELECT `t`.`tweet_id` AS `tweet_id`, `t`.`tweet_text` AS `tweet_text`, `t`.`create_date` AS `create_date`, `t`.`update_date` AS `update_date`, `t`.`user_id` AS `user_id`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, count(`l`.`like_id`) AS `like_count` FROM ((`tweets` `t` left join `likes` `l` on(`t`.`tweet_id` = `l`.`tweet_id`)) join `users` `u` on(`u`.`user_id` = `t`.`user_id`)) GROUP BY 11  ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`tweet_id`) REFERENCES `tweets` (`tweet_id`);

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`tweet_id`) REFERENCES `tweets` (`tweet_id`),
  ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`);

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
