CREATE DATABASE  IF NOT EXISTS `new_schema` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `new_schema`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: new_schema
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment` (
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `programs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (54,5),(65,6),(54,7),(69,9);
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `families`
--

DROP TABLE IF EXISTS `families`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `families` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_id` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `families`
--

LOCK TABLES `families` WRITE;
/*!40000 ALTER TABLE `families` DISABLE KEYS */;
/*!40000 ALTER TABLE `families` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(256) NOT NULL,
  `max_capacity` int NOT NULL,
  `current_enrollment` int NOT NULL,
  `base_price` int NOT NULL,
  `member_price` int NOT NULL,
  `teacher_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_idx` (`teacher_id`),
  CONSTRAINT `teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES (5,'golf(expensive)',5,4,50,25,59,'golf'),(6,'golf',155,123,45,20,60,'golf2'),(7,'programming in cpp and assembly',9999,12,666,55,60,'easyprogramming'),(8,'bruh',4242,55,7777,7777,59,'bruh'),(9,'Shark',5,0,192,96,60,'Sunday Shark');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_idx` (`program_id`),
  CONSTRAINT `id` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,5,'09:00:00','11:00:00','Friday','2023-03-23','2023-03-23'),(2,6,'13:00:00','15:00:00','Wednesday','2023-05-06','2023-07-08'),(3,7,'10:00:00','12:00:00','Monday','2023-05-06','2023-09-23'),(4,8,'08:00:00','10:00:00','Wednesday','2023-03-23','2023-09-23'),(5,9,'17:00:00','17:40:00','Sunday','2023-03-23','2023-09-23');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `current_enrollment` tinyint NOT NULL,
  `password` varchar(45) NOT NULL,
  `membership_status` int NOT NULL,
  `private` tinyint DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `family` tinyint DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'mine','craft',0,'bruh',1,NULL,'',NULL,''),(2,'first','last',0,'p',0,NULL,'',NULL,''),(3,'first','last',0,'p',0,NULL,'',NULL,''),(4,'first','last',0,'p',0,NULL,'',NULL,''),(5,'ethan','kath',0,'bruhmoment',0,NULL,'',NULL,''),(6,'ethan','kath',0,'bruhmoment',0,0,'',NULL,''),(54,'slowslicing','vslowslicing',0,'slowslicing',0,0,'slowslicing',NULL,'slowslicing'),(55,'rrr','rrr',0,'rrr',0,0,'rrr',NULL,'slowslicer'),(56,'fd','fd',0,'fd',0,0,'xanopticon',NULL,'xanopticon'),(57,'xanopticonfd','xanopticonfd',0,'xanopticonfd',0,0,'xanopticonfd',NULL,'xanopticonfd'),(58,'6086326556','6086326556',0,'6086326556',0,0,'60863265566086326556',NULL,'6086326556'),(59,'teacher','smith',0,'bruh',1,1,'horrible_teacher',NULL,'badteacher@ymca.net'),(60,'teacher','johnson',0,'fasdf',1,1,'good_teacher',NULL,'goodteacher@ymca.net'),(61,'bceorsu@gmail.com','bceorsu@gmail.com',0,'bceorsu@gmail.com',0,0,'bceorsu@gmail.com',NULL,'bceorsu@gmail.com'),(62,'yeezy','yeezy',0,'yeezy',0,0,'yeezy',NULL,'yeezy'),(63,'massivekek','massivekek',0,'massivekek',0,0,'massivekek',NULL,'massivekek'),(64,'6086326556e','6086326556e',0,'6086326556e',0,0,'6086326556e',NULL,'6086326556e'),(65,'keke','keke',0,'keke',0,0,'keke',NULL,'keke'),(66,'brooo','brooo',0,'brooo',0,0,'brooo',NULL,'brooo'),(67,'f','f',0,'f',0,0,'r',NULL,'fdas'),(68,'df','fs',0,'fs',0,0,'f',NULL,'slowslicingfrg'),(69,'bruh','bruh',0,'bruh',0,0,'demosignin',NULL,'demosignin@ymca.net');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-01 15:55:53
`