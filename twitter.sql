-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2024 at 01:03 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `comment_like_exists` (IN `c_id` INT, IN `u_id` INT)   BEGIN
	IF u_id IS NULL THEN
    	SELECT EXISTS(SELECT * FROM likes l WHERE l.comment_id = c_id) AS like_exists;
    ELSE
    	SELECT EXISTS(SELECT * FROM likes l WHERE l.comment_id = c_id AND l.user_id = u_id) AS like_exists;
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
   	DELETE FROM pictures
    WHERE tweet_id = id;
    
    DELETE FROM likes
    WHERE comment_id IN (SELECT comment_id FROM comments 
                        WHERE tweet_id = id);
    DELETE FROM comments
    WHERE tweet_id = id;
    
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
	SELECT EXISTS(SELECT * FROM users u WHERE u.email = email AND u.user_id != user_id) AS email_exists;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_users` (IN `search` VARCHAR(255), IN `p_index` INT, IN `p_limit` INT)   BEGIN
	IF search IS NULL THEN
    	SELECT u.user_id, u.username, u.first_name, u.last_name, u.profile_picture_path
        FROM vw_user_profiles u
        LIMIT p_index, p_limit;
    ELSE
    	SELECT u.user_id, u.username, u.first_name, u.last_name, u.profile_picture_path
        FROM vw_user_profiles u
        WHERE u.username LIKE CONCAT('%', search, '%') OR u.first_name LIKE CONCAT('%', search, '%') OR u.last_name LIKE CONCAT('%', search, '%')
        LIMIT p_index, p_limit;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_comment_by_id` (IN `c_id` INT, IN `u_id` INT)   BEGIN
	SELECT c.*, EXISTS(SELECT * FROM likes l WHERE l.user_id = u_id AND l.comment_id = c_id) AS liked FROM vw_comments c WHERE c.comment_id = c_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_comment_count_by_tweet_id` (IN `t_id` INT)   BEGIN
	SELECT t.comment_count FROM vw_tweets t
    WHERE t.tweet_id = t_id
    LIMIT 0, 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_single_user_by_email` (IN `email` VARCHAR(255))   BEGIN
	DECLARE user_id INT;
    
    SELECT u.user_id 
    INTO user_id
    FROM users u
	WHERE LOWER(u.email) = LOWER(email)
	LIMIT 0, 1;
    
	SELECT * FROM users u
	WHERE LOWER(u.email) = LOWER(email)
	LIMIT 0, 1;
    
    SELECT r.role_name FROM vw_user_roles r
    WHERE r.user_id = user_id;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_tweet_by_id` (IN `tweet_id` INT, IN `user_id` INT, IN `include_pictures` BOOLEAN, IN `include_comments` BOOLEAN, IN `p_limit` INT)   BEGIN
	SELECT t.*, EXISTS(SELECT l.like_id FROM likes WHERE l.user_id = user_id) AS liked FROM vw_tweets t
    LEFT JOIN likes l
    ON l.tweet_id = t.tweet_id
    WHERE t.tweet_id = tweet_id
    LIMIT 0, 1;
    
    
    IF include_pictures THEN
    	SELECT tp.picture_id, tp.picture_path, tp.caption_text, tp.cover_picture, tp.profile_picture, tp.create_date, tp.update_date, EXISTS(SELECT l.like_id FROM likes WHERE l.user_id = user_id) AS liked FROM vw_tweet_pictures tp
        LEFT JOIN likes l
    	ON l.picture_id = tp.picture_id
        WHERE tp.tweet_id = tweet_id
        LIMIT 0, p_limit;
    END IF;
    
    IF include_comments THEN
    	SELECT c.*, EXISTS(SELECT l.like_id FROM likes WHERE l.user_id = user_id) AS liked FROM vw_comments c
        LEFT JOIN likes l
    	ON l.picture_id = l.comment_id
        WHERE c.tweet_id = tweet_id
        LIMIT 0, p_limit;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_by_id` (IN `id` INT)   BEGIN
	SELECT * FROM vw_user_profiles u
    WHERE u.user_id = id
    LIMIT 0, 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_comment` (IN `comment_text` VARCHAR(255), IN `user_id` INT, IN `tweet_id` INT)   BEGIN
	INSERT INTO comments (comment_text, user_id, tweet_id)
    VALUES(comment_text, user_id, tweet_id);
    
    SELECT c.comment_id, c.create_date FROM comments c WHERE c.comment_id = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_comment_like` (IN `c_id` INT, IN `u_id` INT)   BEGIN
	INSERT INTO likes (comment_id, user_id)
    VALUES (c_id, u_id);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_role` (IN `r_name` VARCHAR(255), IN `r_description` VARCHAR(255))   BEGIN
	INSERT INTO roles (role_name, description)
    VALUES (r_name, r_description);
    
    SELECT r.role_id, r.create_date FROM roles r WHERE r.role_id = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_tweet` (IN `tweet_text` VARCHAR(255), IN `user_id` INT, IN `path_array` TEXT, IN `c_text_array` TEXT)   BEGIN
	DECLARE tweet_id INT;
            DECLARE path_element VARCHAR(500);
            DECLARE caption_text_element VARCHAR(255);
            DECLARE counter INT DEFAULT 0;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    	ROLLBACK;
    END;
    
    START TRANSACTION;

	INSERT INTO tweets (tweet_text, user_id)
	VALUES(tweet_text, user_id);
    
    SET tweet_id = LAST_INSERT_ID();
    
    IF LENGTH(path_array) > 0 THEN
    	myloop: WHILE TRUE DO 
            SET counter = counter + 1;
            SET path_element = SUBSTRING_INDEX(path_array, ',', 1);
            SET caption_text_element = SUBSTRING_INDEX(c_text_array, ',', 1);

            INSERT INTO pictures (picture_path, caption_text, tweet_id)
            VALUES (path_element, caption_text_element, tweet_id);

            SET path_array = SUBSTRING(path_array, LENGTH(path_element) + 2);
            SET c_text_array = SUBSTRING(c_text_array, LENGTH(caption_text_element) + 2);

            IF counter = 5 OR LENGTH(path_array) = 0 THEN
                LEAVE myLoop;
            END IF;
    	END WHILE;
    END IF;
    
    SELECT t.tweet_id, t.create_date FROM tweets t WHERE t.tweet_id = tweet_id;
    
    SELECT p.picture_id, p.create_date FROM pictures p WHERE p.tweet_id = tweet_id;
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_tweet_like` (IN `user_Id` INT, IN `tweet_id` INT)   BEGIN
	INSERT INTO likes (user_id, tweet_id)
    VALUES (user_id, tweet_id);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_user` (IN `username` VARCHAR(255), IN `first_name` VARCHAR(255), IN `last_name` VARCHAR(255), IN `email` VARCHAR(255), IN `password` VARCHAR(255), IN `phone_number` VARCHAR(255))   BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    	ROLLBACK;
    END;
    
    START TRANSACTION;
    INSERT INTO profiles (about_me)
    VALUES (NULL);
    
    INSERT INTO users
    (username, first_name, last_name, email, password, phone_number, profile_id)
	VALUES (username, first_name, last_name, email, password, phone_number, LAST_INSERT_ID());
    
    COMMIT;
END$$

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
	SELECT EXISTS(SELECT * FROM users u WHERE u.phone_number = phone_number AND u.user_id != user_id) AS phone_number_exists;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `role_description_exists` (IN `r_desc` VARCHAR(255), IN `r_id` INT)   BEGIN
	IF r_id IS NULL THEN
    	SELECT(EXISTS(SELECT * FROM roles WHERE description = r_desc)) AS role_description_exists;
    ELSE
    	SELECT(EXISTS(SELECT * FROM roles WHERE description = r_desc AND role_id = r_id)) AS role_description_exists;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `role_exists_by_id` (IN `r_id` INT)   BEGIN
	SELECT(EXISTS(SELECT * FROM roles WHERE role_id = r_id)) AS role_exists_by_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `role_name_exists` (IN `r_name` VARCHAR(255), IN `r_id` INT)   BEGIN
	IF r_id IS NULL THEN
    	SELECT(EXISTS(SELECT * FROM roles WHERE role_name = r_name)) AS role_exists;
    ELSE
    	SELECT(EXISTS(SELECT * FROM roles WHERE role_name = r_name AND role_id = r_id)) AS role_exists;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_role` (IN `r_desc` VARCHAR(255), IN `r_id` INT)   BEGIN
	UPDATE roles
    SET description = r_desc
    WHERE role_id = r_id;
    
    SELECT r.update_date, r.create_date FROM roles r WHERE role_id = r_id LIMIT 0, 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_tweet` (IN `tweet_id` INT, IN `tweet_text` VARCHAR(255))   BEGIN
	UPDATE tweets
    SET tweet_text = tweet_text, update_date = CURRENT_DATE()
    WHERE tweet_id = tweet_id;
    
    SELECT t.update_date FROM tweets t
    WHERE t.tweet_id = tweet_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_user` (IN `u_id` INT, IN `u_name` VARCHAR(255), IN `f_name` VARCHAR(255), IN `l_name` VARCHAR(255), IN `e_mail` VARCHAR(255), IN `p_number` VARCHAR(10), IN `m_name` VARCHAR(255), IN `a_me` VARCHAR(255), IN `b_date` DATE, IN `g_id` INT)   BEGIN
	DECLARE p_id INT DEFAULT 0;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    	SHOW ERRORS;
    	ROLLBACK;
        SELECT g_id;
    END;
    
    START TRANSACTION;
    
    SET p_id = (SELECT u.profile_id FROM vw_user_profiles u WHERE u.user_id = u_id);
    
    UPDATE users
    SET first_name = f_name, username = u_name, last_name = l_name, email = e_mail, phone_number = p_number
    WHERE user_id = u_id;
    
    UPDATE profiles
    SET about_me = a_me, birth_date = b_date, gender_id = g_id
    WHERE profile_id = p_id;
    
    SELECT u.date_created, u.profile_id, u.cover_picture_id, u.cover_picture_path, u.proflie_picture_id, u.profile_picture_path, u.gender_name, u.pronoun_1, u.pronoun_2 FROM vw_user_profiles u
    WHERE u.user_id = u_id;
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `username_exists` (IN `username` VARCHAR(255), IN `user_id` INT)   BEGIN
IF user_id IS NULL THEN
	SELECT EXISTS(SELECT * FROM users u WHERE u.username = username) AS username_exists;
ELSE
	SELECT EXISTS(SELECT * FROM users u WHERE u.username = username AND u.user_id != user_id) AS username_exists;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `user_exists_by_id` (IN `id` INT)   BEGIN
	SELECT EXISTS(SELECT * FROM users u WHERE u.user_id = id) AS user_exists_by_id;
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `genders`
--

CREATE TABLE IF NOT EXISTS `genders` (
  `gender_id` int(11) NOT NULL AUTO_INCREMENT,
  `gender_name` varchar(255) NOT NULL,
  `pronoun_1` varchar(255) NOT NULL,
  `pronoun_2` varchar(255) NOT NULL,
  PRIMARY KEY (`gender_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `genders`
--

INSERT INTO `genders` (`gender_id`, `gender_name`, `pronoun_1`, `pronoun_2`) VALUES
(1, 'Male', 'He', 'Him');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE IF NOT EXISTS `likes` (
  `like_id` int(11) NOT NULL AUTO_INCREMENT,
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  `tweet_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `picture_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`like_id`),
  KEY `user_id` (`user_id`),
  KEY `tweet_id` (`tweet_id`),
  KEY `comment_id` (`comment_id`),
  KEY `picture_id` (`picture_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pictures`
--

CREATE TABLE IF NOT EXISTS `pictures` (
  `picture_id` int(11) NOT NULL AUTO_INCREMENT,
  `picture_path` varchar(500) NOT NULL,
  `caption_text` varchar(255) NOT NULL,
  `profile_picture` tinyint(1) NOT NULL DEFAULT 0,
  `cover_picture` tinyint(1) NOT NULL DEFAULT 0,
  `tweet_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
  `update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`picture_id`),
  KEY `user_id` (`user_id`),
  KEY `tweet_id` (`tweet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5704618 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE IF NOT EXISTS `profiles` (
  `profile_id` int(11) NOT NULL AUTO_INCREMENT,
  `about_me` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `birth_date` datetime DEFAULT NULL,
  `gender_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`profile_id`),
  KEY `gender_id` (`gender_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Table structure for table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
  `update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `description`, `create_date`, `update_date`) VALUES
(1, 'Admin', 'This role will have CRUD rights to everything.', '2024-02-18 12:42:24', NULL),
(2, 'Developer', 'This role is for developers', '2024-02-26 19:08:25', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `profile_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `profile_id` (`profile_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
  `update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`user_role_id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
,`comment_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_tweet_pictures`
-- (See below for the actual view)
--
CREATE TABLE IF NOT EXISTS `vw_tweet_pictures` (
`picture_id` int(11)
,`picture_path` varchar(500)
,`caption_text` varchar(255)
,`profile_picture` tinyint(1)
,`cover_picture` tinyint(1)
,`create_date` datetime
,`update_date` datetime
,`tweet_id` int(11)
,`tweet_text` varchar(255)
,`tweet_create_date` date
,`tweet_update_date` date
,`user_id` int(11)
,`username` varchar(255)
,`like_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_user_pictures`
-- (See below for the actual view)
--
CREATE TABLE IF NOT EXISTS `vw_user_pictures` (
`picture_id` int(11)
,`picture_path` varchar(500)
,`caption_text` varchar(255)
,`profile_picture` tinyint(1)
,`cover_picture` tinyint(1)
,`create_date` datetime
,`update_date` datetime
,`user_id` int(11)
,`username` varchar(255)
,`like_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_user_profiles`
-- (See below for the actual view)
--
CREATE TABLE IF NOT EXISTS `vw_user_profiles` (
`user_id` int(11)
,`username` varchar(255)
,`first_name` varchar(255)
,`last_name` varchar(255)
,`email` varchar(255)
,`phone_number` varchar(10)
,`date_created` date
,`profile_id` int(11)
,`about_me` varchar(255)
,`middle_name` varchar(255)
,`birth_date` datetime
,`gender_id` int(11)
,`gender_name` varchar(255)
,`pronoun_1` varchar(255)
,`pronoun_2` varchar(255)
,`cover_picture_id` int(11)
,`cover_picture_path` varchar(500)
,`proflie_picture_id` int(11)
,`profile_picture_path` varchar(500)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_user_roles`
-- (See below for the actual view)
--
CREATE TABLE IF NOT EXISTS `vw_user_roles` (
`user_role_id` int(11)
,`role_id` int(11)
,`role_name` varchar(255)
,`description` varchar(255)
,`user_id` int(11)
,`first_name` varchar(255)
,`last_name` varchar(255)
,`create_date` datetime
,`update_date` datetime
);

-- --------------------------------------------------------

--
-- Structure for view `vw_comments`
--
DROP TABLE IF EXISTS `vw_comments`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_comments`  AS SELECT `c`.`comment_id` AS `comment_id`, `c`.`comment_text` AS `comment_text`, `c`.`create_date` AS `create_date`, `c`.`update_date` AS `update_date`, `c`.`user_id` AS `user_id`, `c`.`tweet_id` AS `tweet_id`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, count(`l`.`like_id`) AS `like_count` FROM ((`comments` `c` left join `likes` `l` on(`c`.`comment_id` = `l`.`comment_id`)) join `users` `u` on(`u`.`user_id` = `c`.`user_id`)) GROUP BY 1 ;

-- --------------------------------------------------------

--
-- Structure for view `vw_tweets`
--
DROP TABLE IF EXISTS `vw_tweets`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_tweets`  AS SELECT `t`.`tweet_id` AS `tweet_id`, `t`.`tweet_text` AS `tweet_text`, `t`.`create_date` AS `create_date`, `t`.`update_date` AS `update_date`, `t`.`user_id` AS `user_id`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, count(`l`.`like_id`) AS `like_count`, count(`c`.`comment_id`) AS `comment_count` FROM (((`tweets` `t` join `users` `u` on(`t`.`user_id` = `u`.`user_id`)) left join `likes` `l` on(`t`.`tweet_id` = `l`.`tweet_id`)) left join `comments` `c` on(`t`.`tweet_id` = `c`.`tweet_id`)) GROUP BY 1 ;

-- --------------------------------------------------------

--
-- Structure for view `vw_tweet_pictures`
--
DROP TABLE IF EXISTS `vw_tweet_pictures`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_tweet_pictures`  AS SELECT `p`.`picture_id` AS `picture_id`, `p`.`picture_path` AS `picture_path`, `p`.`caption_text` AS `caption_text`, `p`.`profile_picture` AS `profile_picture`, `p`.`cover_picture` AS `cover_picture`, `p`.`create_date` AS `create_date`, `p`.`update_date` AS `update_date`, `p`.`tweet_id` AS `tweet_id`, `t`.`tweet_text` AS `tweet_text`, `t`.`create_date` AS `tweet_create_date`, `t`.`update_date` AS `tweet_update_date`, `t`.`user_id` AS `user_id`, `u`.`username` AS `username`, count(`l`.`like_id`) AS `like_count` FROM (((`pictures` `p` join `tweets` `t` on(`p`.`tweet_id` = `t`.`tweet_id`)) join `users` `u` on(`t`.`user_id` = `u`.`user_id`)) left join `likes` `l` on(`l`.`picture_id` = `p`.`picture_id`)) GROUP BY 1 ;

-- --------------------------------------------------------

--
-- Structure for view `vw_user_pictures`
--
DROP TABLE IF EXISTS `vw_user_pictures`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_user_pictures`  AS SELECT `p`.`picture_id` AS `picture_id`, `p`.`picture_path` AS `picture_path`, `p`.`caption_text` AS `caption_text`, `p`.`profile_picture` AS `profile_picture`, `p`.`cover_picture` AS `cover_picture`, `p`.`create_date` AS `create_date`, `p`.`update_date` AS `update_date`, `p`.`user_id` AS `user_id`, `u`.`username` AS `username`, count(`l`.`like_id`) AS `like_count` FROM ((`pictures` `p` join `users` `u` on(`p`.`user_id` = `u`.`user_id`)) left join `likes` `l` on(`l`.`picture_id` = `p`.`picture_id`)) GROUP BY 1 ;

-- --------------------------------------------------------

--
-- Structure for view `vw_user_profiles`
--
DROP TABLE IF EXISTS `vw_user_profiles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_user_profiles`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`username` AS `username`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, `u`.`email` AS `email`, `u`.`phone_number` AS `phone_number`, `u`.`date_created` AS `date_created`, `u`.`profile_id` AS `profile_id`, `p`.`about_me` AS `about_me`, `p`.`middle_name` AS `middle_name`, `p`.`birth_date` AS `birth_date`, `p`.`gender_id` AS `gender_id`, `g`.`gender_name` AS `gender_name`, `g`.`pronoun_1` AS `pronoun_1`, `g`.`pronoun_2` AS `pronoun_2`, `cover_pic`.`picture_id` AS `cover_picture_id`, `cover_pic`.`picture_path` AS `cover_picture_path`, `profile_pic`.`picture_id` AS `proflie_picture_id`, `profile_pic`.`picture_path` AS `profile_picture_path` FROM ((((`users` `u` join `profiles` `p` on(`u`.`profile_id` = `p`.`profile_id`)) left join `genders` `g` on(`p`.`gender_id` = `g`.`gender_id`)) left join `pictures` `cover_pic` on(`cover_pic`.`user_id` = `u`.`user_id` and `cover_pic`.`cover_picture` = 1)) left join `pictures` `profile_pic` on(`profile_pic`.`user_id` = `u`.`user_id` and `profile_pic`.`profile_picture` = 1)) GROUP BY 1 ;

-- --------------------------------------------------------

--
-- Structure for view `vw_user_roles`
--
DROP TABLE IF EXISTS `vw_user_roles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_user_roles`  AS SELECT `ur`.`user_role_id` AS `user_role_id`, `ur`.`role_id` AS `role_id`, `r`.`role_name` AS `role_name`, `r`.`description` AS `description`, `u`.`user_id` AS `user_id`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, `ur`.`create_date` AS `create_date`, `ur`.`update_date` AS `update_date` FROM ((`user_roles` `ur` join `users` `u` on(`ur`.`user_id` = `u`.`user_id`)) join `roles` `r` on(`ur`.`role_id` = `r`.`role_id`)) ;

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
  ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`),
  ADD CONSTRAINT `likes_ibfk_4` FOREIGN KEY (`picture_id`) REFERENCES `pictures` (`picture_id`);

--
-- Constraints for table `pictures`
--
ALTER TABLE `pictures`
  ADD CONSTRAINT `pictures_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `pictures_ibfk_2` FOREIGN KEY (`tweet_id`) REFERENCES `tweets` (`tweet_id`);

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`gender_id`);

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

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
