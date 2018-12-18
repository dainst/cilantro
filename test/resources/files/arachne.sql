-- MySQL dump 10.13  Distrib 5.7.24, for Linux (x86_64)
--
-- Host: bogusman02.dai-cloud.uni-koeln.de    Database: arachne
-- ------------------------------------------------------
-- Server version	5.5.61-MariaDB-1ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `IndexMaffeiano`
--

DROP TABLE IF EXISTS `IndexMaffeiano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `IndexMaffeiano` (
  `PS_IndexMaffeiano` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Kategorie` varchar(256) NOT NULL,
  `Originaleintrag` text NOT NULL,
  `EntschluesselterEintrag` text NOT NULL,
  `SeiteOriginal` varchar(10) NOT NULL,
  `OnlineSeite` varchar(10) NOT NULL,
  PRIMARY KEY (`PS_IndexMaffeiano`)
) ENGINE=MyISAM AUTO_INCREMENT=3672 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MaffeianoKonkordanz`
--

DROP TABLE IF EXISTS `MaffeianoKonkordanz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MaffeianoKonkordanz` (
  `Scanseite` mediumint(9) NOT NULL,
  `Stichwerkseite` mediumint(9) NOT NULL,
  `Abbildung` mediumint(9) DEFAULT NULL,
  `Fig_in_Tafel` mediumint(9) DEFAULT NULL,
  KEY `Stichwerkseite` (`Scanseite`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Sem_Verknuepfungen`
--

DROP TABLE IF EXISTS `Sem_Verknuepfungen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Sem_Verknuepfungen` (
  `PS_VerknuepfungenID` int(11) NOT NULL AUTO_INCREMENT,
  `Teil1` varchar(255) NOT NULL DEFAULT '',
  `Teil2` varchar(255) NOT NULL DEFAULT '',
  `Tabelle` varchar(255) NOT NULL DEFAULT '',
  `Befehl` varchar(255) NOT NULL DEFAULT '',
  `Beschreibung` text NOT NULL,
  `Felder` text NOT NULL,
  `Ersetzen` tinyint(1) DEFAULT '0',
  `Selfconnection` varchar(255) DEFAULT NULL,
  `Type` varchar(255) NOT NULL DEFAULT 'UnDirected',
  `StandardCIDOCConnectionType` varchar(255) NOT NULL COMMENT 'Standard CIDOC Connection Type der Fuer diese Verknuepfung Angenommen wird',
  `GuiEnabled` tinyint(1) NOT NULL,
  PRIMARY KEY (`PS_VerknuepfungenID`),
  KEY `Type` (`Type`)
) ENGINE=MyISAM AUTO_INCREMENT=283 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SemanticConnection`
--

DROP TABLE IF EXISTS `SemanticConnection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SemanticConnection` (
  `PS_SemanticConnectionID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Source` bigint(20) NOT NULL,
  `TypeSource` varchar(30) NOT NULL,
  `ForeignKeySource` bigint(20) NOT NULL,
  `Target` bigint(20) NOT NULL,
  `TypeTarget` varchar(30) NOT NULL,
  `ForeignKeyTarget` bigint(20) NOT NULL,
  `CIDOCConnectionType` varchar(255) NOT NULL,
  `AdditionalInfosJSON` text NOT NULL COMMENT 'This Is Additional infos in JSON',
  PRIMARY KEY (`PS_SemanticConnectionID`),
  UNIQUE KEY `UnifyThings` (`TypeSource`,`ForeignKeySource`,`Source`,`ForeignKeyTarget`,`TypeTarget`,`Target`,`CIDOCConnectionType`),
  KEY `EntityConnections` (`Source`,`Target`),
  KEY `OldConnections` (`TypeSource`,`ForeignKeySource`,`TypeTarget`,`ForeignKeyTarget`),
  KEY `ConnectionSemanticsIndex` (`CIDOCConnectionType`),
  KEY `SourceEntityID` (`Source`),
  KEY `TargetEntityID` (`Target`),
  KEY `InternalSource` (`TypeSource`,`ForeignKeySource`),
  KEY `InternalTarget` (`TypeTarget`,`ForeignKeyTarget`),
  FULLTEXT KEY `AdditionalInfosJSON` (`AdditionalInfosJSON`)
) ENGINE=MyISAM AUTO_INCREMENT=7626793 DEFAULT CHARSET=utf8 COMMENT='This is a semantics enabled central CrossTable';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Stichwerke`
--

DROP TABLE IF EXISTS `Stichwerke`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Stichwerke` (
  `PS_StichwerkseiteID` int(11) NOT NULL AUTO_INCREMENT,
  `FS_WerkstrukturID` int(11) NOT NULL,
  `Scanseite` varchar(25) NOT NULL,
  `identify` varchar(25) NOT NULL,
  PRIMARY KEY (`PS_StichwerkseiteID`)
) ENGINE=MyISAM AUTO_INCREMENT=848 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TABLE 186`
--

DROP TABLE IF EXISTS `TABLE 186`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TABLE 186` (
  `COL 1` varchar(33) DEFAULT NULL,
  `COL 2` varchar(120) DEFAULT NULL,
  `COL 3` varchar(40) DEFAULT NULL,
  `COL 4` varchar(46) DEFAULT NULL,
  `COL 5` varchar(39) DEFAULT NULL,
  `COL 6` varchar(36) DEFAULT NULL,
  `COL 7` varchar(70) DEFAULT NULL,
  `COL 8` varchar(52) DEFAULT NULL,
  `COL 9` varchar(54) DEFAULT NULL,
  `COL 10` varchar(86) DEFAULT NULL,
  `COL 11` varchar(48) DEFAULT NULL,
  `COL 12` varchar(222) DEFAULT NULL,
  `COL 13` varchar(62) DEFAULT NULL,
  `COL 14` varchar(62) DEFAULT NULL,
  `COL 15` varchar(57) DEFAULT NULL,
  `COL 16` varchar(64) DEFAULT NULL,
  `COL 17` varchar(62) DEFAULT NULL,
  `COL 18` varchar(9) DEFAULT NULL,
  `COL 19` varchar(64) DEFAULT NULL,
  `COL 20` varchar(8) DEFAULT NULL,
  `COL 21` varchar(14) DEFAULT NULL,
  `COL 22` varchar(8) DEFAULT NULL,
  `COL 23` varchar(8) DEFAULT NULL,
  `COL 24` varchar(23) DEFAULT NULL,
  `COL 25` varchar(6) DEFAULT NULL,
  `COL 26` varchar(8) DEFAULT NULL,
  `COL 27` varchar(9) DEFAULT NULL,
  `COL 28` varchar(8) DEFAULT NULL,
  `COL 29` varchar(17) DEFAULT NULL,
  `COL 30` varchar(9) DEFAULT NULL,
  `COL 31` varchar(7) DEFAULT NULL,
  `COL 32` varchar(14) DEFAULT NULL,
  `COL 33` varchar(8) DEFAULT NULL,
  `COL 34` varchar(16) DEFAULT NULL,
  `COL 35` varchar(31) DEFAULT NULL,
  `COL 36` varchar(13) DEFAULT NULL,
  `COL 37` varchar(14) DEFAULT NULL,
  `COL 38` varchar(31) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TABLE 187`
--

DROP TABLE IF EXISTS `TABLE 187`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TABLE 187` (
  `COL 1` varchar(10) DEFAULT NULL,
  `COL 2` varchar(120) DEFAULT NULL,
  `COL 3` varchar(20) DEFAULT NULL,
  `COL 4` varchar(10) DEFAULT NULL,
  `COL 5` varchar(18) DEFAULT NULL,
  `COL 6` varchar(17) DEFAULT NULL,
  `COL 7` varchar(14) DEFAULT NULL,
  `COL 8` varchar(39) DEFAULT NULL,
  `COL 9` varchar(24) DEFAULT NULL,
  `COL 10` varchar(86) DEFAULT NULL,
  `COL 11` varchar(21) DEFAULT NULL,
  `COL 12` varchar(222) DEFAULT NULL,
  `COL 13` varchar(10) DEFAULT NULL,
  `COL 14` varchar(7) DEFAULT NULL,
  `COL 15` varchar(12) DEFAULT NULL,
  `COL 16` varchar(15) DEFAULT NULL,
  `COL 17` varchar(9) DEFAULT NULL,
  `COL 18` varchar(10) DEFAULT NULL,
  `COL 19` varchar(10) DEFAULT NULL,
  `COL 20` varchar(10) DEFAULT NULL,
  `COL 21` varchar(10) DEFAULT NULL,
  `COL 22` varchar(10) DEFAULT NULL,
  `COL 23` varchar(10) DEFAULT NULL,
  `COL 24` varchar(10) DEFAULT NULL,
  `COL 25` varchar(10) DEFAULT NULL,
  `COL 26` varchar(10) DEFAULT NULL,
  `COL 27` varchar(10) DEFAULT NULL,
  `COL 28` varchar(10) DEFAULT NULL,
  `COL 29` varchar(10) DEFAULT NULL,
  `COL 30` varchar(10) DEFAULT NULL,
  `COL 31` varchar(10) DEFAULT NULL,
  `COL 32` varchar(10) DEFAULT NULL,
  `COL 33` varchar(10) DEFAULT NULL,
  `COL 34` varchar(10) DEFAULT NULL,
  `COL 35` varchar(10) DEFAULT NULL,
  `COL 36` varchar(10) DEFAULT NULL,
  `COL 37` varchar(10) DEFAULT NULL,
  `COL 38` varchar(31) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TABLE 189`
--

DROP TABLE IF EXISTS `TABLE 189`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TABLE 189` (
  `COL 1` varchar(10) DEFAULT NULL,
  `COL 2` varchar(27) DEFAULT NULL,
  `COL 3` varchar(6) DEFAULT NULL,
  `COL 4` varchar(10) DEFAULT NULL,
  `COL 5` varchar(23) DEFAULT NULL,
  `COL 6` varchar(10) DEFAULT NULL,
  `COL 7` varchar(10) DEFAULT NULL,
  `COL 8` varchar(10) DEFAULT NULL,
  `COL 9` varchar(10) DEFAULT NULL,
  `COL 10` varchar(10) DEFAULT NULL,
  `COL 11` varchar(10) DEFAULT NULL,
  `COL 12` varchar(36) DEFAULT NULL,
  `COL 13` varchar(10) DEFAULT NULL,
  `COL 14` varchar(10) DEFAULT NULL,
  `COL 15` varchar(10) DEFAULT NULL,
  `COL 16` varchar(57) DEFAULT NULL,
  `COL 17` varchar(10) DEFAULT NULL,
  `COL 18` varchar(10) DEFAULT NULL,
  `COL 19` varchar(10) DEFAULT NULL,
  `COL 20` varchar(10) DEFAULT NULL,
  `COL 21` varchar(10) DEFAULT NULL,
  `COL 22` varchar(10) DEFAULT NULL,
  `COL 23` varchar(10) DEFAULT NULL,
  `COL 24` varchar(10) DEFAULT NULL,
  `COL 25` varchar(10) DEFAULT NULL,
  `COL 26` varchar(10) DEFAULT NULL,
  `COL 27` varchar(10) DEFAULT NULL,
  `COL 28` varchar(10) DEFAULT NULL,
  `COL 29` varchar(10) DEFAULT NULL,
  `COL 30` varchar(10) DEFAULT NULL,
  `COL 31` varchar(10) DEFAULT NULL,
  `COL 32` varchar(10) DEFAULT NULL,
  `COL 33` varchar(10) DEFAULT NULL,
  `COL 34` varchar(10) DEFAULT NULL,
  `COL 35` varchar(10) DEFAULT NULL,
  `COL 36` varchar(10) DEFAULT NULL,
  `COL 37` varchar(10) DEFAULT NULL,
  `COL 38` varchar(48) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TABLE 201`
--

DROP TABLE IF EXISTS `TABLE 201`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TABLE 201` (
  `COL 1` varchar(10) DEFAULT NULL,
  `COL 2` varchar(135) DEFAULT NULL,
  `COL 3` varchar(6) DEFAULT NULL,
  `COL 4` varchar(8) DEFAULT NULL,
  `COL 5` varchar(59) DEFAULT NULL,
  `COL 6` varchar(10) DEFAULT NULL,
  `COL 7` varchar(10) DEFAULT NULL,
  `COL 8` varchar(10) DEFAULT NULL,
  `COL 9` varchar(10) DEFAULT NULL,
  `COL 10` varchar(10) DEFAULT NULL,
  `COL 11` varchar(10) DEFAULT NULL,
  `COL 12` varchar(170) DEFAULT NULL,
  `COL 13` varchar(10) DEFAULT NULL,
  `COL 14` varchar(10) DEFAULT NULL,
  `COL 15` varchar(10) DEFAULT NULL,
  `COL 16` varchar(32) DEFAULT NULL,
  `COL 17` varchar(10) DEFAULT NULL,
  `COL 18` varchar(10) DEFAULT NULL,
  `COL 19` varchar(10) DEFAULT NULL,
  `COL 20` varchar(10) DEFAULT NULL,
  `COL 21` varchar(10) DEFAULT NULL,
  `COL 22` varchar(10) DEFAULT NULL,
  `COL 23` varchar(10) DEFAULT NULL,
  `COL 24` varchar(10) DEFAULT NULL,
  `COL 25` varchar(10) DEFAULT NULL,
  `COL 26` varchar(10) DEFAULT NULL,
  `COL 27` varchar(10) DEFAULT NULL,
  `COL 28` varchar(10) DEFAULT NULL,
  `COL 29` varchar(10) DEFAULT NULL,
  `COL 30` varchar(10) DEFAULT NULL,
  `COL 31` varchar(10) DEFAULT NULL,
  `COL 32` varchar(10) DEFAULT NULL,
  `COL 33` varchar(10) DEFAULT NULL,
  `COL 34` varchar(10) DEFAULT NULL,
  `COL 35` varchar(10) DEFAULT NULL,
  `COL 36` varchar(10) DEFAULT NULL,
  `COL 37` varchar(10) DEFAULT NULL,
  `COL 38` varchar(41) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TABLE 202`
--

DROP TABLE IF EXISTS `TABLE 202`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TABLE 202` (
  `COL 1` varchar(10) DEFAULT NULL,
  `COL 2` varchar(135) DEFAULT NULL,
  `COL 3` varchar(6) DEFAULT NULL,
  `COL 4` varchar(8) DEFAULT NULL,
  `COL 5` varchar(59) DEFAULT NULL,
  `COL 6` varchar(10) DEFAULT NULL,
  `COL 7` varchar(10) DEFAULT NULL,
  `COL 8` varchar(10) DEFAULT NULL,
  `COL 9` varchar(10) DEFAULT NULL,
  `COL 10` varchar(10) DEFAULT NULL,
  `COL 11` varchar(10) DEFAULT NULL,
  `COL 12` varchar(170) DEFAULT NULL,
  `COL 13` varchar(10) DEFAULT NULL,
  `COL 14` varchar(10) DEFAULT NULL,
  `COL 15` varchar(10) DEFAULT NULL,
  `COL 16` varchar(32) DEFAULT NULL,
  `COL 17` varchar(10) DEFAULT NULL,
  `COL 18` varchar(10) DEFAULT NULL,
  `COL 19` varchar(10) DEFAULT NULL,
  `COL 20` varchar(10) DEFAULT NULL,
  `COL 21` varchar(10) DEFAULT NULL,
  `COL 22` varchar(10) DEFAULT NULL,
  `COL 23` varchar(10) DEFAULT NULL,
  `COL 24` varchar(10) DEFAULT NULL,
  `COL 25` varchar(10) DEFAULT NULL,
  `COL 26` varchar(10) DEFAULT NULL,
  `COL 27` varchar(10) DEFAULT NULL,
  `COL 28` varchar(10) DEFAULT NULL,
  `COL 29` varchar(10) DEFAULT NULL,
  `COL 30` varchar(10) DEFAULT NULL,
  `COL 31` varchar(10) DEFAULT NULL,
  `COL 32` varchar(10) DEFAULT NULL,
  `COL 33` varchar(10) DEFAULT NULL,
  `COL 34` varchar(10) DEFAULT NULL,
  `COL 35` varchar(10) DEFAULT NULL,
  `COL 36` varchar(10) DEFAULT NULL,
  `COL 37` varchar(10) DEFAULT NULL,
  `COL 38` varchar(41) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TABLE 205`
--

DROP TABLE IF EXISTS `TABLE 205`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TABLE 205` (
  `COL 1` varchar(10) DEFAULT NULL,
  `COL 2` varchar(237) DEFAULT NULL,
  `COL 3` varchar(10) DEFAULT NULL,
  `COL 4` int(4) DEFAULT NULL,
  `COL 5` varchar(11) DEFAULT NULL,
  `COL 6` varchar(10) DEFAULT NULL,
  `COL 7` varchar(13) DEFAULT NULL,
  `COL 8` varchar(10) DEFAULT NULL,
  `COL 9` varchar(10) DEFAULT NULL,
  `COL 10` varchar(26) DEFAULT NULL,
  `COL 11` varchar(10) DEFAULT NULL,
  `COL 12` varchar(63) DEFAULT NULL,
  `COL 13` varchar(13) DEFAULT NULL,
  `COL 14` varchar(64) DEFAULT NULL,
  `COL 15` varchar(7) DEFAULT NULL,
  `COL 16` varchar(20) DEFAULT NULL,
  `COL 17` varchar(10) DEFAULT NULL,
  `COL 18` varchar(35) DEFAULT NULL,
  `COL 19` varchar(10) DEFAULT NULL,
  `COL 20` varchar(36) DEFAULT NULL,
  `COL 21` varchar(10) DEFAULT NULL,
  `COL 22` varchar(10) DEFAULT NULL,
  `COL 23` varchar(10) DEFAULT NULL,
  `COL 24` varchar(10) DEFAULT NULL,
  `COL 25` varchar(10) DEFAULT NULL,
  `COL 26` varchar(10) DEFAULT NULL,
  `COL 27` varchar(10) DEFAULT NULL,
  `COL 28` varchar(10) DEFAULT NULL,
  `COL 29` varchar(10) DEFAULT NULL,
  `COL 30` varchar(10) DEFAULT NULL,
  `COL 31` varchar(10) DEFAULT NULL,
  `COL 32` varchar(10) DEFAULT NULL,
  `COL 33` varchar(10) DEFAULT NULL,
  `COL 34` varchar(10) DEFAULT NULL,
  `COL 35` varchar(10) DEFAULT NULL,
  `COL 36` varchar(10) DEFAULT NULL,
  `COL 37` varchar(10) DEFAULT NULL,
  `COL 38` varchar(47) DEFAULT NULL,
  `COL 39` varchar(10) DEFAULT NULL,
  `COL 40` varchar(48) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `URI`
--

DROP TABLE IF EXISTS `URI`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `URI` (
  `PS_URIID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `FS_PersonID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_GruppierungID` mediumint(8) unsigned DEFAULT NULL,
  `URI` varchar(256) NOT NULL,
  `FS_URIQuelleID` mediumint(8) unsigned DEFAULT NULL,
  `Beziehung` varchar(256) NOT NULL,
  `toDelete` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_URIID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_URIQuelleID` (`FS_URIQuelleID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_GruppierungID` (`FS_GruppierungID`),
  CONSTRAINT `uri_ibfk_1` FOREIGN KEY (`FS_PersonID`) REFERENCES `person` (`PS_PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_10` FOREIGN KEY (`FS_RealienID`) REFERENCES `realien` (`PS_RealienID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_11` FOREIGN KEY (`FS_ReliefID`) REFERENCES `relief` (`PS_ReliefID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_12` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_13` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_14` FOREIGN KEY (`FS_SammlungenID`) REFERENCES `sammlungen` (`PS_SammlungenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_15` FOREIGN KEY (`FS_TypusID`) REFERENCES `typus` (`PS_TypusID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_2` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_3` FOREIGN KEY (`FS_InschriftID`) REFERENCES `inschrift` (`PS_InschriftID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_4` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_6` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_7` FOREIGN KEY (`FS_BauwerksteilID`) REFERENCES `bauwerksteil` (`PS_BauwerksteilID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_8` FOREIGN KEY (`FS_BuchID`) REFERENCES `buch` (`PS_BuchID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uri_ibfk_9` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2605 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_uri` BEFORE INSERT ON `URI` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `URIQuelle`
--

DROP TABLE IF EXISTS `URIQuelle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `URIQuelle` (
  `PS_URIQuelleID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(256) NOT NULL,
  `URLSchema` varchar(256) NOT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_URIQuelleID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_uriquelle` BEFORE INSERT ON `URIQuelle` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Verknuepfungen`
--

DROP TABLE IF EXISTS `Verknuepfungen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Verknuepfungen` (
  `PS_VerknuepfungenID` int(11) NOT NULL AUTO_INCREMENT,
  `Teil1` varchar(255) NOT NULL DEFAULT '',
  `Teil2` varchar(255) NOT NULL DEFAULT '',
  `Tabelle` varchar(255) NOT NULL DEFAULT '',
  `Befehl` varchar(255) NOT NULL DEFAULT '',
  `Beschreibung` text NOT NULL,
  `Felder` varchar(255) NOT NULL DEFAULT '',
  `Ersetzen` tinyint(1) DEFAULT '0',
  `Selfconnection` varchar(255) DEFAULT NULL,
  `Type` varchar(255) NOT NULL DEFAULT 'UnDirected',
  PRIMARY KEY (`PS_VerknuepfungenID`),
  KEY `Type` (`Type`)
) ENGINE=MyISAM AUTO_INCREMENT=109 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Werkstruktur`
--

DROP TABLE IF EXISTS `Werkstruktur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Werkstruktur` (
  `PS_WerkstrukturID` int(11) NOT NULL AUTO_INCREMENT,
  `FS_LiteraturID` int(11) NOT NULL,
  `Ebene` varchar(25) NOT NULL,
  `Bezeichnung` text NOT NULL,
  `identify` varchar(25) NOT NULL,
  PRIMARY KEY (`PS_WerkstrukturID`)
) ENGINE=MyISAM AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `arachneentitydegrees`
--

DROP TABLE IF EXISTS `arachneentitydegrees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arachneentitydegrees` (
  `ArachneEntityID` bigint(20) NOT NULL,
  `Degree` int(11) NOT NULL,
  PRIMARY KEY (`ArachneEntityID`),
  KEY `Degree` (`Degree`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Stores the number of connections for each entity';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `arachneentityidentification`
--

DROP TABLE IF EXISTS `arachneentityidentification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arachneentityidentification` (
  `ArachneEntityID` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'EinEinDeutiger Identifier fuer Arachne Datensaetze',
  `TableName` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'Tabellenname',
  `ForeignKey` bigint(20) unsigned NOT NULL COMMENT 'Primärschluessel des Datensatzes in der Tabelle',
  `isDeleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Ist der Datensatz geloescht',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ArachneEntityID`),
  UNIQUE KEY `TableName` (`TableName`,`ForeignKey`)
) ENGINE=MyISAM AUTO_INCREMENT=6319204 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Diese Tabelle soll unseren Datensaetzen eineindeutige ids ve';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bauwerk`
--

DROP TABLE IF EXISTS `bauwerk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bauwerk` (
  `PS_BauwerkID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `DatensatzGruppeBauwerk` varchar(255) NOT NULL DEFAULT 'Arachne',
  `Architekt` text NOT NULL,
  `ArbeitsnotizBauwerk` varchar(255) NOT NULL,
  `Ausgrabung` text NOT NULL,
  `Bauordnung` text NOT NULL,
  `BauordnungBemerkung` text NOT NULL,
  `BearbeiterBauwerk` varchar(255) NOT NULL DEFAULT '',
  `BauwerkBemerkungen` text NOT NULL,
  `BeschreibungBauwerk` text NOT NULL,
  `ErhaltungBauwerk` text NOT NULL,
  `Katalogbearbeitung` varchar(255) NOT NULL,
  `Katalognummer` varchar(255) NOT NULL,
  `Katalogtext` text NOT NULL,
  `KurzbeschreibungBauwerk` text NOT NULL,
  `Gebaeudetyp` text NOT NULL,
  `GebaeudetypSpeziell` text NOT NULL,
  `Geschichte` text NOT NULL,
  `KorrektorBauwerk` varchar(255) NOT NULL DEFAULT '',
  `BauwerkKulturkreis` text NOT NULL,
  `LitInschrift` text NOT NULL,
  `Restaurierung` text NOT NULL,
  `RestaurierungArt` text NOT NULL,
  `RestaurierungFinanzierungsquelle` text NOT NULL,
  `Situation` text NOT NULL,
  `antikeGriechLandschaftBauwerk` text NOT NULL,
  `antikeRoemProvinzBauwerk` text NOT NULL,
  `OrtsnameAntik` text NOT NULL,
  `OrtsnameModern` text NOT NULL,
  `Kontext` text NOT NULL,
  `RegioRomItalien` text NOT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetBauwerk` varchar(256) NOT NULL DEFAULT 'bauwerk',
  `ProduktMaterial` text NOT NULL,
  `ProduktMaterialSpezifizierung` text NOT NULL,
  `ProduktFunktion` text NOT NULL,
  `ProduktForm` text NOT NULL,
  `Befund` text NOT NULL,
  `Einbindung` text NOT NULL,
  `ArchaeometrischeMessungen` text NOT NULL,
  PRIMARY KEY (`PS_BauwerkID`),
  KEY `ArbeitsnotizBauwerk` (`ArbeitsnotizBauwerk`),
  KEY `DatensatzGruppeBauwerk` (`DatensatzGruppeBauwerk`),
  KEY `KurzbeschreibungBauwerk` (`KurzbeschreibungBauwerk`(255))
) ENGINE=InnoDB AUTO_INCREMENT=2117700 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_bauwerk` BEFORE INSERT ON `bauwerk` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_bauwerk` AFTER INSERT ON `bauwerk` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='bauwerk', `arachneentityidentification`.`ForeignKey`=NEW.`PS_BauwerkID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDBauwerk` AFTER DELETE ON `bauwerk` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('bauwerk', OLD.`PS_BauwerkID`, OLD.`oaipmhsetBauwerk`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_BauwerkID` AND `arachneentityidentification`.`TableName` = 'bauwerk';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `bauwerkausstattung`
--

DROP TABLE IF EXISTS `bauwerkausstattung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bauwerkausstattung` (
  `PS_BauwerkausstattungID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `Bauphase` text NOT NULL,
  `Bauteilgruppe` varchar(255) NOT NULL,
  `Position` text NOT NULL,
  `KommentarBauwerk` text NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_BauwerkausstattungID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `Bauteilgruppe` (`Bauteilgruppe`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  CONSTRAINT `bauwerkausstattung_ibfk_1` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bauwerkausstattung_ibfk_2` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bauwerkausstattung_ibfk_3` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bauwerkausstattung_ibfk_4` FOREIGN KEY (`FS_ReliefID`) REFERENCES `relief` (`PS_ReliefID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33428 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bauwerksteil`
--

DROP TABLE IF EXISTS `bauwerksteil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bauwerksteil` (
  `PS_BauwerksteilID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `ArbeitsnotizBauwerksteil` varchar(255) NOT NULL,
  `DatensatzGruppeBauwerksteil` varchar(255) NOT NULL DEFAULT 'Arachne',
  `Bezugsrichtung` varchar(255) DEFAULT NULL,
  `Bezugskommentar` varchar(255) DEFAULT NULL,
  `BearbeiterBauwerksteil` varchar(255) DEFAULT NULL,
  `KorrektorBauwerksteil` varchar(255) DEFAULT NULL,
  `KurzbeschreibungBauwerksteil` varchar(255) DEFAULT NULL,
  `Architekt` varchar(255) DEFAULT NULL,
  `Ausgrabungen` text,
  `Bauordnung` varchar(255) DEFAULT NULL,
  `BauordnungBemerkung` text,
  `BemerkungenBauwerksteil` text,
  `BeschreibungBauwerksteil` text,
  `ErhaltungBauwerksteil` text,
  `GeschichteBauwerksteil` text,
  `RestaurierungenBauwerksteil` text,
  `KontextBauwerksteil` text,
  `DekorationsartBauwerksteil` varchar(255) DEFAULT NULL,
  `ArchitektonischeBauordnung` varchar(255) DEFAULT NULL,
  `BreiteBauwerksteil` varchar(255) DEFAULT NULL,
  `HoeheBauwerksteil` varchar(255) DEFAULT NULL,
  `TiefeBauwerksteil` varchar(255) DEFAULT NULL,
  `ArchDB3D_ID` int(11) unsigned DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetBauwerksteil` varchar(256) NOT NULL DEFAULT 'bauwerksteil',
  PRIMARY KEY (`PS_BauwerksteilID`),
  KEY `DatensatzGruppeBauwerksteil` (`DatensatzGruppeBauwerksteil`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  CONSTRAINT `bauwerksteil_ibfk_4` FOREIGN KEY (`FS_BauwerksteilID`) REFERENCES `bauwerksteil` (`PS_BauwerksteilID`),
  CONSTRAINT `bauwerksteil_ibfk_5` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`)
) ENGINE=InnoDB AUTO_INCREMENT=6517 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_bauwerksteil` BEFORE INSERT ON `bauwerksteil` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_bauwerksteil` AFTER INSERT ON `bauwerksteil` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='bauwerksteil', `arachneentityidentification`.`ForeignKey`=NEW.`PS_BauwerksteilID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDBauwerksteil` AFTER DELETE ON `bauwerksteil` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('bauwerksteil', OLD.`PS_BauwerksteilID`, OLD.`oaipmhsetBauwerksteil`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_BauwerksteilID` AND `arachneentityidentification`.`TableName` = 'bauwerksteil';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `befund`
--

DROP TABLE IF EXISTS `befund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `befund` (
  `PS_BefundID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `PS_FMPBefundID` mediumint(9) NOT NULL DEFAULT '-1',
  `Befund` varchar(256) DEFAULT NULL,
  `Abhub` varchar(256) DEFAULT NULL,
  `Areal` varchar(256) DEFAULT NULL,
  `Kommentar` text,
  `Grabungsort` varchar(256) DEFAULT NULL,
  `DatensatzGruppeBefund` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_BefundID`),
  KEY `PS_FMPContextID` (`PS_FMPBefundID`)
) ENGINE=InnoDB AUTO_INCREMENT=856 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `createEntityIDBefund` AFTER INSERT ON `befund` FOR EACH ROW BEGIN 
INSERT INTO  `arachneentityidentification` 
SET  `arachneentityidentification`.`TableName`='befund', `arachneentityidentification`.`ForeignKey` = NEW.`PS_BefundID` ;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `DeleteBefundConnections` AFTER DELETE ON `befund` FOR EACH ROW BEGIN
DELETE FROM `datierung` WHERE `datierung`.`FS_BefundID` = OLD.`PS_BefundID`;
DELETE FROM `literaturzitat` WHERE `literaturzitat`.`FS_BefundID` = OLD.`PS_BefundID`;
DELETE FROM `ortsbezug` WHERE `ortsbezug`.`FS_BefundID` = OLD.`PS_BefundID`;
UPDATE `mainabstract` SET `FS_BefundID` = NULL WHERE `mainabstract`.`FS_BefundID` = OLD.`PS_BefundID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `bestandsbenennung`
--

DROP TABLE IF EXISTS `bestandsbenennung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bestandsbenennung` (
  `PS_Bestandsbenennung` int(255) NOT NULL AUTO_INCREMENT,
  `Bestandsname` varchar(255) NOT NULL,
  `Benennungsart` varchar(255) NOT NULL,
  `Zeitraum` varchar(255) NOT NULL,
  `RegulaererAusdruck` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Bestandsbenennung`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bookmark`
--

DROP TABLE IF EXISTS `bookmark`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookmark` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bookmark_list_id` int(10) unsigned NOT NULL,
  `arachne_entity_id` bigint(20) unsigned NOT NULL,
  `commentary` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bookmark_list`
--

DROP TABLE IF EXISTS `bookmark_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookmark_list` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `name` text NOT NULL,
  `commentary` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buch`
--

DROP TABLE IF EXISTS `buch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buch` (
  `PS_BuchID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `DatensatzGruppeBuch` varchar(255) NOT NULL,
  `BearbeiterBuch` varchar(255) NOT NULL,
  `creatienDateTime` datetime NOT NULL,
  `KorrektorBuch` varchar(255) DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ArbeitsnotizBuch` varchar(255) DEFAULT NULL,
  `Verzeichnis` varchar(255) NOT NULL,
  `origFile` varchar(255) NOT NULL,
  `Cover` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT '',
  `KurzbeschreibungBuch` varchar(255) NOT NULL,
  `bibid` varchar(255) DEFAULT NULL,
  `vokabular_id` varchar(225) DEFAULT NULL,
  `band` mediumint(8) unsigned DEFAULT NULL,
  `Einzelband` varchar(255) DEFAULT NULL,
  `BuchAuthor` varchar(255) DEFAULT NULL,
  `BuchTitel` varchar(2047) DEFAULT NULL,
  `BuchJahr` varchar(255) NOT NULL,
  `BuchOrt` varchar(255) NOT NULL,
  `BuchVerleger` varchar(255) DEFAULT NULL,
  `BuchPhysikalischeBeschreibung` varchar(255) DEFAULT NULL,
  `BuchBesitzvergangenheit` varchar(1023) DEFAULT NULL,
  `BuchWeiterePersonen` varchar(1023) DEFAULT '',
  `BuchSeiten` mediumint(8) unsigned DEFAULT NULL,
  `Sonderprojekt` varchar(255) DEFAULT NULL,
  `BuchPermalinkExtern` varchar(255) DEFAULT NULL,
  `materialEinband` varchar(255) DEFAULT NULL,
  `materialSeiten` varchar(255) DEFAULT NULL,
  `BuchEntstehungszeitraum` varchar(255) DEFAULT NULL,
  `BuchAuthorQualifier` varchar(255) DEFAULT NULL,
  `BuchErhaltung` varchar(255) DEFAULT NULL,
  `BuchAnmerkungenKossack` text,
  `BuchInhalt` text,
  `BuchMaterialgattung` varchar(255) DEFAULT NULL,
  `BuchAnzahlFotos` int(11) DEFAULT NULL,
  `BuchAnzahlNegative` int(11) DEFAULT NULL,
  `BuchAnzahlPostkarten` int(11) DEFAULT NULL,
  `BuchAnzahlZeichnungen` int(11) DEFAULT NULL,
  `BuchAnzahlBriefe` int(11) DEFAULT NULL,
  `BuchAnzahlFilme` int(11) DEFAULT NULL,
  `BuchAnzahlKopien` int(11) DEFAULT NULL,
  `BuchAnzahlDiaPositive` int(11) DEFAULT NULL,
  `BuchAnzahlNotizen` int(11) DEFAULT NULL,
  `BuchAnzahlPlaene` int(11) DEFAULT NULL,
  `oaipmhsetBuch` varchar(256) NOT NULL DEFAULT 'buch',
  `PubYearStart` int(11) DEFAULT NULL COMMENT 'Frühstes geschaetzes Jahr der Publikation',
  `PubYearEnd` int(11) DEFAULT NULL COMMENT 'Spaetestes geschaetzes Jahr der Publikation',
  `BreiteGesamt` varchar(255) NOT NULL DEFAULT '',
  `HoeheGesamt` varchar(255) NOT NULL DEFAULT '',
  `Material` varchar(255) NOT NULL DEFAULT '',
  `Materialbeschreibung` text NOT NULL,
  `TiefeGesamt` varchar(255) NOT NULL DEFAULT '',
  `ZusaetzlicheMasze` text CHARACTER SET latin7 NOT NULL,
  `BuchMaszeBemerk` text NOT NULL,
  `hasOcrText` varchar(1) DEFAULT '0',
  `hasMarcData` varchar(1) DEFAULT '0',
  PRIMARY KEY (`PS_BuchID`),
  KEY `Titel` (`BuchTitel`(255)),
  KEY `Jahr` (`BuchJahr`),
  KEY `Ort` (`BuchOrt`),
  KEY `Author` (`BuchAuthor`),
  KEY `materialEinband` (`materialEinband`),
  KEY `materialSeiten` (`materialSeiten`),
  KEY `bibid` (`bibid`),
  KEY `band` (`band`),
  KEY `KurzbeschreibungBuch` (`KurzbeschreibungBuch`),
  KEY `DatensatzGruppeBuch` (`DatensatzGruppeBuch`),
  KEY `origFile` (`origFile`),
  KEY `ArbeitsnotizBuch` (`ArbeitsnotizBuch`)
) ENGINE=InnoDB AUTO_INCREMENT=10794 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_buch` BEFORE INSERT ON `buch` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_buch` AFTER INSERT ON `buch` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='buch', `arachneentityidentification`.`ForeignKey`=NEW.`PS_BuchID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `SearchallDeleteBuch` AFTER DELETE ON `buch` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`,`key`,`oaipmhsetDeletedRecords`) VALUES ('buch',OLD.`PS_BuchID`, OLD.`oaipmhsetBuch`);
DELETE FROM `search_buchall` WHERE `search_buchall`.`PS_BuchID` = OLD.`PS_BuchID`;
DELETE FROM `search_buchseiteall` WHERE `search_buchseiteall`.`PS_BuchID` = OLD.`PS_BuchID`;
DELETE FROM `buchseite` WHERE `buchseite`.`FS_BuchID` = OLD.`PS_BuchID`;
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_BuchID` AND `arachneentityidentification`.`TableName` = 'buch';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `buchEnrich`
--

DROP TABLE IF EXISTS `buchEnrich`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buchEnrich` (
  `PS_BuchEnrichID` int(11) NOT NULL AUTO_INCREMENT,
  `origFile` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetBuchEnrich` varchar(256) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'buchenrich',
  PRIMARY KEY (`PS_BuchEnrichID`)
) ENGINE=MyISAM AUTO_INCREMENT=207 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buch_elemente`
--

DROP TABLE IF EXISTS `buch_elemente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buch_elemente` (
  `PS_buch_elementeID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BuchID` mediumint(8) unsigned NOT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `KommentarBuchElement` text NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_buch_elementeID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `FS_BuchID` (`FS_BuchID`)
) ENGINE=MyISAM AUTO_INCREMENT=7970 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDBuchElemente` AFTER DELETE ON `buch_elemente` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `Key`) VALUES ('buch_elemente', OLD.`PS_Buch_ElementeID`);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `buchkategorie`
--

DROP TABLE IF EXISTS `buchkategorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buchkategorie` (
  `PS_BuchkategorieID` bigint(11) NOT NULL,
  `FS_BuchkategorieParentID` int(11) DEFAULT NULL,
  `Anzahl` int(11) DEFAULT '1',
  `TitelDeutsch` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `TitelEnglisch` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `leaf` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`PS_BuchkategorieID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buchseite`
--

DROP TABLE IF EXISTS `buchseite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buchseite` (
  `PS_BuchseiteID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BuchID` mediumint(8) unsigned NOT NULL,
  `DatensatzGruppeBuchseite` varchar(255) NOT NULL,
  `BearbeiterBuchseite` varchar(255) DEFAULT NULL,
  `creatienDateTime` datetime NOT NULL,
  `KorrektorBuchseite` varchar(255) DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ArbeitsnotizBuchseite` varchar(255) DEFAULT NULL,
  `KurzbeschreibungBuchseite` varchar(255) DEFAULT NULL,
  `aliasBuchseite` varchar(255) NOT NULL,
  `seite` mediumint(8) unsigned NOT NULL DEFAULT '1',
  `seite_natuerlich` mediumint(8) unsigned NOT NULL COMMENT 'Feld zur Anzeige der natürlichen Seitenzahl beginnend bei 1',
  `Originalpaginierung` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_old` varchar(255) DEFAULT NULL,
  `Inventarnummern` text,
  `InventarbucheiteInfos` text,
  `BuchseitePermalinkExtern` varchar(255) DEFAULT NULL,
  `BuchseiteDokumenttyp` varchar(255) DEFAULT NULL,
  `BuchseiteAnmerkungenKossack` text,
  `BuchseiteInhalt` text,
  `bibidSeite` varchar(255) DEFAULT NULL,
  `oaipmhsetBuchseite` varchar(256) NOT NULL DEFAULT 'buchseite',
  `Folierung` varchar(255) NOT NULL,
  `MotivFrei` text NOT NULL,
  `version` bigint(20) NOT NULL,
  PRIMARY KEY (`PS_BuchseiteID`),
  KEY `DatensatzGruppeBuchseite` (`DatensatzGruppeBuchseite`),
  KEY `BearbeiterBuchseite` (`BearbeiterBuchseite`),
  KEY `KorrektorBuchseite` (`KorrektorBuchseite`),
  KEY `ArbeitsnotizBuchseite` (`ArbeitsnotizBuchseite`),
  KEY `seite` (`seite`),
  KEY `lastModified` (`lastModified`),
  KEY `creatienDateTime` (`creatienDateTime`),
  KEY `image` (`image`),
  KEY `image_old` (`image_old`),
  KEY `bibidSeite` (`bibidSeite`),
  KEY `aliasBuchseite` (`aliasBuchseite`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `KurzbeschreibungBuchseite` (`KurzbeschreibungBuchseite`),
  CONSTRAINT `buchseite_ibfk_1` FOREIGN KEY (`FS_BuchID`) REFERENCES `buch` (`PS_BuchID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1288440 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_buchseite` BEFORE INSERT ON `buchseite` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
			SET NEW.seite_natuerlich = NEW.seite + 1;
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `INSERT_buchseiten` AFTER INSERT ON `buchseite` FOR EACH ROW BEGIN
UPDATE  `arachne`.`buch` SET  `lastModified` =  NOW() WHERE  `buch`.`PS_BuchID` = NEW.`FS_BuchID`;

INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='buchseite', `arachneentityidentification`.`ForeignKey`=NEW.`PS_BuchseiteID`;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `UPDATE_buchseiten` AFTER UPDATE ON `buchseite` FOR EACH ROW BEGIN
UPDATE  `arachne`.`buch` SET  `lastModified` =  NOW() WHERE  `buch`.`PS_BuchID` = NEW.`FS_BuchID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `MarbilderDeleteBuchseite` AFTER DELETE ON `buchseite` FOR EACH ROW BEGIN
DELETE FROM `marbilder` WHERE `marbilder`.`FS_BuchseiteID` = OLD.`PS_BuchseiteID`;
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('buchseite', OLD.`PS_BuchseiteID`, OLD.`oaipmhsetBuchseite`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_BuchseiteID` AND `arachneentityidentification`.`TableName` = 'buchseite';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `buchseiten_elemente`
--

DROP TABLE IF EXISTS `buchseiten_elemente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buchseiten_elemente` (
  `PS_buchseiten_elementeID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BuchseiteID` mediumint(8) unsigned NOT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_InschriftID` int(8) unsigned DEFAULT NULL,
  `KommentarBuchseitenElement` text NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_buchseiten_elementeID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `FS_InschriftID` (`FS_InschriftID`)
) ENGINE=MyISAM AUTO_INCREMENT=49709 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `INSERT_buchseiten_elemente` AFTER INSERT ON `buchseiten_elemente` FOR EACH ROW BEGIN
UPDATE  `arachne`.`buchseite` SET  `lastModified` =  NOW() WHERE  `buchseite`.`PS_BuchseiteID` = NEW.`FS_BuchseiteID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `UPDATE_buchseiten_elemente` AFTER UPDATE ON `buchseiten_elemente` FOR EACH ROW BEGIN
UPDATE  `arachne`.`buchseite` SET  `lastModified` =  NOW() WHERE  `buchseite`.`PS_BuchseiteID` = NEW.`FS_BuchseiteID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDBuchseitenElemente` AFTER DELETE ON `buchseiten_elemente` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `Key`) VALUES ('buchseiten_elemente', OLD.`PS_Buchseiten_ElementeID`);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `buchseiten_texte`
--

DROP TABLE IF EXISTS `buchseiten_texte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buchseiten_texte` (
  `PS_Buchseiten_TexteID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BuchseiteID` mediumint(8) unsigned NOT NULL,
  `Rohtext` text COLLATE utf8_bin NOT NULL,
  `lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_Buchseiten_TexteID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  CONSTRAINT `buchseiten_texte_ibfk_1` FOREIGN KEY (`FS_BuchseiteID`) REFERENCES `buchseite` (`PS_BuchseiteID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buchzuvokabular`
--

DROP TABLE IF EXISTS `buchzuvokabular`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buchzuvokabular` (
  `PS_BuchzuVokabularID` int(11) NOT NULL AUTO_INCREMENT,
  `FS_BuchID` int(11) NOT NULL,
  `FS_VokabularID` int(11) NOT NULL,
  PRIMARY KEY (`PS_BuchzuVokabularID`)
) ENGINE=MyISAM AUTO_INCREMENT=14796 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `catalog`
--

DROP TABLE IF EXISTS `catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `root_id` int(10) unsigned DEFAULT NULL,
  `author` varchar(255) NOT NULL,
  `public` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `DatensatzGruppeCatalog` varchar(255) NOT NULL DEFAULT 'Arachne',
  `ProjektId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `root_id` (`root_id`)
) ENGINE=InnoDB AUTO_INCREMENT=745 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `catalog_benutzer`
--

DROP TABLE IF EXISTS `catalog_benutzer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog_benutzer` (
  `catalog_id` int(10) unsigned NOT NULL,
  `uid` int(10) NOT NULL,
  KEY `catalog_id` (`catalog_id`,`uid`),
  KEY `uid` (`uid`),
  CONSTRAINT `catalog_benutzer_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `verwaltung_benutzer` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `catalog_entry`
--

DROP TABLE IF EXISTS `catalog_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog_entry` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `catalog_id` int(10) unsigned NOT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `arachne_entity_id` bigint(20) unsigned DEFAULT NULL,
  `index_parent` smallint(5) unsigned DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `label` text NOT NULL,
  `text` text,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  PRIMARY KEY (`id`),
  KEY `arachne_entity_id` (`arachne_entity_id`),
  KEY `catalog_id` (`catalog_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `catalog_entry_catalog` FOREIGN KEY (`catalog_id`) REFERENCES `catalog` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `catalog_entry_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `catalog_entry` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=578219 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_catalog_entry` BEFORE INSERT ON `catalog_entry`
 FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `catalog_entry_bkp140618`
--

DROP TABLE IF EXISTS `catalog_entry_bkp140618`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog_entry_bkp140618` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `catalog_id` int(10) unsigned NOT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `arachne_entity_id` bigint(20) unsigned DEFAULT NULL,
  `index_parent` smallint(5) unsigned DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `label` text NOT NULL,
  `text` text,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  PRIMARY KEY (`id`),
  KEY `arachne_entity_id` (`arachne_entity_id`),
  KEY `catalog_id` (`catalog_id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=570786 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `catalog_entry_bkp_27112017`
--

DROP TABLE IF EXISTS `catalog_entry_bkp_27112017`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog_entry_bkp_27112017` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `catalog_id` int(10) unsigned NOT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `arachne_entity_id` bigint(20) unsigned DEFAULT NULL,
  `index_parent` smallint(5) unsigned DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `label` text NOT NULL,
  `text` text,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  PRIMARY KEY (`id`),
  KEY `arachne_entity_id` (`arachne_entity_id`),
  KEY `catalog_id` (`catalog_id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=560594 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `datenblattberlin`
--

DROP TABLE IF EXISTS `datenblattberlin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datenblattberlin` (
  `PS_DatenblattBerlinID` int(6) NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` mediumint(8) unsigned NOT NULL,
  `Name` varchar(510) NOT NULL,
  `Inventarnummer` varchar(255) NOT NULL,
  `Autor` varchar(255) NOT NULL,
  `Herkunft_Berlin` text NOT NULL,
  `Masze` text NOT NULL,
  `MaterialTechnik` text NOT NULL,
  `Erhaltung_Berlin` text NOT NULL,
  `Ergaenzungen` text NOT NULL,
  `Inschrift` text NOT NULL,
  `InventareArchivalien` text NOT NULL,
  `Kataloge` text NOT NULL,
  `Literatur` text NOT NULL,
  `Beschreibung_Berlin` text NOT NULL,
  `Datierung` text NOT NULL,
  `Interpretation` text NOT NULL,
  `Rezeption` text NOT NULL,
  `Standort` text NOT NULL,
  `DatensatzGruppeDatenblattberlin` varchar(255) NOT NULL DEFAULT 'Berlin',
  `DateinameBerlin` varchar(255) NOT NULL,
  `ArachneTyp` varchar(255) NOT NULL,
  `searchLink` varchar(255) NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_DatenblattBerlinID`),
  UNIQUE KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `DatensatzGruppeDatenblattberlin` (`DatensatzGruppeDatenblattberlin`),
  KEY `Inventarnummer` (`Inventarnummer`)
) ENGINE=InnoDB AUTO_INCREMENT=3543 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `datenblattberlin_inschrift`
--

DROP TABLE IF EXISTS `datenblattberlin_inschrift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datenblattberlin_inschrift` (
  `PS_DatenblattBerlinInschriftID` int(10) NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` mediumint(8) unsigned NOT NULL,
  `Inschrift_Anbringungsort` text NOT NULL,
  `Inschrift_Besonderheiten` text NOT NULL,
  `Inschrift_Buchstabenhoehe` text NOT NULL,
  `Inschrift_Zeilenabstand` text NOT NULL,
  `Inschrift_Interpunktion` text NOT NULL,
  `Inschrift_Wortlaut` text NOT NULL,
  `Inschrift_kritApparat` text NOT NULL,
  `Inschrift_Uebersetzung` text NOT NULL,
  `Inschrift_Literatur` text NOT NULL,
  `Inschrift_Kommentar` text NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_DatenblattBerlinInschriftID`),
  UNIQUE KEY `FS_ObjektID` (`FS_ObjektID`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `datierung`
--

DROP TABLE IF EXISTS `datierung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datierung` (
  `PS_DatierungID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_LiteraturzitatID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_PersonID` mediumint(8) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BefundID` mediumint(8) DEFAULT NULL,
  `FS_FabricID` mediumint(8) DEFAULT NULL,
  `FS_MorphologyID` mediumint(8) DEFAULT NULL,
  `FS_FabricDescriptionID` mediumint(8) DEFAULT NULL,
  `FS_MainAbstractID` mediumint(8) DEFAULT NULL,
  `FS_GruppierungID` mediumint(8) unsigned DEFAULT NULL,
  `FS_IsolatedSherdID` int(11) DEFAULT NULL,
  `AnfDatJt` varchar(255) DEFAULT NULL,
  `AnfDatJh` varchar(255) DEFAULT NULL,
  `AnfDatvn` varchar(255) DEFAULT NULL,
  `AnfDatZeitraum` varchar(255) DEFAULT NULL,
  `AnfEpoche` varchar(255) DEFAULT NULL,
  `AnfKultur` varchar(255) DEFAULT NULL,
  `AnfPraezise` varchar(255) DEFAULT NULL,
  `AnfTerminus` varchar(255) DEFAULT NULL,
  `Argument` text,
  `DatVorschlagAutor` text,
  `DatVorschlagZeit` text,
  `EndEpoche` varchar(255) DEFAULT NULL,
  `EndKultur` varchar(255) DEFAULT NULL,
  `EndDatJt` varchar(255) DEFAULT NULL,
  `EndDatJh` varchar(255) DEFAULT NULL,
  `EndDatvn` varchar(255) DEFAULT NULL,
  `EndDatZeitraum` varchar(255) DEFAULT NULL,
  `EndPraezise` varchar(255) DEFAULT NULL,
  `EndTerminus` varchar(255) DEFAULT NULL,
  `FestDat` varchar(255) DEFAULT NULL,
  `KommentarDat` text,
  `nachantik` varchar(255) DEFAULT NULL,
  `TypDatierung` varchar(255) DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetDatierung` varchar(256) NOT NULL DEFAULT 'datierung',
  `Ursprungsinformationen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_DatierungID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `FS_GruppierungID` (`FS_GruppierungID`),
  KEY `FS_IsolatedSherdID` (`FS_IsolatedSherdID`),
  KEY `FS_BefundID` (`FS_BefundID`),
  KEY `FS_FabricID` (`FS_FabricID`),
  KEY `FS_MorphologyID` (`FS_MorphologyID`),
  KEY `FS_FabricDescriptionID` (`FS_FabricDescriptionID`),
  KEY `FS_MainAbstractID` (`FS_MainAbstractID`),
  KEY `AnfDatJt` (`AnfDatJt`),
  KEY `AnfDatJh` (`AnfDatJh`),
  KEY `AnfDatvn` (`AnfDatvn`),
  KEY `AnfDatZeitraum` (`AnfDatZeitraum`),
  KEY `AnfEpoche` (`AnfEpoche`),
  KEY `AnfPraezise` (`AnfPraezise`),
  KEY `AnfTerminus` (`AnfTerminus`),
  KEY `EndEpoche` (`EndEpoche`),
  KEY `EndDatJt` (`EndDatJt`),
  KEY `EndDatJh` (`EndDatJh`),
  KEY `EndDatvn` (`EndDatvn`),
  KEY `EndDatZeitraum` (`EndDatZeitraum`),
  KEY `EndPraezise` (`EndPraezise`),
  KEY `EndTerminus` (`EndTerminus`),
  KEY `FestDat` (`FestDat`),
  KEY `nachantik` (`nachantik`),
  KEY `TypDatierung` (`TypDatierung`),
  KEY `Argument` (`Argument`(255)),
  KEY `DatVorschlagAutor` (`DatVorschlagAutor`(255)),
  KEY `DatVorschlagZeit` (`DatVorschlagZeit`(255)),
  KEY `KommentarDat` (`KommentarDat`(255)),
  KEY `Ursprungsinformationen` (`Ursprungsinformationen`),
  KEY `AnfKultur` (`AnfKultur`) USING BTREE,
  CONSTRAINT `datierung_ibfk_1` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_10` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_11` FOREIGN KEY (`FS_BuchID`) REFERENCES `buch` (`PS_BuchID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_12` FOREIGN KEY (`FS_BuchseiteID`) REFERENCES `buchseite` (`PS_BuchseiteID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_13` FOREIGN KEY (`FS_InschriftID`) REFERENCES `inschrift` (`PS_InschriftID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_3` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_4` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_5` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_6` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_7` FOREIGN KEY (`FS_TypusID`) REFERENCES `typus` (`PS_TypusID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_8` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datierung_ibfk_9` FOREIGN KEY (`FS_BauwerksteilID`) REFERENCES `bauwerksteil` (`PS_BauwerksteilID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=176903 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_datierung` BEFORE INSERT ON `datierung` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDDatierung` AFTER DELETE ON `datierung` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `Key`, `oaipmhsetDeletedRecords`) VALUES ('datierung', OLD.`PS_DatierungID`, OLD.`oaipmhsetDatierung`);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `deleted_records`
--

DROP TABLE IF EXISTS `deleted_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deleted_records` (
  `PS_DeletedRecordsID` int(11) NOT NULL AUTO_INCREMENT,
  `Kategorie` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Key` int(11) DEFAULT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetDeletedRecords` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`PS_DeletedRecordsID`)
) ENGINE=MyISAM AUTO_INCREMENT=1014214 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `einschluss`
--

DROP TABLE IF EXISTS `einschluss`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `einschluss` (
  `PS_EinschlussID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `PS_FMPEinschlussID` mediumint(9) NOT NULL DEFAULT '-1',
  `FS_FabricDescriptionID` mediumint(9) DEFAULT NULL,
  `Haeufigkeit` varchar(256) DEFAULT NULL,
  `DurchschnittlicheGroesse` varchar(256) DEFAULT NULL,
  `Verteilung` varchar(256) DEFAULT NULL,
  `Form` varchar(256) DEFAULT NULL,
  `Opacity` varchar(256) DEFAULT NULL,
  `Einschlussart` varchar(256) DEFAULT NULL,
  `ColourFreeVon` varchar(256) DEFAULT NULL,
  `ColourFreeBis` varchar(256) DEFAULT NULL,
  `ColourQualifierVon` varchar(256) DEFAULT NULL,
  `ColourQualifierBis` varchar(256) DEFAULT NULL,
  `DatensatzGruppeEinschluss` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_EinschlussID`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `export_prometheus`
--

DROP TABLE IF EXISTS `export_prometheus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `export_prometheus` (
  `PS_PrometheusExportID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` int(10) unsigned NOT NULL DEFAULT '0',
  `Aufbewahrung` text NOT NULL,
  `Benennung` text NOT NULL,
  `Beschreibung` text NOT NULL,
  `Datierung` text NOT NULL,
  `Erhaltung` text NOT NULL,
  `Fotodaten` text NOT NULL,
  `Fundort` text NOT NULL,
  `Funktionen` text NOT NULL,
  `Gattung` text NOT NULL,
  `Herkunft` text NOT NULL,
  `KunsthistorischeEinordnung` text NOT NULL,
  `Literaturangaben` text NOT NULL,
  `Metasuche` text NOT NULL,
  `Reproduktionbeschreibung` text NOT NULL,
  `MARBilderPfad` text NOT NULL,
  PRIMARY KEY (`PS_PrometheusExportID`)
) ENGINE=MyISAM AUTO_INCREMENT=66823 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fabric`
--

DROP TABLE IF EXISTS `fabric`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fabric` (
  `PS_FabricID` int(11) NOT NULL AUTO_INCREMENT,
  `PS_FMPFabricID` mediumint(9) NOT NULL DEFAULT '-1',
  `Name` varchar(256) DEFAULT NULL,
  `CommonName` varchar(256) DEFAULT NULL,
  `Origin` varchar(128) DEFAULT NULL,
  `Comments` text,
  `DatensatzGruppeFabric` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_FabricID`)
) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `createEntityIDFabric` AFTER INSERT ON `fabric` FOR EACH ROW BEGIN 
INSERT INTO  `arachneentityidentification` 
SET  `arachneentityidentification`.`TableName`='fabric', `arachneentityidentification`.`ForeignKey` = NEW.`PS_FabricID` ;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `DeleteFabricConnections` AFTER DELETE ON `fabric` FOR EACH ROW BEGIN
DELETE FROM `fabricdescription` WHERE `fabricdescription`.`FS_FabricID` = OLD.`PS_FabricID`;
DELETE FROM `datierung` WHERE `datierung`.`FS_FabricID` = OLD.`PS_FabricID`;
DELETE FROM `ortsbezug` WHERE `ortsbezug`.`FS_FabricID` = OLD.`PS_FabricID`;
DELETE FROM `marbilder` WHERE `marbilder`.`FS_FabricID` = OLD.`PS_FabricID`;
UPDATE `mainabstract` SET `FS_FabricID` = NULL WHERE `mainabstract`.`FS_FabricID` = OLD.`PS_FabricID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `fabricdescription`
--

DROP TABLE IF EXISTS `fabricdescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fabricdescription` (
  `PS_FabricDescriptionID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ColourFreeBis` varchar(64) DEFAULT NULL,
  `BasedOnSherdID` varchar(256) DEFAULT NULL,
  `FS_FabricID` mediumint(9) NOT NULL,
  `PS_FMPFabricDescriptionID` mediumint(9) NOT NULL DEFAULT '-1',
  `ColourOfBreakVon` varchar(256) DEFAULT NULL,
  `ColourOfBreakMunsellVon` varchar(128) DEFAULT NULL,
  `ColourOfBreakMunsellBis` varchar(128) DEFAULT NULL,
  `ColourOfCoreVon` varchar(256) DEFAULT NULL,
  `ColourOfCoreMunsellVon` varchar(128) DEFAULT NULL,
  `ColourOfCoreMunsellBis` varchar(128) DEFAULT NULL,
  `ColourOfOutsideVon` varchar(256) DEFAULT NULL,
  `ColourOfOutsideMunsellVon` varchar(128) DEFAULT NULL,
  `ColourOfOutsideMunsellBis` varchar(128) DEFAULT NULL,
  `Zoning` varchar(128) DEFAULT NULL,
  `Manufacture` varchar(256) DEFAULT NULL,
  `Hardness` varchar(256) DEFAULT NULL,
  `Fracture` varchar(256) DEFAULT NULL,
  `Porosity` varchar(256) DEFAULT NULL,
  `Comments` text,
  `ColourOfBreakBis` varchar(256) DEFAULT NULL,
  `ColourOfCoreBis` varchar(256) DEFAULT NULL,
  `ColourOfOutsideBis` varchar(256) DEFAULT NULL,
  `ColourOfBreakQualifierVon` varchar(256) DEFAULT NULL,
  `ColourOfBreakQualifierBis` varchar(256) DEFAULT NULL,
  `ColourOfCoreQualifierVon` varchar(256) DEFAULT NULL,
  `ColourOfCoreQualifierBis` varchar(256) DEFAULT NULL,
  `ColourOfOutsideQualifierVon` varchar(256) DEFAULT NULL,
  `ColourOfOutsideQualifierBis` varchar(256) DEFAULT NULL,
  `InclusionsVisible` varchar(64) DEFAULT NULL,
  `Condition` varchar(64) DEFAULT NULL,
  `SurfaceFeel` varchar(64) DEFAULT NULL,
  `ColourFreeVon` varchar(64) DEFAULT NULL,
  `ColourQualifierBis` varchar(64) DEFAULT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ColourMunsellVon` varchar(128) DEFAULT NULL,
  `ColourMunsellBis` varchar(128) DEFAULT NULL,
  `DatensatzGruppeFabricdescription` varchar(128) NOT NULL DEFAULT 'ceramalex',
  PRIMARY KEY (`PS_FabricDescriptionID`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `DeleteFabricDescriptionConnections` AFTER DELETE ON `fabricdescription` FOR EACH ROW BEGIN
DELETE FROM `einschluss` WHERE `einschluss`.`FS_FabricDescriptionID` = OLD.`PS_FabricDescriptionID`;
DELETE FROM `datierung` WHERE `datierung`.`FS_FabricDescriptionID` = OLD.`PS_FabricDescriptionID`;
DELETE FROM `marbilder` WHERE `marbilder`.`FS_FabricDescriptionID` = OLD.`PS_FabricDescriptionID`;
DELETE FROM `ortsbezug` WHERE `ortsbezug`.`FS_FabricDescriptionID` = OLD.`PS_FabricDescriptionID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `fb_fotothek`
--

DROP TABLE IF EXISTS `fb_fotothek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fb_fotothek` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `kurz_name` varchar(255) NOT NULL,
  `lang_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `willkommen_text` longtext,
  `willkommen_text_en` longtext COMMENT 'optional',
  `bild_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fb_hauptkategorie`
--

DROP TABLE IF EXISTS `fb_hauptkategorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fb_hauptkategorie` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `beschreibung` longtext NOT NULL,
  `beschreibung_en` longtext NOT NULL COMMENT 'optional',
  `bild_url` varchar(255) NOT NULL,
  `fotothek_id` bigint(20) NOT NULL,
  `titel` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK50AF95821A6A0601` (`fotothek_id`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fb_link`
--

DROP TABLE IF EXISTS `fb_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fb_link` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `FS_MARBilderID` int(11) DEFAULT NULL,
  `FS_ObjektID` int(11) DEFAULT NULL,
  `FS_BauwerkID` int(11) DEFAULT NULL,
  `FS_ReproduktionID` int(11) DEFAULT NULL,
  `Kurzbeschreibung` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fotoabzug`
--

DROP TABLE IF EXISTS `fotoabzug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fotoabzug` (
  `PS_FotoabzugID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `AnzahlFotos` varchar(255) NOT NULL DEFAULT '',
  `BemerkungenFoto` text NOT NULL,
  `EntleihungAn` varchar(255) NOT NULL DEFAULT '',
  `EntleihungDatum` varchar(255) NOT NULL DEFAULT '',
  `EntleihungFoto` text NOT NULL,
  `EntleihungZurueck` varchar(255) NOT NULL DEFAULT '',
  `FotoDesiderat` text NOT NULL,
  `Fotofirma` varchar(255) NOT NULL DEFAULT '',
  `FotoNrExtern` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_FotoabzugID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `FotoNrExtern` (`FotoNrExtern`),
  KEY `EntleihungAn` (`EntleihungAn`),
  KEY `EntleihungDatum` (`EntleihungDatum`),
  KEY `EntleihungFoto` (`EntleihungFoto`(255)),
  KEY `Fotofirma` (`Fotofirma`)
) ENGINE=InnoDB AUTO_INCREMENT=46170 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `geonames`
--

DROP TABLE IF EXISTS `geonames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geonames` (
  `geonameid` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(200) NOT NULL DEFAULT '',
  `ansiname` varchar(200) NOT NULL DEFAULT '',
  `alternatenames` varchar(2000) NOT NULL DEFAULT '',
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  `feature_class` char(1) DEFAULT NULL,
  `feature_code` varchar(10) DEFAULT NULL,
  `country_code` char(2) DEFAULT NULL,
  `cc2` varchar(60) DEFAULT NULL,
  `admin1_code` varchar(20) DEFAULT '',
  `admin2_code` varchar(80) DEFAULT '',
  `admin3_code` varchar(20) DEFAULT '',
  `admin4_code` varchar(20) DEFAULT '',
  `population` bigint(11) DEFAULT '0',
  `elevation` int(11) DEFAULT '0',
  `gtopo30` int(11) DEFAULT '0',
  `timezone` varchar(40) DEFAULT NULL,
  `modification_date` date DEFAULT '2000-01-01',
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`geonameid`),
  KEY `name` (`name`),
  KEY `last_modified` (`last_modified`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `geonamesAlternatename`
--

DROP TABLE IF EXISTS `geonamesAlternatename`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geonamesAlternatename` (
  `alternatenameId` int(11) NOT NULL,
  `geonameid` int(11) DEFAULT NULL,
  `isoLanguage` varchar(7) DEFAULT NULL,
  `alternateName` varchar(200) DEFAULT NULL,
  `isPreferredName` tinyint(1) DEFAULT NULL,
  `isShortName` tinyint(1) DEFAULT NULL,
  `isColloquial` tinyint(1) DEFAULT NULL,
  `isHistoric` tinyint(1) DEFAULT NULL,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`alternatenameId`),
  KEY `geonameid` (`geonameid`),
  KEY `isoLanguage` (`isoLanguage`),
  KEY `alternateName` (`alternateName`),
  KEY `last_modified` (`last_modified`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `geonamesCountries`
--

DROP TABLE IF EXISTS `geonamesCountries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geonamesCountries` (
  `code` char(2) CHARACTER SET utf8 NOT NULL COMMENT 'Two-letter country code (ISO 3166-1 alpha-2)',
  `name` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'English country name',
  `full_name` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'Full English country name',
  `iso3` char(3) CHARACTER SET utf8 NOT NULL COMMENT 'Three-letter country code (ISO 3166-1 alpha-3)',
  `number` smallint(3) unsigned zerofill NOT NULL COMMENT 'Three-digit country number (ISO 3166-1 numeric)',
  `continent_code` char(2) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`code`),
  KEY `continent_code` (`continent_code`),
  KEY `name` (`name`),
  KEY `full_name` (`full_name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gruppen`
--

DROP TABLE IF EXISTS `gruppen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gruppen` (
  `PS_GruppenID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeGruppen` varchar(255) NOT NULL DEFAULT 'Arachne',
  `AdressatGruppen` text NOT NULL,
  `alternativeBezeichnung` text NOT NULL,
  `AntikeSchriftquellen` text NOT NULL,
  `AnzahlFigurenGruppen` text NOT NULL,
  `ArbeitsnotizGruppen` varchar(255) NOT NULL DEFAULT '',
  `ArchaeologZeugnisse` text NOT NULL,
  `ArtDerGruppe` text NOT NULL,
  `Aufbau` text NOT NULL,
  `Aufstellungskontext` text NOT NULL,
  `AuftraggeberGruppen` text NOT NULL,
  `BearbeiterGruppen` text NOT NULL,
  `FunktionGruppen` text NOT NULL,
  `KorrektorGruppen` text NOT NULL,
  `Nachweise` text NOT NULL,
  `KurzbeschreibungGruppen` text NOT NULL,
  `ThemaInWorten` text NOT NULL,
  `ThematikGruppen` text NOT NULL,
  `ZugehoerigeFiguren` text NOT NULL,
  `Zusammengehoerigkeit` text NOT NULL,
  `ThematikMenschen` text NOT NULL,
  `GruppenArtErwerb` varchar(255) NOT NULL,
  `GruppenErwerbUmstand` varchar(255) NOT NULL,
  `GruppenErwerbDatum` varchar(255) NOT NULL,
  `GruppenPreis` varchar(255) NOT NULL,
  `FundstaatGruppen` varchar(255) NOT NULL,
  `FundortGruppen` text NOT NULL,
  `FundkontextGruppen` text NOT NULL,
  `FunddatumGruppen` varchar(255) NOT NULL,
  `HerkunftGruppen` text NOT NULL,
  `HerkFundKommentarGruppen` text NOT NULL,
  `BerlinObjekt` text NOT NULL,
  `BerlinDatenblattGruppen` varchar(255) NOT NULL,
  `BerlinInventar` varchar(255) NOT NULL,
  `KatalogbearbeitungGruppen` varchar(255) NOT NULL,
  `KatalogtextGruppen` text NOT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetGruppen` varchar(256) NOT NULL DEFAULT 'gruppen',
  PRIMARY KEY (`PS_GruppenID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `DatensatzGruppeGruppen` (`DatensatzGruppeGruppen`),
  KEY `KurzbeschreibungGruppen` (`KurzbeschreibungGruppen`(255))
) ENGINE=InnoDB AUTO_INCREMENT=411213 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_gruppen` BEFORE INSERT ON `gruppen` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_gruppen` AFTER INSERT ON `gruppen` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='gruppen', `arachneentityidentification`.`ForeignKey`=NEW.`PS_GruppenID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDGruppen` AFTER DELETE ON `gruppen` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('gruppen', OLD.`PS_GruppenID`, OLD.`oaipmhsetGruppen`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_GruppenID` AND `arachneentityidentification`.`TableName` = 'gruppen';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `gruppenrekonstruktion`
--

DROP TABLE IF EXISTS `gruppenrekonstruktion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gruppenrekonstruktion` (
  `PS_GruppenrekonstruktionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `Gruppenname` varchar(255) NOT NULL DEFAULT '',
  `KurzbeschreibungGruppenrekonstruktion` varchar(255) NOT NULL DEFAULT '',
  `Begruendung` text NOT NULL,
  `Vorschlagsnummer` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`PS_GruppenrekonstruktionID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  CONSTRAINT `gruppenrekonstruktion_ibfk_1` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gruppenteilnehmer`
--

DROP TABLE IF EXISTS `gruppenteilnehmer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gruppenteilnehmer` (
  `PS_GruppenteilnehmerID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_GruppenrekonstruktionID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_GruppenteilnehmerID`),
  KEY `FS_GruppenrekonstruktionID` (`FS_GruppenrekonstruktionID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  CONSTRAINT `gruppenteilnehmer_ibfk_1` FOREIGN KEY (`FS_GruppenrekonstruktionID`) REFERENCES `gruppenrekonstruktion` (`PS_GruppenrekonstruktionID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28568 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gruppenzugruppen`
--

DROP TABLE IF EXISTS `gruppenzugruppen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gruppenzugruppen` (
  `PS_GruppenzugruppenID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_Gruppen1ID` int(10) unsigned DEFAULT NULL,
  `FS_Gruppen2ID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_GruppenzugruppenID`),
  KEY `FS_Gruppen1ID` (`FS_Gruppen1ID`),
  KEY `FS_Gruppen2ID` (`FS_Gruppen2ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1141 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gruppierung`
--

DROP TABLE IF EXISTS `gruppierung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gruppierung` (
  `PS_GruppierungID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `DatensatzGruppeGruppierung` varchar(255) NOT NULL DEFAULT 'Arachne',
  `KurzbeschreibungGruppierung` varchar(255) NOT NULL,
  `BeschreibungGruppierung` text NOT NULL,
  `Autoritaet` varchar(255) NOT NULL,
  `InhaltlicheKategorie` varchar(255) NOT NULL COMMENT 'Werteliste ID 410',
  `AntikeTextquelle` text NOT NULL,
  `BearbeiterGruppierung` text NOT NULL,
  `ArbeitsnotizGruppierung` varchar(255) NOT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetGruppierung` varchar(255) NOT NULL DEFAULT 'gruppierung',
  PRIMARY KEY (`PS_GruppierungID`),
  KEY `DatensatzGruppeGruppierung` (`DatensatzGruppeGruppierung`),
  KEY `KurzbeschreibungGruppierung` (`KurzbeschreibungGruppierung`)
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_gruppierung` BEFORE INSERT ON `gruppierung` FOR EACH ROW BEGIN
             SET NEW.creation = NOW();
       END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_gruppierung` AFTER INSERT ON `gruppierung` FOR EACH ROW BEGIN
INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='gruppierung', `arachneentityidentification`.`ForeignKey`=NEW.`PS_GruppierungID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDGruppierung` AFTER DELETE ON `gruppierung` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`) VALUES ('gruppierung', OLD.`PS_GruppierungID`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_GruppierungID` AND `arachneentityidentification`.`TableName` = 'gruppierung';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `gruppierungszuordnung`
--

DROP TABLE IF EXISTS `gruppierungszuordnung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gruppierungszuordnung` (
  `PS_GruppierungszuordnungID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `FS_GruppierungID` mediumint(8) unsigned NOT NULL,
  `FS_PersonID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_MARBilderID` int(10) unsigned DEFAULT NULL,
  `FS_MarbilderbestandID` int(10) unsigned DEFAULT NULL,
  `Kommentar` text,
  `Ersteller` int(10) NOT NULL COMMENT 'Fremdschlüssel vewaltung_benutzer.uid',
  `Zuordnungstyp` varchar(255) NOT NULL COMMENT 'Werteliste ID 408',
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  PRIMARY KEY (`PS_GruppierungszuordnungID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_GruppierungID` (`FS_GruppierungID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_MARBilderID` (`FS_MARBilderID`),
  KEY `FS_MARBilderbestandID` (`FS_MarbilderbestandID`),
  KEY `Ersteller` (`Ersteller`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  CONSTRAINT `gruppierungszuordnung_ibfk_1` FOREIGN KEY (`FS_GruppierungID`) REFERENCES `gruppierung` (`PS_GruppierungID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_10` FOREIGN KEY (`FS_RealienID`) REFERENCES `realien` (`PS_RealienID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_11` FOREIGN KEY (`FS_ReliefID`) REFERENCES `relief` (`PS_ReliefID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_12` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_13` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_14` FOREIGN KEY (`FS_SammlungenID`) REFERENCES `sammlungen` (`PS_SammlungenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_15` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_16` FOREIGN KEY (`FS_MARBilderID`) REFERENCES `marbilder_bkp-2013-09-07_2` (`PS_MARBilderID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_17` FOREIGN KEY (`FS_MarbilderbestandID`) REFERENCES `marbilderbestand` (`PS_MarbilderbestandID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_18` FOREIGN KEY (`Ersteller`) REFERENCES `verwaltung_benutzer` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `gruppierungszuordnung_ibfk_19` FOREIGN KEY (`FS_BauwerksteilID`) REFERENCES `bauwerksteil` (`PS_BauwerksteilID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_2` FOREIGN KEY (`FS_PersonID`) REFERENCES `person` (`PS_PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_3` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_4` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_5` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_6` FOREIGN KEY (`FS_TypusID`) REFERENCES `typus` (`PS_TypusID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_7` FOREIGN KEY (`FS_InschriftID`) REFERENCES `inschrift` (`PS_InschriftID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_8` FOREIGN KEY (`FS_BuchID`) REFERENCES `buch` (`PS_BuchID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gruppierungszuordnung_ibfk_9` FOREIGN KEY (`FS_BuchseiteID`) REFERENCES `buchseite` (`PS_BuchseiteID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=883 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_gruppierungzuordnung` BEFORE INSERT ON `gruppierungszuordnung` FOR EACH ROW BEGIN
             SET NEW.creation = NOW();
       END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `individualvessel`
--

DROP TABLE IF EXISTS `individualvessel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `individualvessel` (
  `PS_IndividualVesselID` int(9) NOT NULL AUTO_INCREMENT,
  `PS_FMPIndividualVesselID` int(9) NOT NULL DEFAULT '-1',
  `FS_MainAbstractID` int(9) NOT NULL,
  `InventoryNumber` varchar(256) DEFAULT NULL,
  `RimCount` smallint(6) DEFAULT NULL,
  `HandleCount` smallint(6) DEFAULT NULL,
  `BaseCount` smallint(6) DEFAULT NULL,
  `BodySherdCount` smallint(6) DEFAULT NULL,
  `OthersCount` smallint(6) DEFAULT NULL,
  `Height` float(10,2) DEFAULT NULL,
  `Width` float(10,2) DEFAULT NULL,
  `LengthSize` float(10,2) DEFAULT NULL,
  `Thickness` float(10,2) DEFAULT NULL,
  `BaseDiameter` float(10,2) DEFAULT NULL,
  `RimDiameter` float(10,2) DEFAULT NULL,
  `WidestDiameter` float(10,2) DEFAULT NULL,
  `Volume` float(10,2) DEFAULT NULL,
  `Joins` smallint(6) DEFAULT NULL,
  `RimPercentage` smallint(6) DEFAULT NULL,
  `DatensatzGruppeIndividualvessel` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_IndividualVesselID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inschrift`
--

DROP TABLE IF EXISTS `inschrift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inschrift` (
  `PS_InschriftID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `Inschrift` text NOT NULL,
  `InschriftOhneKlammern` text NOT NULL,
  `Sprache` varchar(255) NOT NULL DEFAULT '',
  `KommentarInschrift` text NOT NULL,
  `Uebersetzung` text NOT NULL,
  `Corpus` varchar(255) NOT NULL DEFAULT '',
  `Publikation` varchar(255) NOT NULL DEFAULT '',
  `LiteraturMatched` tinyint(1) DEFAULT '0',
  `KorrektorInschrift` varchar(255) NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetInschrift` varchar(255) NOT NULL DEFAULT 'inschrift',
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `DatensatzGruppeInschrift` varchar(255) NOT NULL DEFAULT 'Arachne',
  `needsLiterature` tinyint(1) DEFAULT '0',
  `ArbeitsnotizInschrift` varchar(255) NOT NULL,
  `BearbeiterInschrift` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`PS_InschriftID`),
  KEY `DatensatzGruppeInschrift` (`DatensatzGruppeInschrift`),
  KEY `Inschrift` (`Inschrift`(255)),
  KEY `Sprache` (`Sprache`)
) ENGINE=InnoDB AUTO_INCREMENT=9011482 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_inschrift` BEFORE INSERT ON `inschrift` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_inschrift` AFTER INSERT ON `inschrift` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='inschrift', `arachneentityidentification`.`ForeignKey`=NEW.`PS_InschriftID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDInschrift` AFTER DELETE ON `inschrift` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('inschrift', OLD.`PS_InschriftID`, OLD.`oaipmhsetInschrift`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_InschriftID` AND `arachneentityidentification`.`TableName` = 'inschrift';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `inschriftobjekte`
--

DROP TABLE IF EXISTS `inschriftobjekte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inschriftobjekte` (
  `PS_InschriftobjekteID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `FS_InschriftID` mediumint(8) unsigned NOT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `BeziehungKommentar` text,
  PRIMARY KEY (`PS_InschriftobjekteID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  CONSTRAINT `inschriftobjekte_ibfk_1` FOREIGN KEY (`FS_InschriftID`) REFERENCES `inschrift` (`PS_InschriftID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_10` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_11` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_12` FOREIGN KEY (`FS_TypusID`) REFERENCES `typus` (`PS_TypusID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_13` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_14` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_2` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_3` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_4` FOREIGN KEY (`FS_ReliefID`) REFERENCES `relief` (`PS_ReliefID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_8` FOREIGN KEY (`FS_BauwerksteilID`) REFERENCES `bauwerksteil` (`PS_BauwerksteilID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inschriftobjekte_ibfk_9` FOREIGN KEY (`FS_RealienID`) REFERENCES `realien` (`PS_RealienID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21372 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `isolatedsherd`
--

DROP TABLE IF EXISTS `isolatedsherd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `isolatedsherd` (
  `PS_IsolatedSherdID` int(11) NOT NULL AUTO_INCREMENT,
  `PS_FMPIsolatedSherdID` int(11) NOT NULL DEFAULT '-1',
  `FS_MainAbstractID` int(11) DEFAULT NULL,
  `FS_IndividualVesselID` int(11) DEFAULT NULL,
  `SherdType` varchar(128) DEFAULT NULL,
  `Diameter` varchar(64) DEFAULT NULL,
  `InventoryNumber` varchar(128) DEFAULT NULL,
  `NitonAnalysisID` varchar(256) DEFAULT NULL,
  `Height` float(10,2) DEFAULT NULL,
  `Width` float(10,2) DEFAULT NULL,
  `LengthSize` float(10,2) DEFAULT NULL,
  `Thickness` float(10,2) DEFAULT NULL,
  `Weight` float(10,2) DEFAULT NULL,
  `RimPercentage` float(10,2) DEFAULT NULL,
  `DatensatzGruppeIsolatedsherd` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_IsolatedSherdID`)
) ENGINE=InnoDB AUTO_INCREMENT=3278 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kontextbereich`
--

DROP TABLE IF EXISTS `kontextbereich`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kontextbereich` (
  `PS_KontextbereichID` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `Projekt` varchar(255) NOT NULL,
  `Zielprojekt` varchar(255) NOT NULL,
  `FS_StrukturfeldID` int(10) unsigned DEFAULT NULL,
  `FS_StrukturfeldID_Ziel` int(10) unsigned DEFAULT NULL,
  `FS_StrukturfeldID_Anzeige` int(10) unsigned DEFAULT NULL,
  `Gruppierung` varchar(255) DEFAULT NULL,
  `Titel` varchar(255) DEFAULT NULL,
  `Operator` varchar(10) NOT NULL DEFAULT '=',
  `Trennzeichen` varchar(10) DEFAULT NULL,
  `Hilfetext` text,
  `order` tinyint(4) unsigned NOT NULL DEFAULT '100',
  PRIMARY KEY (`PS_KontextbereichID`),
  KEY `Projekt` (`Projekt`),
  KEY `Gruppierung` (`Gruppierung`),
  KEY `FS_StrukturfeldID` (`FS_StrukturfeldID`),
  KEY `FS_StrukturfeldID_Ziel` (`FS_StrukturfeldID_Ziel`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lebewesen`
--

DROP TABLE IF EXISTS `lebewesen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lebewesen` (
  `PS_LebewesenID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `KurzbeschreibungLebewesen` varchar(255) NOT NULL DEFAULT '',
  `KlassifizierungLebewesen` varchar(255) NOT NULL DEFAULT '',
  `BeschreibungLebewesen` varchar(255) NOT NULL DEFAULT '',
  `OrtLebewesen` varchar(255) NOT NULL DEFAULT '',
  `LandLebewesen` varchar(255) NOT NULL DEFAULT '',
  `DatensatzgruppeLebewesen` varchar(255) NOT NULL DEFAULT 'Arachne',
  PRIMARY KEY (`PS_LebewesenID`),
  KEY `DatensatzgruppeLebewesen_2` (`DatensatzgruppeLebewesen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `literatur`
--

DROP TABLE IF EXISTS `literatur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `literatur` (
  `PS_LiteraturID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `ZenonID` varchar(255) DEFAULT NULL,
  `Abkuerzungen` varchar(255) DEFAULT NULL,
  `Auflage` varchar(255) DEFAULT NULL,
  `Band` varchar(255) DEFAULT NULL,
  `DAIRichtlinien` text,
  `Jahr` varchar(255) DEFAULT NULL,
  `A1Nachname` varchar(255) DEFAULT NULL,
  `A2Nachname` varchar(255) DEFAULT NULL,
  `Ort` varchar(255) DEFAULT NULL,
  `Reihe` varchar(255) DEFAULT NULL,
  `Titel` varchar(255) DEFAULT NULL,
  `A1Vorname` varchar(255) DEFAULT NULL,
  `A2Vorname` varchar(255) DEFAULT NULL,
  `H1Vorname` varchar(255) DEFAULT NULL,
  `H2Vorname` varchar(255) DEFAULT NULL,
  `H1Nachname` varchar(255) DEFAULT NULL,
  `H2Nachname` varchar(255) DEFAULT NULL,
  `StichwortSortierung` varchar(255) DEFAULT NULL,
  `EingabeKommentar` varchar(1024) NOT NULL COMMENT 'Kommentar für Eingebende',
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_LiteraturID`),
  KEY `ZenonID` (`ZenonID`),
  KEY `H1Nachname` (`H1Nachname`),
  KEY `A1Nachname` (`A1Nachname`),
  KEY `StichwortSortierung` (`StichwortSortierung`)
) ENGINE=InnoDB AUTO_INCREMENT=22834 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_literatur` BEFORE INSERT ON `literatur` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_literatur` AFTER INSERT ON `literatur` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='literatur', `arachneentityidentification`.`ForeignKey`=NEW.`PS_LiteraturID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDLiteratur` AFTER DELETE ON `literatur` FOR EACH ROW BEGIN
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_LiteraturID` AND `arachneentityidentification`.`TableName` = 'literatur';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `literaturzitat`
--

DROP TABLE IF EXISTS `literaturzitat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `literaturzitat` (
  `PS_LiteraturzitatID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_DatierungID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenrekonstruktionID` int(10) unsigned DEFAULT NULL,
  `FS_LiteraturID` mediumint(8) unsigned DEFAULT NULL,
  `FS_LiteraturAktualisierungID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_WebseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_PersonID` mediumint(8) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BefundID` mediumint(8) DEFAULT NULL,
  `FS_MorphologyID` mediumint(8) DEFAULT NULL,
  `FS_SurfaceTreatmentID` mediumint(8) DEFAULT NULL,
  `FS_GruppierungID` mediumint(8) unsigned DEFAULT NULL,
  `Abbildung` varchar(255) DEFAULT NULL,
  `Anmerkung` text,
  `Beilage` varchar(32) DEFAULT NULL,
  `Figur` varchar(255) DEFAULT NULL,
  `Katnummer` varchar(255) DEFAULT NULL,
  `KommentarLitZitat` text,
  `Seite` varchar(255) DEFAULT NULL,
  `subVoce` varchar(255) DEFAULT NULL,
  `Tafel` varchar(255) DEFAULT NULL,
  `Stichwort` varchar(255) DEFAULT NULL,
  `Corpuszitat` varchar(255) DEFAULT NULL,
  `tempLiteratur` text,
  `tempStichwerk` text,
  `wissTexte` text,
  `Onlinequelle` text,
  `OnlinequelleToDelete` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `AntikeTextquelle` varchar(255) DEFAULT NULL,
  `Textauszug` text,
  `TextauszugUebersetzung` text,
  PRIMARY KEY (`PS_LiteraturzitatID`),
  UNIQUE KEY `FS_LiteraturID_2` (`FS_LiteraturID`,`FS_BauwerkID`,`FS_BauwerksteilID`,`FS_DatierungID`,`FS_GruppenID`,`FS_GruppenrekonstruktionID`,`FS_LiteraturAktualisierungID`,`FS_ObjektID`,`FS_RealienID`,`FS_ReliefID`,`FS_ReproduktionID`,`FS_RezeptionID`,`FS_SammlungenID`,`FS_TopographieID`,`FS_TypusID`,`FS_WebseiteID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_GruppenrekonstruktionID` (`FS_GruppenrekonstruktionID`),
  KEY `FS_LiteraturID` (`FS_LiteraturID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_ToposID` (`FS_TopographieID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_DatierungID` (`FS_DatierungID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_LiteraturAktualisierungID` (`FS_LiteraturAktualisierungID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `FS_GruppierungID` (`FS_GruppierungID`),
  KEY `FS_BefundID` (`FS_BefundID`),
  KEY `FS_MorphologyID` (`FS_MorphologyID`),
  KEY `FS_SurfaceTreatmentID` (`FS_SurfaceTreatmentID`),
  KEY `tempLiteratur` (`tempLiteratur`(255)),
  KEY `FS_WebseiteID` (`FS_WebseiteID`),
  CONSTRAINT `literaturzitat_ibfk_1` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_10` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_11` FOREIGN KEY (`FS_SammlungenID`) REFERENCES `sammlungen` (`PS_SammlungenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_13` FOREIGN KEY (`FS_ReliefID`) REFERENCES `relief` (`PS_ReliefID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_15` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_18` FOREIGN KEY (`FS_LiteraturID`) REFERENCES `literatur` (`PS_LiteraturID`),
  CONSTRAINT `literaturzitat_ibfk_19` FOREIGN KEY (`FS_RealienID`) REFERENCES `realien` (`PS_RealienID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_2` FOREIGN KEY (`FS_DatierungID`) REFERENCES `datierung` (`PS_DatierungID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_20` FOREIGN KEY (`FS_WebseiteID`) REFERENCES `webseite` (`PS_WebseiteID`),
  CONSTRAINT `literaturzitat_ibfk_21` FOREIGN KEY (`FS_PersonID`) REFERENCES `person` (`PS_PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_3` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_4` FOREIGN KEY (`FS_TypusID`) REFERENCES `typus` (`PS_TypusID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_6` FOREIGN KEY (`FS_BauwerksteilID`) REFERENCES `bauwerksteil` (`PS_BauwerksteilID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_7` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_8` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `literaturzitat_ibfk_9` FOREIGN KEY (`FS_GruppenrekonstruktionID`) REFERENCES `gruppenrekonstruktion` (`PS_GruppenrekonstruktionID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=339489 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDLiteraturzitat` AFTER DELETE ON `literaturzitat` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `Key`) VALUES ('literaturzitat', OLD.`PS_LiteraturzitatID`);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `literaturzitat_leftjoin_literatur`
--

DROP TABLE IF EXISTS `literaturzitat_leftjoin_literatur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `literaturzitat_leftjoin_literatur` (
  `PS_LiteraturzitatID` mediumint(8) unsigned NOT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_DatierungID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenrekonstruktionID` int(10) unsigned DEFAULT NULL,
  `FS_LiteraturID` mediumint(8) unsigned DEFAULT NULL,
  `FS_LiteraturAktualisierungID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_WebseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_PersonID` mediumint(8) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BefundID` mediumint(8) DEFAULT NULL,
  `FS_MorphologyID` mediumint(8) DEFAULT NULL,
  `FS_SurfaceTreatmentID` mediumint(8) DEFAULT NULL,
  `FS_GruppierungID` mediumint(8) unsigned DEFAULT NULL,
  `Abbildung` varchar(255) NOT NULL DEFAULT '',
  `Anmerkung` text NOT NULL,
  `Beilage` varchar(32) NOT NULL DEFAULT '',
  `Figur` varchar(255) NOT NULL DEFAULT '',
  `Katnummer` varchar(255) NOT NULL DEFAULT '',
  `KommentarLitZitat` text NOT NULL,
  `Seite` varchar(255) NOT NULL DEFAULT '',
  `subVoce` varchar(255) NOT NULL DEFAULT '',
  `Tafel` varchar(255) NOT NULL DEFAULT '',
  `Stichwort` varchar(255) NOT NULL DEFAULT '',
  `Corpuszitat` varchar(255) NOT NULL,
  `tempLiteratur` text NOT NULL,
  `tempStichwerk` text NOT NULL,
  `wissTexte` text NOT NULL,
  `Onlinequelle` text NOT NULL,
  `OnlinequelleToDelete` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `AntikeTextquelle` varchar(255) DEFAULT NULL,
  `Textauszug` text,
  `TextauszugUebersetzung` text,
  `PS_LiteraturID` mediumint(8) unsigned NOT NULL,
  `ZenonID` varchar(255) DEFAULT NULL,
  `Abkuerzungen` varchar(255) NOT NULL DEFAULT '',
  `Auflage` varchar(255) NOT NULL DEFAULT '',
  `Band` varchar(255) NOT NULL DEFAULT '',
  `DAIRichtlinien` text NOT NULL,
  `Jahr` varchar(255) NOT NULL DEFAULT '',
  `A1Nachname` varchar(255) NOT NULL DEFAULT '',
  `A2Nachname` varchar(255) NOT NULL DEFAULT '',
  `Ort` varchar(255) NOT NULL DEFAULT '',
  `Reihe` varchar(255) NOT NULL DEFAULT '',
  `Titel` varchar(255) NOT NULL DEFAULT '',
  `A1Vorname` varchar(255) NOT NULL DEFAULT '',
  `A2Vorname` varchar(255) NOT NULL DEFAULT '',
  `H1Vorname` varchar(255) NOT NULL DEFAULT '',
  `H2Vorname` varchar(255) NOT NULL DEFAULT '',
  `H1Nachname` varchar(255) NOT NULL DEFAULT '',
  `H2Nachname` varchar(255) NOT NULL DEFAULT '',
  `StichwortSortierung` varchar(255) NOT NULL DEFAULT '',
  `EingabeKommentar` varchar(1024) NOT NULL DEFAULT '',
  `creation` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `PS_LiteraturzitatID` (`PS_LiteraturzitatID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_GruppenrekonstruktionID` (`FS_GruppenrekonstruktionID`),
  KEY `FS_LiteraturID` (`FS_LiteraturID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_WebseitenID` (`FS_WebseiteID`),
  KEY `FS_DatierungID` (`FS_DatierungID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_GebaeudeteilID` (`FS_BauwerksteilID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `FS_GruppierungID` (`FS_GruppierungID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `literaturzitat_pre_datenblattberlin`
--

DROP TABLE IF EXISTS `literaturzitat_pre_datenblattberlin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `literaturzitat_pre_datenblattberlin` (
  `PS_LiteraturzitatID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_DatierungID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenrekonstruktionID` int(10) unsigned DEFAULT NULL,
  `FS_LiteraturID` mediumint(8) unsigned DEFAULT NULL,
  `FS_LiteraturAktualisierungID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_WebseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_PersonID` mediumint(8) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BefundID` mediumint(8) DEFAULT NULL,
  `FS_MorphologyID` mediumint(8) DEFAULT NULL,
  `FS_SurfaceTreatmentID` mediumint(8) DEFAULT NULL,
  `FS_GruppierungID` mediumint(8) unsigned DEFAULT NULL,
  `Abbildung` varchar(255) DEFAULT NULL,
  `Anmerkung` text,
  `Beilage` varchar(32) DEFAULT NULL,
  `Figur` varchar(255) DEFAULT NULL,
  `Katnummer` varchar(255) DEFAULT NULL,
  `KommentarLitZitat` text,
  `Seite` varchar(255) DEFAULT NULL,
  `subVoce` varchar(255) DEFAULT NULL,
  `Tafel` varchar(255) DEFAULT NULL,
  `Stichwort` varchar(255) DEFAULT NULL,
  `Corpuszitat` varchar(255) DEFAULT NULL,
  `tempLiteratur` text,
  `tempStichwerk` text,
  `wissTexte` text,
  `Onlinequelle` text,
  `OnlinequelleToDelete` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `AntikeTextquelle` varchar(255) DEFAULT NULL,
  `Textauszug` text,
  `TextauszugUebersetzung` text,
  PRIMARY KEY (`PS_LiteraturzitatID`),
  UNIQUE KEY `FS_LiteraturID_2` (`FS_LiteraturID`,`FS_BauwerkID`,`FS_BauwerksteilID`,`FS_DatierungID`,`FS_GruppenID`,`FS_GruppenrekonstruktionID`,`FS_LiteraturAktualisierungID`,`FS_ObjektID`,`FS_RealienID`,`FS_ReliefID`,`FS_ReproduktionID`,`FS_RezeptionID`,`FS_SammlungenID`,`FS_TopographieID`,`FS_TypusID`,`FS_WebseiteID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_GruppenrekonstruktionID` (`FS_GruppenrekonstruktionID`),
  KEY `FS_LiteraturID` (`FS_LiteraturID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_ToposID` (`FS_TopographieID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_DatierungID` (`FS_DatierungID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_LiteraturAktualisierungID` (`FS_LiteraturAktualisierungID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `FS_GruppierungID` (`FS_GruppierungID`),
  KEY `FS_BefundID` (`FS_BefundID`),
  KEY `FS_MorphologyID` (`FS_MorphologyID`),
  KEY `FS_SurfaceTreatmentID` (`FS_SurfaceTreatmentID`),
  KEY `tempLiteratur` (`tempLiteratur`(255)),
  KEY `FS_WebseiteID` (`FS_WebseiteID`)
) ENGINE=InnoDB AUTO_INCREMENT=318518 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mainabstract`
--

DROP TABLE IF EXISTS `mainabstract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mainabstract` (
  `PS_MainAbstractID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `PS_FMPMainAbstractID` mediumint(9) NOT NULL DEFAULT '-1',
  `FS_FabricID` mediumint(9) DEFAULT NULL,
  `FS_QuantitiesID` mediumint(9) DEFAULT NULL,
  `FS_MorphologyID` mediumint(9) DEFAULT NULL,
  `FS_BefundID` mediumint(9) DEFAULT NULL,
  `GrabungsinterneTypennummer` varchar(128) DEFAULT NULL,
  `GrabungsinterneTypennummerSub` varchar(128) DEFAULT NULL,
  `DatensatzGruppeMainabstract` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ImportSource` varchar(255) DEFAULT NULL,
  `Editor` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_MainAbstractID`)
) ENGINE=InnoDB AUTO_INCREMENT=38596 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `createEntityIDMainAbstract` AFTER INSERT ON `mainabstract` FOR EACH ROW BEGIN 
INSERT INTO  `arachneentityidentification` 
SET  `arachneentityidentification`.`TableName`='mainabstract', `arachneentityidentification`.`ForeignKey` = NEW.`PS_MainAbstractID` ;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `DeleteMainConnections` AFTER DELETE ON `mainabstract` FOR EACH ROW BEGIN
DELETE FROM `xmorphologyx` WHERE `xmorphologyx`.`FS_MainAbstractID` = OLD.`PS_MainAbstractID`;
DELETE FROM `datierung` WHERE `datierung`.`FS_MainAbstractID` = OLD.`PS_MainAbstractID`;
DELETE FROM `quantities` WHERE `quantities`.`PS_QuantitiesID` = OLD.`FS_QuantitiesID`;
DELETE FROM `xsurfacetreatmentx` WHERE `xsurfacetreatmentx`.`FS_MainAbstractID` = OLD.`PS_MainAbstractID`;
DELETE FROM `individualvessel` WHERE `individualvessel`.`FS_MainAbstractID` = OLD.`PS_MainAbstractID`;
DELETE FROM `isolatedsherd` WHERE `isolatedsherd`.`FS_MainAbstractID` = OLD.`PS_MainAbstractID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `marbilder`
--

DROP TABLE IF EXISTS `marbilder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilder` (
  `PS_MARBilderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReproduktionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenrekonstruktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_OppenheimAlbumID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `FS_FabricID` mediumint(8) unsigned DEFAULT NULL,
  `FS_MorphologyID` mediumint(8) unsigned DEFAULT NULL,
  `FS_FabricDescriptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_MainAbstractID` mediumint(8) unsigned DEFAULT NULL,
  `FS_IsolatedSherdID` mediumint(9) unsigned DEFAULT NULL,
  `DatensatzGruppeMARBilder` varchar(255) NOT NULL DEFAULT 'Arachne',
  `BildrechteGruppe` varchar(255) NOT NULL DEFAULT 'Arachne',
  `Bildausschnitt` varchar(255) DEFAULT NULL,
  `AnsichtObjekt` text,
  `AnsichtTopographie` text,
  `Bildbeschreibung` text,
  `Vorlagenart` varchar(255) DEFAULT NULL,
  `Bemerkung` text,
  `Dateiformat` varchar(255) DEFAULT NULL,
  `Dateigroesse` varchar(255) DEFAULT NULL,
  `erstellt` varchar(255) DEFAULT NULL,
  `FilmNr` varchar(255) DEFAULT NULL,
  `Fotodatum` varchar(255) DEFAULT NULL,
  `Fotograf` varchar(255) DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `geaendert` varchar(255) DEFAULT NULL,
  `Kommentar` varchar(255) DEFAULT NULL,
  `NegativNr` varchar(255) DEFAULT NULL,
  `NegativNrNormalisiert` varchar(255) DEFAULT NULL,
  `DateinameMarbilder` varchar(255) DEFAULT NULL,
  `BestandsnameMarbilder` varchar(255) DEFAULT NULL,
  `Pfad` varchar(255) DEFAULT NULL,
  `PfadNeu` varchar(255) DEFAULT NULL,
  `Scannummer` varchar(255) DEFAULT NULL,
  `Scanquelle` varchar(255) DEFAULT NULL,
  `BildtraegerMarbilder` varchar(255) DEFAULT NULL,
  `Projekttitel` varchar(255) DEFAULT NULL,
  `Visible` varchar(256) NOT NULL DEFAULT 'Arachne',
  `md5sum` varchar(32) DEFAULT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetMarbilder` varchar(256) NOT NULL DEFAULT 'marbilder',
  `Footer` varchar(255) DEFAULT NULL,
  `CMSAlt` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`PS_MARBilderID`),
  UNIQUE KEY `DateinameMarbilder` (`DateinameMarbilder`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_ReproduktionenID` (`FS_ReproduktionID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_GruppenrekonstruktionID` (`FS_GruppenrekonstruktionID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_OppenheimAlbumID` (`FS_OppenheimAlbumID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `DatensatzGruppeMARBilder` (`DatensatzGruppeMARBilder`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `NegativNr` (`NegativNr`),
  KEY `NegativNrNormalisiert` (`NegativNrNormalisiert`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `PfadNeu` (`PfadNeu`),
  KEY `FS_FabricID` (`FS_FabricID`),
  KEY `FS_MorphologyID` (`FS_MorphologyID`),
  KEY `FS_FabricDescriptionID` (`FS_FabricDescriptionID`),
  KEY `FS_MainAbstractID` (`FS_MainAbstractID`),
  KEY `FS_IsolatedSherdID` (`FS_IsolatedSherdID`),
  KEY `Scannummer` (`Scannummer`),
  KEY `erstellt` (`erstellt`),
  KEY `Pfad` (`Pfad`),
  KEY `ProjekttitelMarbilder` (`Projekttitel`),
  KEY `md5sum` (`md5sum`),
  KEY `BestandsnameMarbilder` (`BestandsnameMarbilder`),
  KEY `geaendert` (`geaendert`),
  KEY `FilmNr` (`FilmNr`),
  KEY `Fotograf` (`Fotograf`)
) ENGINE=InnoDB AUTO_INCREMENT=8092222 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_marbilder` AFTER INSERT ON `marbilder`
FOR EACH ROW
INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='marbilder', `arachneentityidentification`.`ForeignKey`=NEW.`PS_MARBilderID` */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`134.95.%`*/ /*!50003 TRIGGER `arachne`.`marbilder_AFTER_DELETE` AFTER DELETE ON `marbilder` FOR EACH ROW
BEGIN
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_MARBilderID` AND `arachneentityidentification`.`TableName` = 'marbilder';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `marbilder_cache`
--

DROP TABLE IF EXISTS `marbilder_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilder_cache` (
  `PS_MarbilderCacheID` int(11) NOT NULL AUTO_INCREMENT,
  `FS_MarbilderID` int(11) NOT NULL,
  `Height` int(11) NOT NULL,
  `Width` int(11) NOT NULL,
  `CachingTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Pfad` varchar(255) DEFAULT NULL,
  `ContainsWatermark` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`PS_MarbilderCacheID`),
  KEY `FS_MarbilderID` (`FS_MarbilderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbilder_deleted`
--

DROP TABLE IF EXISTS `marbilder_deleted`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilder_deleted` (
  `PS_MARBilderdeletedID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_MARBilderID` int(10) unsigned NOT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReproduktionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenrekonstruktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_OppenheimAlbumID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `DatensatzGruppeMARBilder` varchar(255) NOT NULL DEFAULT 'Arachne',
  `Bildausschnitt` varchar(255) DEFAULT NULL,
  `AnsichtObjekt` text,
  `AnsichtTopographie` text,
  `Bildbeschreibung` text,
  `Vorlagenart` varchar(255) DEFAULT NULL,
  `Bemerkung` text,
  `Dateiformat` varchar(255) DEFAULT NULL,
  `Dateigroesse` varchar(255) DEFAULT NULL,
  `erstellt` varchar(255) DEFAULT NULL,
  `FilmNr` varchar(255) DEFAULT NULL,
  `Fotodatum` varchar(255) DEFAULT NULL,
  `Fotograf` varchar(255) DEFAULT NULL,
  `geaendert` varchar(255) DEFAULT NULL,
  `Kommentar` varchar(255) DEFAULT NULL,
  `NegativNr` varchar(255) DEFAULT NULL,
  `NegativNrNormalisiert` varchar(255) DEFAULT NULL,
  `DateinameMarbilder` varchar(255) DEFAULT NULL,
  `BestandsnameMarbilder` varchar(255) DEFAULT NULL,
  `Pfad` varchar(255) DEFAULT NULL,
  `Scannummer` varchar(255) DEFAULT NULL,
  `Scanquelle` varchar(255) DEFAULT NULL,
  `BildtraegerMarbilder` varchar(255) DEFAULT NULL,
  `ProjekttitelMarbilder` varchar(255) DEFAULT NULL,
  `Visible` varchar(256) NOT NULL DEFAULT 'Arachne',
  `md5sum` varchar(32) DEFAULT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetMarbilder` varchar(256) NOT NULL DEFAULT 'marbilder',
  `Footer` varchar(255) DEFAULT NULL,
  `BildrechteGruppe` varchar(255) DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `PfadNeu` varchar(255) DEFAULT NULL,
  `ProjektTitel` varchar(255) DEFAULT NULL,
  `CMSAlt` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`PS_MARBilderdeletedID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_ReproduktionenID` (`FS_ReproduktionID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_GruppenrekonstruktionID` (`FS_GruppenrekonstruktionID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_OppenheimAlbumID` (`FS_OppenheimAlbumID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `DatensatzGruppeMARBilder` (`DatensatzGruppeMARBilder`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `NegativNr` (`NegativNr`),
  KEY `NegativNrNormalisiert` (`NegativNrNormalisiert`),
  KEY `PS_MARBilderID` (`PS_MARBilderID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `DateinameMarbilder` (`DateinameMarbilder`)
) ENGINE=InnoDB AUTO_INCREMENT=368389 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbilderannotation`
--

DROP TABLE IF EXISTS `marbilderannotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilderannotation` (
  `PS_MarbilderannotationID` int(10) NOT NULL AUTO_INCREMENT,
  `FS_MarbilderID` int(10) NOT NULL,
  `Titel` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `NegativNr` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Standstadt` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `AufbewahrungHerkunft` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Beschreibung` text COLLATE utf8_unicode_ci,
  `ArachneID` int(10) DEFAULT NULL,
  `ArachneKategorie` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`PS_MarbilderannotationID`),
  KEY `FS_MarbilderID` (`FS_MarbilderID`)
) ENGINE=InnoDB AUTO_INCREMENT=112609 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbilderbestand`
--

DROP TABLE IF EXISTS `marbilderbestand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilderbestand` (
  `PS_MarbilderbestandID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ArbeitsnotizMARBilderBestand` varchar(255) NOT NULL,
  `DatensatzgruppeMARBilderBestand` varchar(255) NOT NULL DEFAULT 'Arachne',
  `DateinameMarbilderbestand` varchar(255) NOT NULL,
  `Bestandsname` varchar(255) DEFAULT NULL,
  `Standstaat` varchar(255) DEFAULT NULL,
  `Standstadt` varchar(255) DEFAULT NULL,
  `Inventarnummer` varchar(255) DEFAULT NULL,
  `EANummer` varchar(255) DEFAULT NULL,
  `FunddatumMarbilderbestand` varchar(255) DEFAULT NULL,
  `DatierungEpoche` varchar(255) DEFAULT NULL,
  `Fotoabzuege` varchar(255) DEFAULT NULL,
  `Eigentuemer` varchar(255) DEFAULT NULL,
  `DarstellungMarbilderbestand` varchar(255) DEFAULT NULL,
  `Breite` varchar(255) DEFAULT NULL,
  `Hoehe` varchar(255) DEFAULT NULL,
  `Tiefe` varchar(255) DEFAULT NULL,
  `Durchmesser` varchar(255) DEFAULT NULL,
  `MaszeMarbilderbestand` text NOT NULL,
  `Literatur` varchar(255) DEFAULT NULL,
  `AufbewahrungHerkunft` varchar(255) DEFAULT NULL,
  `Aufnahmedatum` varchar(255) DEFAULT NULL,
  `Bildautor` varchar(255) DEFAULT NULL,
  `Beschreibung` text,
  `Kategorie` varchar(255) DEFAULT NULL,
  `Bildnummer` varchar(255) DEFAULT NULL,
  `TitelMarbilderbestand` varchar(255) DEFAULT NULL,
  `TitelMarbilderbestandEN` varchar(255) DEFAULT NULL,
  `AFSPfad` text NOT NULL,
  `SOFSPfad` text NOT NULL,
  `Unterkategorie` varchar(255) DEFAULT NULL,
  `Unterkategorie2` varchar(255) DEFAULT NULL,
  `FS_MarbilderbestandunterkategorieID` int(11) NOT NULL,
  `AlterDateinameMarbilderbestand` varchar(255) DEFAULT NULL,
  `AlteBildnummerMarbilderbestand` varchar(255) DEFAULT NULL,
  `MarbilderbestandPfad` varchar(255) NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `AAArC_Region` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AAArC',
  `AAArC_Fundplatz` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AAArC',
  `Bildinhalt_1` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AAArC',
  `Bildinhalt_2` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AAArC',
  `Bildinhalt_3` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AAArC',
  `Favoritenkennung` varchar(1) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AAArC',
  `ArtDigitalisat` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AAArC',
  `Material` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AAArC',
  `AAArC_Projekt` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AAArC',
  `Gazetteerid` int(11) DEFAULT NULL,
  PRIMARY KEY (`PS_MarbilderbestandID`),
  UNIQUE KEY `DateinameMarbilderbestand` (`DateinameMarbilderbestand`),
  KEY `AlterDateinameMarbilderbestand` (`AlterDateinameMarbilderbestand`,`AlteBildnummerMarbilderbestand`),
  KEY `Unterkategorie` (`Unterkategorie`),
  KEY `Bestandsname` (`Bestandsname`),
  KEY `DatensatzgruppeMARBilderBestand` (`DatensatzgruppeMARBilderBestand`),
  KEY `Gazetteerid` (`Gazetteerid`),
  KEY `Standstaat` (`Standstaat`),
  KEY `Standstadt` (`Standstadt`),
  KEY `AufbewahrungHerkunft` (`AufbewahrungHerkunft`),
  KEY `Aufnahmedatum` (`Aufnahmedatum`),
  KEY `Bildautor` (`Bildautor`),
  KEY `Bildnummer` (`Bildnummer`),
  KEY `Breite` (`Breite`),
  KEY `Hoehe` (`Hoehe`),
  KEY `Tiefe` (`Tiefe`),
  KEY `Durchmesser` (`Durchmesser`),
  KEY `Eigentuemer` (`Eigentuemer`),
  KEY `Fotoabzuege` (`Fotoabzuege`),
  KEY `Kategorie` (`Kategorie`),
  KEY `FunddatumMarbilderbestand` (`FunddatumMarbilderbestand`),
  KEY `Literatur` (`Literatur`),
  KEY `TitelMarbilderbestandEN` (`TitelMarbilderbestandEN`),
  KEY `Beschreibung` (`Beschreibung`(255))
) ENGINE=InnoDB AUTO_INCREMENT=3625382 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbilderbestandunterkategorie`
--

DROP TABLE IF EXISTS `marbilderbestandunterkategorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilderbestandunterkategorie` (
  `PS_MarbilderbestandunterkategorieID` bigint(20) NOT NULL AUTO_INCREMENT,
  `FS_MarbilderbestandunterkategorieID_parent` bigint(20) DEFAULT NULL,
  `Titel` varchar(255) NOT NULL,
  `Anzahl` int(11) DEFAULT NULL,
  `DatensatzgruppeMarbilderbestandunterkategorie` varchar(255) NOT NULL DEFAULT 'Arachne',
  `leaf` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`PS_MarbilderbestandunterkategorieID`),
  KEY `FS_MarbilderbestandunterkategorieID_parent` (`FS_MarbilderbestandunterkategorieID_parent`),
  KEY `DatensatzgruppeMarbilderbestandunterkategorie` (`DatensatzgruppeMarbilderbestandunterkategorie`)
) ENGINE=MyISAM AUTO_INCREMENT=1154621 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbilderdateinamen`
--

DROP TABLE IF EXISTS `marbilderdateinamen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilderdateinamen` (
  `ps_dateinamenid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dateinamen` varchar(255) NOT NULL,
  PRIMARY KEY (`ps_dateinamenid`),
  KEY `dateinamen` (`dateinamen`)
) ENGINE=InnoDB AUTO_INCREMENT=149212 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbilderinventar`
--

DROP TABLE IF EXISTS `marbilderinventar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilderinventar` (
  `PS_InventarID` int(11) NOT NULL AUTO_INCREMENT,
  `01_Titel` text NOT NULL COMMENT 'DAI Kernfeld 01 Titel',
  `02_Bildnummer` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 02 Bildnummer',
  `03_Aufnahmedatum` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 03 Aufnahmedatum',
  `04_Bildautor` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 04 Bildautor',
  `05_Freigabe` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 05 Freigabe',
  `06_Verantwortlichkeit` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 06\r\nVerantwortlichkeit für das Bild',
  `07_Veraenderbarkeit` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 07\r\nVeraenderbarkeit',
  `08_Ortsbezeichnung1` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 08\r\nOrtsbezeichnung 1',
  `09_Ortsbezeichnung2` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 09\r\nOrtsbezeichnung 2 / Unterort',
  `10_Objekt1` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 10 Objekt 1 /\r\nKategorie (index [Arachne-Kategorien] – feststehend und nicht\r\nfortlaufend aktualisiert)',
  `11_Objekt2` text NOT NULL COMMENT 'DAI Kernfeld 11 Objekt 2 /\r\nBeschreibung',
  `12_Objekt3` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 12 Objekt 3 /\r\nInventar- bzw. FundNummer Beispiel: CBA 4321-zyx',
  `13_Dateityp` varchar(255) NOT NULL COMMENT 'DAI Kernfeld 13 Dateityp\r\nAnalog/Digital (Auswahlliste mit den Werten analog und digital)',
  `Land` varchar(255) NOT NULL COMMENT 'Zusatzfeld 1, entspricht photoshop:Country in Iptc4xmpCore',
  `Schlagworte` varchar(255) NOT NULL COMMENT 'Zusatzfeld 2, entspricht dc:subject in iptc4xmpCore',
  `Institution` varchar(255) NOT NULL COMMENT 'Institution zu dem\r\ndieser Inventareintrag gehoert',
  `Negativnr` varchar(255) DEFAULT NULL COMMENT 'Negativnummer',
  `AltNegativnr` varchar(255) DEFAULT NULL COMMENT 'Alternative\r\nNegativnummern durch Semikolon ; getrennt',
  `Fundland` varchar(255) NOT NULL,
  `Fundlandschaft` varchar(255) NOT NULL,
  `Fundort1` varchar(255) NOT NULL,
  `Fundort2` varchar(255) NOT NULL,
  `Inventarnummer_Istanbul` varchar(255) NOT NULL,
  `Kasten` varchar(255) NOT NULL,
  `Verweise` varchar(255) NOT NULL,
  `Datierung` varchar(255) NOT NULL,
  `Material` varchar(255) NOT NULL,
  `AutorBeschreibung` varchar(255) NOT NULL,
  `MuseumsNr` varchar(255) NOT NULL,
  `DepotNr` varchar(255) NOT NULL,
  `StandortObjekt` varchar(255) NOT NULL,
  `Hinweise` varchar(255) NOT NULL,
  `Bildunterschrift` varchar(255) NOT NULL,
  `MiscMetadata` text NOT NULL COMMENT 'Sonstige Metadaten',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Unterkategorie` varchar(255) NOT NULL,
  `DateinameMarbilderinventar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_InventarID`),
  UNIQUE KEY `DateinameMarbilderinventar` (`DateinameMarbilderinventar`),
  KEY `Negativnr` (`Negativnr`)
) ENGINE=InnoDB AUTO_INCREMENT=1061990 DEFAULT CHARSET=utf8 COMMENT='Inventardatenbanken\r\nanderer Institutionen, nach DAI Kernfel';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `ins_prevent_null_timestamps` BEFORE INSERT ON `marbilderinventar` FOR EACH ROW IF NEW.lastModified = 0 THEN
	SET NEW.lastModified = NOW();
END IF */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `marbilderkonkordanz`
--

DROP TABLE IF EXISTS `marbilderkonkordanz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilderkonkordanz` (
  `PS_MARBilderKonkordanzID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_SammlungenID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` int(10) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenrekonstruktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` int(10) unsigned DEFAULT NULL,
  `DateinameMarbilder_alt` varchar(225) NOT NULL,
  `DateinameMarbilder_neu` varchar(225) NOT NULL,
  `Abgearbeitet` tinyint(4) NOT NULL DEFAULT '0',
  `NeuerDatensatzAnlegen` tinyint(4) NOT NULL DEFAULT '0',
  `Projekt` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_MARBilderKonkordanzID`),
  KEY `DateinameMarbilder_alt` (`DateinameMarbilder_alt`)
) ENGINE=InnoDB AUTO_INCREMENT=4945 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbildermissingpaths`
--

DROP TABLE IF EXISTS `marbildermissingpaths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbildermissingpaths` (
  `ArachneEntityID_Bild` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT 'EinEinDeutiger Identifier fuer Arachne Datensaetze',
  `PS_MARBilderID` int(10) unsigned NOT NULL DEFAULT '0',
  `DateinameMarbilder` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Pfad` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_IsolatedSherdID` mediumint(9) unsigned DEFAULT NULL,
  PRIMARY KEY (`ArachneEntityID_Bild`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbilderoppenheim`
--

DROP TABLE IF EXISTS `marbilderoppenheim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilderoppenheim` (
  `PS_MarbilderoppenheimID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `DateinameOppenheim` varchar(255) NOT NULL DEFAULT '',
  `DatensatzGruppeMarbilderoppenheim` varchar(255) NOT NULL DEFAULT 'Oppenheim',
  `BandOppenheim` varchar(255) DEFAULT NULL,
  `BandsignaturAlt` varchar(255) DEFAULT NULL,
  `BandsignaturNeu` varchar(255) DEFAULT NULL,
  `BearbeiterOppenheim` varchar(255) DEFAULT NULL,
  `CDNummer` varchar(255) DEFAULT NULL,
  `DarstellungMarbilderOppenheim` varchar(255) DEFAULT NULL,
  `EingabedatumOppenheim` varchar(255) DEFAULT NULL,
  `Fotodatum` varchar(255) DEFAULT NULL,
  `FotografOppenheim` varchar(255) DEFAULT NULL,
  `Fotonummer` varchar(255) DEFAULT NULL,
  `KorrektorOppenheim` varchar(255) DEFAULT NULL,
  `Korrekturdatum` varchar(255) DEFAULT NULL,
  `KurzbeschreibungMarbilderoppenheim` text,
  `Museum` varchar(255) DEFAULT NULL,
  `Negativ` varchar(255) DEFAULT NULL,
  `OrtOppenheim` varchar(255) DEFAULT NULL,
  `Seitenzahl` varchar(255) DEFAULT NULL,
  `Staat_Gegend` varchar(255) DEFAULT NULL,
  `Standort` varchar(255) DEFAULT NULL,
  `FS_BuchseiteID` int(11) NOT NULL,
  `SignaturSeite` varchar(255) NOT NULL,
  `Facette` varchar(255) NOT NULL DEFAULT 'Fotosammlung Max von Oppenheim',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_MarbilderoppenheimID`),
  UNIQUE KEY `DateinameOppenheim` (`DateinameOppenheim`),
  KEY `Fotodatum` (`Fotodatum`),
  KEY `DatensatzGruppeMarbilderoppenheim` (`DatensatzGruppeMarbilderoppenheim`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `BandsignaturAlt` (`BandsignaturAlt`),
  KEY `Seitenzahl` (`Seitenzahl`)
) ENGINE=InnoDB AUTO_INCREMENT=12852 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbilderparser`
--

DROP TABLE IF EXISTS `marbilderparser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilderparser` (
  `PS_Marbilderparser` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ScanInitialen` varchar(225) NOT NULL,
  `ScanMuster` varchar(225) DEFAULT NULL,
  `RegulaererAusdruck` varchar(225) NOT NULL,
  `Ergebnisarray` varchar(225) NOT NULL,
  `FotografMarbilderparser` text,
  `KategorieMarbilderparser` varchar(225) DEFAULT NULL,
  `DatensatzgruppeMarbilderparser_alt` varchar(255) NOT NULL DEFAULT 'Arachne',
  `DatensatzgruppeMarbilderparser` varchar(255) NOT NULL DEFAULT 'Arachne',
  `BestandsnameMarbilderparser` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`PS_Marbilderparser`),
  KEY `DatensatzgruppeMarbilderparser` (`DatensatzgruppeMarbilderparser`)
) ENGINE=InnoDB AUTO_INCREMENT=338 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marbilderrwwa`
--

DROP TABLE IF EXISTS `marbilderrwwa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marbilderrwwa` (
  `PS_MarbilderrwwaID` int(11) NOT NULL AUTO_INCREMENT,
  `Ausleihfrist` varchar(255) NOT NULL,
  `Bearbeiter` varchar(255) NOT NULL,
  `Klassifikation` varchar(510) NOT NULL,
  `KurzbeschreibungMarbilderRwwa` text NOT NULL,
  `Signatur` varchar(255) NOT NULL,
  `AltSignatur` varchar(255) NOT NULL,
  `AltSignatur2` varchar(255) NOT NULL,
  `Anlass` varchar(255) NOT NULL,
  `Bemerkungen` varchar(510) NOT NULL,
  `Bestand` varchar(255) NOT NULL,
  `NrFotofinder` varchar(255) NOT NULL,
  `Darin` varchar(510) NOT NULL,
  `Darsteller` varchar(255) NOT NULL,
  `Drehbuch` varchar(255) NOT NULL,
  `Enthaelt` varchar(510) NOT NULL,
  `Erfassungsdatum` varchar(255) NOT NULL,
  `Format` varchar(255) NOT NULL,
  `Fotograf` varchar(255) NOT NULL,
  `InternetGesperrt` varchar(10) NOT NULL,
  `GrundstrukturFindbuch` varchar(255) NOT NULL,
  `Hrsg` varchar(255) NOT NULL,
  `Kuenstler` varchar(255) NOT NULL,
  `Laufzeit` varchar(255) NOT NULL,
  `Laufzeitbeschreibung` varchar(255) NOT NULL,
  `LfdNr` varchar(255) NOT NULL,
  `Motiv_alphabetisch` text NOT NULL,
  `Musik` varchar(255) NOT NULL,
  `Negativnummer` varchar(255) NOT NULL,
  `Sortierfeld` varchar(255) NOT NULL,
  `Titel` varchar(255) NOT NULL,
  `TitelAlphabetisch` varchar(255) NOT NULL,
  `Typ` varchar(255) NOT NULL,
  `Beschreibung` varchar(510) NOT NULL,
  `Laenge` varchar(255) NOT NULL,
  `Filmsparte` varchar(255) NOT NULL,
  `Inhalt` varchar(255) NOT NULL,
  `Produktionsfirma` varchar(255) NOT NULL,
  `Provenienzfeld` varchar(255) NOT NULL,
  `Regisseur` varchar(255) NOT NULL,
  `Sprache` varchar(255) NOT NULL,
  `Sprecher` varchar(255) NOT NULL,
  `Technik` varchar(255) NOT NULL,
  `Ton` varchar(255) NOT NULL,
  `Trick` varchar(255) NOT NULL,
  `Verweisung` varchar(255) NOT NULL,
  `Kamera` varchar(255) NOT NULL,
  `Sperrfrist` varchar(255) NOT NULL,
  `DateinameRwwa` varchar(255) NOT NULL,
  `Kategorie` varchar(255) NOT NULL,
  `DatensatzGruppeMarbilderRwwa` varchar(255) NOT NULL DEFAULT 'Arachne',
  `KorrektorMarbilderrwwa` varchar(255) NOT NULL,
  `Facette` varchar(255) NOT NULL DEFAULT 'Rheinisch-Westfälisches Wirtschaftsarchiv',
  `lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_MarbilderrwwaID`),
  UNIQUE KEY `Signatur` (`Signatur`),
  UNIQUE KEY `DateinameRwwa` (`DateinameRwwa`),
  KEY `Sortierfeld` (`Sortierfeld`)
) ENGINE=InnoDB AUTO_INCREMENT=91206 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `modell3d`
--

DROP TABLE IF EXISTS `modell3d`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modell3d` (
  `PS_Modell3dID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `Titel` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Unbenanntes 3D Modell',
  `Modellierer` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Unbekannt',
  `Lizenz` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Dateiname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Dateiformat` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `DateinameMTL` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Pfad` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `DatensatzGruppeModell3d` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Arachne',
  `oaipmhsetModell3d` varchar(256) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'modell3d',
  `FS_BauwerkID` int(10) unsigned DEFAULT NULL,
  `FS_ObjektID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_Modell3dID`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='3D Modelle';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_modell3d` AFTER INSERT ON `modell3d` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='modell3d', `arachneentityidentification`.`ForeignKey`=NEW.`PS_Modell3dID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDModell3d` AFTER DELETE ON `modell3d` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('modell3d', OLD.`PS_Modell3dID`, OLD.`oaipmhsetModell3d`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_Modell3dID` AND `arachneentityidentification`.`TableName` = 'modell3d';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `morphology`
--

DROP TABLE IF EXISTS `morphology`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `morphology` (
  `PS_MorphologyID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `PS_FMPMorphologyID` mediumint(9) NOT NULL DEFAULT '-1',
  `Level1` varchar(512) DEFAULT NULL,
  `Level2` varchar(512) DEFAULT NULL,
  `Level3` varchar(512) DEFAULT NULL,
  `Level4` varchar(512) DEFAULT NULL,
  `Level5` varchar(512) DEFAULT NULL,
  `Level6` varchar(512) DEFAULT NULL,
  `Level1_6` varchar(256) DEFAULT NULL,
  `DatensatzGruppeMorphology` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_MorphologyID`)
) ENGINE=InnoDB AUTO_INCREMENT=2528 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `createEntityIDMorphology` AFTER INSERT ON `morphology` FOR EACH ROW BEGIN 
INSERT INTO  `arachneentityidentification` 
SET  `arachneentityidentification`.`TableName`='morphology', `arachneentityidentification`.`ForeignKey` = NEW.`PS_MorphologyID` ;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `DeleteMorphologyConnections` AFTER DELETE ON `morphology` FOR EACH ROW BEGIN
DELETE FROM `xmorphologyx` WHERE `xmorphologyx`.`FS_MorphologyID` = OLD.`PS_MorphologyID`;
UPDATE `mainabstract` SET `FS_MorphologyID` = NULL WHERE `mainabstract`.`FS_MorphologyID` = OLD.`PS_MorphologyID`;
DELETE FROM `marbilder` WHERE `marbilder`.`FS_MorphologyID` = OLD.`PS_MorphologyID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `niton`
--

DROP TABLE IF EXISTS `niton`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `niton` (
  `PS_NitonID` int(11) NOT NULL AUTO_INCREMENT,
  `Time` datetime NOT NULL,
  `Type` varchar(255) DEFAULT NULL,
  `Duration` float NOT NULL,
  `Units` varchar(128) NOT NULL DEFAULT 'ppm',
  `SigmaValue` smallint(6) DEFAULT NULL,
  `Sequence` varchar(128) DEFAULT NULL,
  `Flags` varchar(255) DEFAULT NULL,
  `Sample` varchar(255) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Inspector` varchar(255) DEFAULT NULL,
  `Misc` varchar(255) DEFAULT NULL,
  `Note` varchar(255) DEFAULT NULL,
  `Si` float DEFAULT NULL,
  `Ti` float DEFAULT NULL,
  `Al` float DEFAULT NULL,
  `Fe` float DEFAULT NULL,
  `Mn` float DEFAULT NULL,
  `Mg` float DEFAULT NULL,
  `Ca` float DEFAULT NULL,
  `K` float DEFAULT NULL,
  `P` float DEFAULT NULL,
  `S` float DEFAULT NULL,
  `V` float DEFAULT NULL,
  `Cr` float DEFAULT NULL,
  `Ni` float DEFAULT NULL,
  `Cu` float DEFAULT NULL,
  `Zn` float DEFAULT NULL,
  `Rb` float DEFAULT NULL,
  `Sr` float DEFAULT NULL,
  `Y` float DEFAULT NULL,
  `Zr` float DEFAULT NULL,
  `Nb` float DEFAULT NULL,
  `Pb` float DEFAULT NULL,
  `Ba` float DEFAULT NULL,
  `Sb` float DEFAULT NULL,
  `Sn` float DEFAULT NULL,
  `Cd` float DEFAULT NULL,
  `Ag` float DEFAULT NULL,
  `Bal` float DEFAULT NULL,
  `Mo` float DEFAULT NULL,
  `Bi` float DEFAULT NULL,
  `Au` float DEFAULT NULL,
  `Se` float DEFAULT NULL,
  `As` float DEFAULT NULL,
  `W` float DEFAULT NULL,
  `Co` float DEFAULT NULL,
  `Cl` float DEFAULT NULL,
  `Ce` float DEFAULT NULL,
  `DatensatzGruppeNiton` varchar(128) NOT NULL DEFAULT 'ceramalex',
  PRIMARY KEY (`PS_NitonID`)
) ENGINE=InnoDB AUTO_INCREMENT=506 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_niton` AFTER INSERT ON `niton` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='niton', `arachneentityidentification`.`ForeignKey`=NEW.`PS_NitonID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `objekt`
--

DROP TABLE IF EXISTS `objekt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objekt` (
  `PS_ObjektID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_GruppenID_bak` int(10) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeObjekt` varchar(255) NOT NULL DEFAULT 'Arachne',
  `Adressat` text NOT NULL,
  `AntikerAufstellungsort` text NOT NULL,
  `ApplizierteElemente` varchar(255) NOT NULL DEFAULT '',
  `Arbeitsnotiz` varchar(255) NOT NULL DEFAULT '',
  `Auftraggeber` text NOT NULL,
  `BearbeiterObjekt` varchar(255) NOT NULL DEFAULT '',
  `Bearbeitungen` varchar(255) NOT NULL DEFAULT '',
  `BearbeitungenAntik` text NOT NULL,
  `BerlinInstitution` varchar(255) DEFAULT NULL,
  `BerlinVerantwortlich` varchar(255) DEFAULT NULL,
  `BerlinObjektstatus` varchar(255) DEFAULT NULL,
  `BerlinObjektID` varchar(255) DEFAULT NULL,
  `BerlinObjekt` text NOT NULL,
  `BerlinDatenblatt` varchar(255) NOT NULL,
  `BerlinInventar` varchar(255) NOT NULL,
  `BreiteGesamt` varchar(255) NOT NULL DEFAULT '',
  `InschriftCorpusLatein_OLD` varchar(255) NOT NULL,
  `DekorAllgemein` varchar(255) NOT NULL,
  `DurchmesserGesamt` varchar(255) NOT NULL DEFAULT '',
  `BearbeitungenModern` text NOT NULL,
  `Erhaltung` varchar(255) NOT NULL DEFAULT '',
  `Erhaltungszustand` text NOT NULL,
  `Farbreste` text NOT NULL,
  `FreieBeschreibung` text,
  `FunddatumObjekt` varchar(255) NOT NULL,
  `Fundkontext` text NOT NULL,
  `Funktion` varchar(255) NOT NULL DEFAULT '',
  `funktionaleVerwendung` varchar(255) NOT NULL DEFAULT '',
  `GattungAllgemein` varchar(255) NOT NULL DEFAULT '',
  `gesperrt` varchar(255) NOT NULL DEFAULT '',
  `GewichtGesamt` varchar(255) NOT NULL,
  `GipsInBonn` varchar(255) NOT NULL DEFAULT '',
  `HerkFundKommentar` text NOT NULL,
  `Herkunft` text NOT NULL,
  `HoeheGesamt` varchar(255) NOT NULL DEFAULT '',
  `InschriftCorpusObjekt` varchar(255) NOT NULL,
  `InschriftObjekt` text NOT NULL,
  `InschriftSpracheObjekt` varchar(255) NOT NULL,
  `InschriftCorpusGriech_OLD` varchar(255) NOT NULL,
  `InschriftGriechisch_OLD` text NOT NULL,
  `InschriftKommentar` text NOT NULL,
  `InschriftLatein_OLD` text NOT NULL,
  `InschriftMainzID` int(10) NOT NULL,
  `InschriftPublikation` text NOT NULL,
  `KarteiFittschen` varchar(255) NOT NULL DEFAULT '',
  `Katalogbearbeitung` varchar(255) NOT NULL DEFAULT '',
  `Katalognummer` text NOT NULL,
  `Katalogtext` text NOT NULL,
  `KatalogbearbeitungEnglisch` varchar(255) DEFAULT NULL,
  `KatalogtextEnglisch` text,
  `Korrektor` varchar(255) NOT NULL DEFAULT '',
  `Kulturkreis` varchar(255) NOT NULL DEFAULT '',
  `KurzbeschreibungObjekt` varchar(255) NOT NULL DEFAULT '',
  `Material` varchar(255) NOT NULL DEFAULT '',
  `MaterialBemerkung` text,
  `Materialbeschreibung` text NOT NULL,
  `MedienAG` varchar(255) NOT NULL DEFAULT '',
  `ObjektRestauroBeschreibung` text NOT NULL,
  `ObjektRestauroMaterialBemerk` text NOT NULL,
  `ObjektMaszeBemerk` text NOT NULL,
  `ObjektRestauroHerstell` text NOT NULL,
  `ObjektRestauroBeschreibungVorzustand` text NOT NULL,
  `ObjektRestauroMasznahmen` text NOT NULL,
  `ObjektRestauroMasznahmenFruehere` text NOT NULL,
  `ObjektRestauroRestaurier` text NOT NULL,
  `ObjektRestauroZeitraum` text NOT NULL,
  `ObjektRestauroDurchgefuehrtVon` text NOT NULL,
  `ObjektRestauroAnalyseZiel` text NOT NULL,
  `ObjektRestauroAnalyseMasznahmenMethoden` text NOT NULL,
  `ObjektRestauroAnalyseDurchgefuehrtVon` text NOT NULL,
  `ObjektRestauroAnalyseZeitraum` text NOT NULL,
  `ObjektRestauroAnalyseErgebnis` text NOT NULL,
  `Spolie` varchar(255) NOT NULL DEFAULT '',
  `TiefeGesamt` varchar(255) NOT NULL DEFAULT '',
  `zuMonument` varchar(255) NOT NULL DEFAULT '',
  `Technik` varchar(255) NOT NULL DEFAULT '',
  `TechnikDetails` text NOT NULL,
  `antikeGriechLandschaft` varchar(255) NOT NULL DEFAULT '',
  `antikeRoemProvinz` varchar(255) NOT NULL DEFAULT '',
  `Fundort` text NOT NULL,
  `Fundstaat` varchar(255) NOT NULL DEFAULT '',
  `RekoObjekt` varchar(255) NOT NULL DEFAULT '',
  `FS_Objekt_Siegel_Key` int(11) NOT NULL,
  `FS_Plomben_ID` int(11) DEFAULT NULL,
  `FS_CMSNR` varchar(255) DEFAULT NULL,
  `ZusaetzlicheMasze` text NOT NULL,
  `ObjektAusleihe` varchar(255) NOT NULL,
  `ObjektAusleiheLeihnehmer` varchar(255) NOT NULL,
  `ObjektAusleiheZweck` varchar(255) NOT NULL,
  `ObjektAusleiheDauerVon` varchar(255) NOT NULL,
  `ObjektAusleiheDauerBis` varchar(255) NOT NULL,
  `ObjektAusleiheDauerLeihnehmer` varchar(255) NOT NULL,
  `ObjektAusleiheDauernahmeVon` varchar(255) NOT NULL,
  `ObjektAusleiheDauernahmeBis` varchar(255) NOT NULL,
  `ObjektAusleiheDauernahmeEigentuemer` varchar(255) NOT NULL,
  `ObjektArtErwerb` varchar(255) NOT NULL,
  `ObjektLeipTempAufbewahrung` varchar(255) NOT NULL,
  `ObjektLeipTempDat` varchar(255) NOT NULL,
  `ObjektLeipTempLit` varchar(255) NOT NULL,
  `ObjektErwerbDatum` varchar(255) NOT NULL,
  `ObjektPreis` varchar(255) NOT NULL,
  `ObjektVersicherungswert` varchar(255) NOT NULL,
  `SchmuckBeschreibung` text NOT NULL,
  `SchmuckSpezifizierung` text NOT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ObjektErwerbUmstand` varchar(256) DEFAULT NULL,
  `oaipmhsetObjekt` varchar(256) NOT NULL DEFAULT 'objekt',
  `Projekttitel` text NOT NULL,
  PRIMARY KEY (`PS_ObjektID`),
  KEY `KurzbeschreibungObjekt` (`KurzbeschreibungObjekt`),
  KEY `Material` (`Material`),
  KEY `FS_GruppenID` (`FS_GruppenID_bak`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `DatensatzGruppeObjekt` (`DatensatzGruppeObjekt`),
  KEY `Arbeitsnotiz` (`Arbeitsnotiz`),
  KEY `GattungAllgemein` (`GattungAllgemein`),
  KEY `Fundstaat` (`Fundstaat`),
  KEY `Fundkontext` (`Fundkontext`(255)),
  KEY `Fundort` (`Fundort`(255)),
  KEY `HerkFundKommentar` (`HerkFundKommentar`(255)),
  KEY `Herkunft` (`Herkunft`(255)),
  KEY `FunddatumObjekt` (`FunddatumObjekt`),
  KEY `Katalognummer` (`Katalognummer`(255)),
  CONSTRAINT `objekt_ibfk_1` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=633449 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_objekt` BEFORE INSERT ON `objekt` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_objekt` AFTER INSERT ON `objekt` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='objekt', `arachneentityidentification`.`ForeignKey`=NEW.`PS_ObjektID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDObjektID` AFTER DELETE ON `objekt` FOR EACH ROW BEGIN
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_ObjektID` AND `arachneentityidentification`.`TableName` = 'objekt';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `objekt_pre_datenblattberlin`
--

DROP TABLE IF EXISTS `objekt_pre_datenblattberlin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objekt_pre_datenblattberlin` (
  `PS_ObjektID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_GruppenID_bak` int(10) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeObjekt` varchar(255) NOT NULL DEFAULT 'Arachne',
  `Adressat` text NOT NULL,
  `AntikerAufstellungsort` text NOT NULL,
  `ApplizierteElemente` varchar(255) NOT NULL DEFAULT '',
  `Arbeitsnotiz` varchar(255) NOT NULL DEFAULT '',
  `Auftraggeber` text NOT NULL,
  `BearbeiterObjekt` varchar(255) NOT NULL DEFAULT '',
  `Bearbeitungen` varchar(255) NOT NULL DEFAULT '',
  `BearbeitungenAntik` text NOT NULL,
  `BerlinInstitution` varchar(255) DEFAULT NULL,
  `BerlinVerantwortlich` varchar(255) DEFAULT NULL,
  `BerlinObjektstatus` varchar(255) DEFAULT NULL,
  `BerlinObjektID` varchar(255) DEFAULT NULL,
  `BerlinObjekt` text NOT NULL,
  `BerlinDatenblatt` varchar(255) NOT NULL,
  `BerlinInventar` varchar(255) NOT NULL,
  `BreiteGesamt` varchar(255) NOT NULL DEFAULT '',
  `InschriftCorpusLatein_OLD` varchar(255) NOT NULL,
  `DekorAllgemein` varchar(255) NOT NULL,
  `DurchmesserGesamt` varchar(255) NOT NULL DEFAULT '',
  `BearbeitungenModern` text NOT NULL,
  `Erhaltung` varchar(255) NOT NULL DEFAULT '',
  `Erhaltungszustand` text NOT NULL,
  `Farbreste` text NOT NULL,
  `FreieBeschreibung` text,
  `FunddatumObjekt` varchar(255) NOT NULL,
  `Fundkontext` text NOT NULL,
  `Funktion` varchar(255) NOT NULL DEFAULT '',
  `funktionaleVerwendung` varchar(255) NOT NULL DEFAULT '',
  `GattungAllgemein` varchar(255) NOT NULL DEFAULT '',
  `gesperrt` varchar(255) NOT NULL DEFAULT '',
  `GewichtGesamt` varchar(255) NOT NULL,
  `GipsInBonn` varchar(255) NOT NULL DEFAULT '',
  `HerkFundKommentar` text NOT NULL,
  `Herkunft` text NOT NULL,
  `HoeheGesamt` varchar(255) NOT NULL DEFAULT '',
  `InschriftCorpusObjekt` varchar(255) NOT NULL,
  `InschriftObjekt` text NOT NULL,
  `InschriftSpracheObjekt` varchar(255) NOT NULL,
  `InschriftCorpusGriech_OLD` varchar(255) NOT NULL,
  `InschriftGriechisch_OLD` text NOT NULL,
  `InschriftKommentar` text NOT NULL,
  `InschriftLatein_OLD` text NOT NULL,
  `InschriftMainzID` int(10) NOT NULL,
  `InschriftPublikation` text NOT NULL,
  `KarteiFittschen` varchar(255) NOT NULL DEFAULT '',
  `Katalogbearbeitung` varchar(255) NOT NULL DEFAULT '',
  `Katalognummer` text NOT NULL,
  `Katalogtext` text NOT NULL,
  `KatalogbearbeitungEnglisch` varchar(255) DEFAULT NULL,
  `KatalogtextEnglisch` text,
  `Korrektor` varchar(255) NOT NULL DEFAULT '',
  `Kulturkreis` varchar(255) NOT NULL DEFAULT '',
  `KurzbeschreibungObjekt` varchar(255) NOT NULL DEFAULT '',
  `Material` varchar(255) NOT NULL DEFAULT '',
  `MaterialBemerkung` text,
  `Materialbeschreibung` text NOT NULL,
  `MedienAG` varchar(255) NOT NULL DEFAULT '',
  `ObjektRestauroBeschreibung` text NOT NULL,
  `ObjektRestauroMaterialBemerk` text NOT NULL,
  `ObjektMaszeBemerk` text NOT NULL,
  `ObjektRestauroHerstell` text NOT NULL,
  `ObjektRestauroBeschreibungVorzustand` text NOT NULL,
  `ObjektRestauroMasznahmen` text NOT NULL,
  `ObjektRestauroMasznahmenFruehere` text NOT NULL,
  `ObjektRestauroRestaurier` text NOT NULL,
  `ObjektRestauroZeitraum` text NOT NULL,
  `ObjektRestauroDurchgefuehrtVon` text NOT NULL,
  `ObjektRestauroAnalyseZiel` text NOT NULL,
  `ObjektRestauroAnalyseMasznahmenMethoden` text NOT NULL,
  `ObjektRestauroAnalyseDurchgefuehrtVon` text NOT NULL,
  `ObjektRestauroAnalyseZeitraum` text NOT NULL,
  `ObjektRestauroAnalyseErgebnis` text NOT NULL,
  `Spolie` varchar(255) NOT NULL DEFAULT '',
  `TiefeGesamt` varchar(255) NOT NULL DEFAULT '',
  `zuMonument` varchar(255) NOT NULL DEFAULT '',
  `Technik` varchar(255) NOT NULL DEFAULT '',
  `TechnikDetails` text NOT NULL,
  `antikeGriechLandschaft` varchar(255) NOT NULL DEFAULT '',
  `antikeRoemProvinz` varchar(255) NOT NULL DEFAULT '',
  `Fundort` text NOT NULL,
  `Fundstaat` varchar(255) NOT NULL DEFAULT '',
  `RekoObjekt` varchar(255) NOT NULL DEFAULT '',
  `FS_Objekt_Siegel_Key` int(11) NOT NULL,
  `FS_Plomben_ID` int(11) DEFAULT NULL,
  `FS_CMSNR` varchar(255) DEFAULT NULL,
  `ZusaetzlicheMasze` text NOT NULL,
  `ObjektAusleihe` varchar(255) NOT NULL,
  `ObjektAusleiheLeihnehmer` varchar(255) NOT NULL,
  `ObjektAusleiheZweck` varchar(255) NOT NULL,
  `ObjektAusleiheDauerVon` varchar(255) NOT NULL,
  `ObjektAusleiheDauerBis` varchar(255) NOT NULL,
  `ObjektAusleiheDauerLeihnehmer` varchar(255) NOT NULL,
  `ObjektAusleiheDauernahmeVon` varchar(255) NOT NULL,
  `ObjektAusleiheDauernahmeBis` varchar(255) NOT NULL,
  `ObjektAusleiheDauernahmeEigentuemer` varchar(255) NOT NULL,
  `ObjektArtErwerb` varchar(255) NOT NULL,
  `ObjektLeipTempAufbewahrung` varchar(255) NOT NULL,
  `ObjektLeipTempDat` varchar(255) NOT NULL,
  `ObjektLeipTempLit` varchar(255) NOT NULL,
  `ObjektErwerbDatum` varchar(255) NOT NULL,
  `ObjektPreis` varchar(255) NOT NULL,
  `ObjektVersicherungswert` varchar(255) NOT NULL,
  `SchmuckBeschreibung` text NOT NULL,
  `SchmuckSpezifizierung` text NOT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ObjektErwerbUmstand` varchar(256) DEFAULT NULL,
  `oaipmhsetObjekt` varchar(256) NOT NULL DEFAULT 'objekt',
  PRIMARY KEY (`PS_ObjektID`),
  KEY `KurzbeschreibungObjekt` (`KurzbeschreibungObjekt`),
  KEY `Material` (`Material`),
  KEY `FS_GruppenID` (`FS_GruppenID_bak`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `DatensatzGruppeObjekt` (`DatensatzGruppeObjekt`),
  KEY `Arbeitsnotiz` (`Arbeitsnotiz`),
  KEY `GattungAllgemein` (`GattungAllgemein`),
  KEY `Fundstaat` (`Fundstaat`),
  KEY `Fundkontext` (`Fundkontext`(255)),
  KEY `Fundort` (`Fundort`(255)),
  KEY `HerkFundKommentar` (`HerkFundKommentar`(255)),
  KEY `Herkunft` (`Herkunft`(255)),
  KEY `FunddatumObjekt` (`FunddatumObjekt`),
  KEY `Katalognummer` (`Katalognummer`(255))
) ENGINE=InnoDB AUTO_INCREMENT=621946 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektbauornamentik`
--

DROP TABLE IF EXISTS `objektbauornamentik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektbauornamentik` (
  `PS_ObjektbauornamentikID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `abstraktMotiv` text NOT NULL,
  `abstraktMotivBeschreibung` text NOT NULL,
  `abstraktMotivMaeander` text NOT NULL,
  `Aufgehendes` text NOT NULL,
  `AufgehendesBeschreibung` text NOT NULL,
  `AufgehendesBogen` text NOT NULL,
  `AufgehendesDecke` text NOT NULL,
  `AufgehendesFenster` text NOT NULL,
  `AufgehendesSonstiges` text NOT NULL,
  `AufgehendesTuer` text NOT NULL,
  `AufgehendesWand` text NOT NULL,
  `Bauglied` text NOT NULL,
  `BemerkungenDekor` text NOT NULL,
  `BemerkungenBauornament` text NOT NULL,
  `DekorationsartBauornament` text NOT NULL,
  `Dekorationsart2` text NOT NULL,
  `Gebaelk` text NOT NULL,
  `GebaelkBeschreibung` text NOT NULL,
  `GebaelkArchitrav` text NOT NULL,
  `GebaelkAttika` text NOT NULL,
  `GebaelkDach` text NOT NULL,
  `GebaelkFries` text NOT NULL,
  `GebaelkGesims` text NOT NULL,
  `GebaelkGiebel` text NOT NULL,
  `GebaelkSima` text NOT NULL,
  `GegenstMotiv` text NOT NULL,
  `GegenstMotivAnzahl` text NOT NULL,
  `GegenstMotivBeschreibung` text NOT NULL,
  `Komplex` text NOT NULL,
  `KomplexAkanthusPalmetten` text NOT NULL,
  `KomplexBasen` text NOT NULL,
  `KomplexBeschreibung` text NOT NULL,
  `KomplexBluetenfries` text NOT NULL,
  `KomplexGirlande` text NOT NULL,
  `KomplexKandelaber` text NOT NULL,
  `KomplexKapitelle` text NOT NULL,
  `KomplexLotusPalmetten` text NOT NULL,
  `KomplexPalmetten` text NOT NULL,
  `KomplexRanke` text NOT NULL,
  `KomplexSonstFriese` text NOT NULL,
  `pflanzMotiv` text NOT NULL,
  `pflanzMotivBeschreibung` text NOT NULL,
  `pflanzMotivAkanthus` text NOT NULL,
  `pflanzMotivBlatt` text NOT NULL,
  `pflanzMotivBluete` text NOT NULL,
  `pflanzMotivCaulis` text NOT NULL,
  `pflanzMotivDorKyma` text NOT NULL,
  `pflanzMotivFrucht` text NOT NULL,
  `pflanzMotivHelix` text NOT NULL,
  `pflanzMotivIonKyma` text NOT NULL,
  `pflanzMotivLesbKyma` text NOT NULL,
  `pflanzMotivPalmette` text NOT NULL,
  `Profil` text NOT NULL,
  `ProvenienzBauornament` text NOT NULL,
  `reliefiertBauornament` text NOT NULL,
  `Saeule` text NOT NULL,
  `SaeuleBeschreibung` text NOT NULL,
  `SaeuleBasis` text NOT NULL,
  `SaeuleKapitell` text NOT NULL,
  `SaeulePlinthe` text NOT NULL,
  `SaeuleSchaft` text NOT NULL,
  `SaeuleStuetze` text NOT NULL,
  `Unterbau` text NOT NULL,
  `UnterbauBeschreibung` text NOT NULL,
  `UnterbauBoden` text NOT NULL,
  `UnterbauEuthynterie` text NOT NULL,
  `UnterbauKrepis` text NOT NULL,
  `UnterbauPiedestal` text NOT NULL,
  `UnterbauPodium` text NOT NULL,
  `UnterbauSitzstufen` text NOT NULL,
  `UnterbauTreppenstufen` text NOT NULL,
  `MaszeBauglied` text NOT NULL,
  `VergleicheBauornament` text NOT NULL,
  `oaipmhsetObjektbauornamentik` varchar(256) NOT NULL DEFAULT 'objektbauornamentik',
  PRIMARY KEY (`PS_ObjektbauornamentikID`),
  CONSTRAINT `objektbauornamentik_ibfk_1` FOREIGN KEY (`PS_ObjektbauornamentikID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektgemaelde`
--

DROP TABLE IF EXISTS `objektgemaelde`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektgemaelde` (
  `PS_ObjektgemaeldeID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `TechnikGemaelde` varchar(255) DEFAULT NULL,
  `KuenstlerGemaelde` varchar(255) DEFAULT NULL,
  `KuenstlerVorbildGemaelde` varchar(255) DEFAULT NULL,
  `Bezeichnet` varchar(255) DEFAULT NULL,
  `DekorationsartObjektgemaelde` varchar(255) DEFAULT NULL,
  `MalereistilObjektgemaelde` varchar(255) DEFAULT NULL,
  `MarmorinkrustationenStilObjektgemaelde` varchar(255) DEFAULT NULL,
  `MarmorsorteObjektgemaelde` varchar(255) DEFAULT NULL,
  `UntenLinks` varchar(255) DEFAULT NULL,
  `UntenMitte` varchar(255) DEFAULT NULL,
  `UntenRechts` varchar(255) DEFAULT NULL,
  `ObenLinks` varchar(255) DEFAULT NULL,
  `ObenMitte` varchar(255) DEFAULT NULL,
  `ObenRechts` varchar(255) DEFAULT NULL,
  `BildMasze` varchar(255) DEFAULT NULL,
  `PlatteMasze` varchar(255) DEFAULT NULL,
  `BlattMasze` varchar(255) DEFAULT NULL,
  `BeschreibungGemaelde` text,
  `RestaurierungGemaelde` text,
  `ZustandGemaelde` text,
  `BeschreibungFlaechenkunst` text,
  `KuenstlerFlaechenkunst` text,
  `RestaurierungenFlaechenkunst` text,
  `TechnikGemaeldeCheck` varchar(256) DEFAULT NULL,
  `GemaeldeMatTraeger` varchar(256) DEFAULT NULL,
  `SpezGemaeldeMatTraeger` text,
  `GemaeldeMatMalerei` varchar(256) DEFAULT NULL,
  `SpezGemaeldeMatMalerei` text,
  `oaipmhsetObjektgemaelde` varchar(256) NOT NULL DEFAULT 'objektgemaelde',
  PRIMARY KEY (`PS_ObjektgemaeldeID`),
  CONSTRAINT `objektgemaelde_ibfk_1` FOREIGN KEY (`PS_ObjektgemaeldeID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektkeramik`
--

DROP TABLE IF EXISTS `objektkeramik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektkeramik` (
  `PS_ObjektkeramikID` mediumint(8) unsigned NOT NULL,
  `DekorationKeramik` text NOT NULL,
  `GefaessformenKeramik` varchar(255) NOT NULL,
  `GefaesstypKeramik` varchar(255) NOT NULL,
  `HerstellungstechnikKeramik` varchar(255) NOT NULL,
  `ProvenienzKeramik` varchar(255) NOT NULL,
  `ProduktionsortKeramik` varchar(255) NOT NULL,
  `MalerKeramik` varchar(255) NOT NULL,
  `MalerSigniertKeramik` varchar(255) NOT NULL,
  `MalerWerkstattGruppeUmkreisKeramik` varchar(255) NOT NULL,
  `MaltechnikKeramik` varchar(255) NOT NULL,
  `MotiveKeramik` text NOT NULL,
  `SpezifizierungMotiveKeramik` text NOT NULL,
  `SpezifizierungWareKeramik` varchar(255) NOT NULL,
  `ToepferKeramik` varchar(255) NOT NULL,
  `ToepferSigniertKeramik` varchar(255) NOT NULL,
  `ToepferWerkstattGruppeUmkreisKeramik` varchar(255) NOT NULL,
  `WareKeramik` varchar(255) NOT NULL,
  `Oberflaechenfarbe` text,
  `Scherbenfarbe` text,
  `KorngroesseMagerung` text,
  `Einschluesse` text,
  `Bruchmuster` text,
  `Analysen` text,
  `ObjektKeramikLeipTempTechnikVasenmalerei` varchar(255) NOT NULL,
  `oaipmhsetObjektkeramik` varchar(256) NOT NULL DEFAULT 'objektkeramik',
  PRIMARY KEY (`PS_ObjektkeramikID`),
  CONSTRAINT `objektkeramik_ibfk_1` FOREIGN KEY (`PS_ObjektkeramikID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektlebewesen`
--

DROP TABLE IF EXISTS `objektlebewesen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektlebewesen` (
  `PS_ObjektlebewesenID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `lPersonen` varchar(256) DEFAULT NULL,
  `Geschlecht` varchar(256) DEFAULT NULL,
  `Identifizierung` varchar(256) DEFAULT NULL,
  `SpezPerson` text,
  `SpezIdentifizierung` text,
  `lGeschlecht` varchar(256) DEFAULT NULL,
  `lAlter` varchar(256) DEFAULT NULL,
  `lEthnie` text,
  `Sujet` varchar(256) DEFAULT NULL,
  `SpezSujet` text,
  `Tiere` text,
  `Verkehr` text,
  `SpezVerkehr` text,
  `Gegenstaende` text,
  `oaipmhsetObjektlebewesen` varchar(256) NOT NULL DEFAULT 'objektlebewesen',
  PRIMARY KEY (`PS_ObjektlebewesenID`)
) ENGINE=MyISAM AUTO_INCREMENT=615021 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektmosaik`
--

DROP TABLE IF EXISTS `objektmosaik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektmosaik` (
  `PS_ObjektmosaikID` mediumint(8) unsigned NOT NULL,
  `AnbringungMosaik` varchar(255) NOT NULL,
  `AnbringungSpezifizierungMosaik` text NOT NULL,
  `DekorMosaik` varchar(255) NOT NULL,
  `DekorSpezifizierungMosaik` varchar(255) NOT NULL,
  `FarbigkeitMosaik` varchar(255) NOT NULL,
  `FarbigkeitSpezifizierungMosaik` varchar(255) NOT NULL,
  `HerstellungstechnikMosaik` varchar(255) NOT NULL,
  `KuenstlerMosaik` varchar(255) NOT NULL,
  `MaterialMosaik` varchar(255) NOT NULL,
  `MaterialSpezifizierungMosaik` text NOT NULL,
  `RahmungMosaik` varchar(255) NOT NULL,
  `RahmungSpezifizierungMosaik` varchar(255) NOT NULL,
  `SigniertMosaik` varchar(255) NOT NULL,
  `VorbildMosaik` varchar(255) NOT NULL,
  `oaipmhsetObjektmosaik` varchar(256) NOT NULL DEFAULT 'objektmosaik',
  PRIMARY KEY (`PS_ObjektmosaikID`),
  CONSTRAINT `objektmosaik_ibfk_1` FOREIGN KEY (`PS_ObjektmosaikID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektmuenzen`
--

DROP TABLE IF EXISTS `objektmuenzen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektmuenzen` (
  `PS_ObjektmuenzenID` mediumint(8) unsigned NOT NULL,
  `Muenze_Nominal` varchar(255) NOT NULL,
  `Muenze_Abnutzung` varchar(255) NOT NULL,
  `Muenze_Korrosion` varchar(255) NOT NULL,
  `Muenze_ErhaltungHoehe` float DEFAULT NULL,
  `Muenze_ErhaltungGewicht` float DEFAULT NULL,
  `Muenze_ErhaltungStaerke` float DEFAULT NULL,
  `Muenze_ErhaltungDm` float DEFAULT NULL,
  `Muenze_Material` varchar(255) NOT NULL,
  `Muenze_Herstellungstechnik` varchar(255) NOT NULL,
  `Muenze_Form` varchar(255) NOT NULL,
  `Muenze_formaleBesonderheiten` varchar(255) NOT NULL,
  `Muenze_Stempelstellung` varchar(255) NOT NULL,
  `Muenze_Muenzstaette` varchar(255) NOT NULL,
  `Muenze_Praegeherr` varchar(255) NOT NULL,
  `Muenze_VorderseiteLegende` varchar(255) NOT NULL,
  `Muenze_VorderseiteMotiv` varchar(255) NOT NULL,
  `Muenze_VorderseiteGegenstempel` varchar(255) NOT NULL,
  `Muenze_RueckseiteLegende` varchar(255) NOT NULL,
  `Muenze_RueckseiteMotiv` varchar(255) NOT NULL,
  `Muenze_RueckseiteGegenstempel` varchar(255) NOT NULL,
  `Muenze_ReferenzTyp` varchar(255) NOT NULL,
  `oaipmhsetObjektmuenzen` varchar(255) NOT NULL DEFAULT 'objektmuenzen',
  PRIMARY KEY (`PS_ObjektmuenzenID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektplastik`
--

DROP TABLE IF EXISTS `objektplastik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektplastik` (
  `PS_ObjektplastikID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `LebensAlter` text NOT NULL,
  `AnzahlFiguren` text NOT NULL,
  `AttributeBeschreibung` text NOT NULL,
  `AttributeAllgemein` text NOT NULL,
  `AttributeFigur` text NOT NULL,
  `AttributeGegenstand` text NOT NULL,
  `AttributeGoetterattribut` text NOT NULL,
  `AttributePflanze` text NOT NULL,
  `AttributeSonstige` text NOT NULL,
  `AttributeTier` text NOT NULL,
  `Aufstellung` text NOT NULL,
  `Augenbildung` text NOT NULL,
  `bekleidet` text NOT NULL,
  `Bekleidung` text NOT NULL,
  `BekleidungZusatz` text NOT NULL,
  `Bemerkungen` text NOT NULL,
  `BekleidungBeschreibung` text NOT NULL,
  `benannt` text NOT NULL,
  `Benennung` text NOT NULL,
  `AttributeMilitaria` text NOT NULL,
  `Darstellungsweise` text NOT NULL,
  `Dekoration` text NOT NULL,
  `Dekorationsart` text NOT NULL,
  `Stilnachahmung` text NOT NULL,
  `Eingabenummer` text NOT NULL,
  `erhalteneForm` text NOT NULL,
  `ErhaltungTraeger` text NOT NULL,
  `Form` text NOT NULL,
  `FormatRundplastik` text NOT NULL,
  `FormatRelieftraeger` text NOT NULL,
  `VorbildStatus` text NOT NULL,
  `Geschlecht` text NOT NULL,
  `Guertung` text NOT NULL,
  `Haarfrisur` text NOT NULL,
  `Haarzopf` text NOT NULL,
  `Haltung` text NOT NULL,
  `HaltungArmLinks` text NOT NULL,
  `HaltungHandLinks` text NOT NULL,
  `HaltungArmRechts` text NOT NULL,
  `HaltungHandRechts` text NOT NULL,
  `HoeheKopf` text NOT NULL,
  `HoeheStatue` text NOT NULL,
  `HoeheUrspruenglich` text NOT NULL,
  `Kopfbedeckung` text NOT NULL,
  `Kopfbeschreibung` text NOT NULL,
  `Kopfwendung` text NOT NULL,
  `Kuenstler` text NOT NULL,
  `MessungKopf` text NOT NULL,
  `MessungStatue` text NOT NULL,
  `Provenienz` text NOT NULL,
  `reliefiert` text NOT NULL,
  `Relieftypus` text NOT NULL,
  `Rufname` text NOT NULL,
  `Schuhwerk` text NOT NULL,
  `Standbein` text NOT NULL,
  `Statuenstuetze` text NOT NULL,
  `Stirnhaar` text NOT NULL,
  `Taetigkeit` text NOT NULL,
  `Thema` text NOT NULL,
  `ThemaGoetter` text NOT NULL,
  `ThemaHeroen` text NOT NULL,
  `ThemaMenschen` text NOT NULL,
  `ThemaMythos` text NOT NULL,
  `ThemaPflanzen` text NOT NULL,
  `ThemaFrei` text NOT NULL,
  `ThemaTiere` text NOT NULL,
  `ThemaWeitere` text NOT NULL,
  `TraegerAllgemein` text NOT NULL,
  `AttributeSchmuck` text NOT NULL,
  `Vergleiche` text NOT NULL,
  `VergleicheSujet` text NOT NULL,
  `Wandstaerke` text NOT NULL,
  `VorbildWesen` text NOT NULL,
  `VorbildWesen2` text NOT NULL,
  `wissKommentar` text NOT NULL,
  `oaipmhsetObjektplastik` varchar(256) NOT NULL DEFAULT 'objektplastik',
  PRIMARY KEY (`PS_ObjektplastikID`),
  KEY `VorbildWesen` (`VorbildWesen`(255)),
  KEY `VorbildWesen2` (`VorbildWesen2`(255)),
  CONSTRAINT `objektplastik_ibfk_1` FOREIGN KEY (`PS_ObjektplastikID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektplomben`
--

DROP TABLE IF EXISTS `objektplomben`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektplomben` (
  `PS_ObjektplombenID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `pCMSNR` varchar(255) DEFAULT NULL,
  `pINVNR` varchar(255) DEFAULT NULL,
  `pALTERNATIV` varchar(255) DEFAULT NULL,
  `pMUSEUM` varchar(255) DEFAULT NULL,
  `pFUNDLAND` varchar(255) DEFAULT NULL,
  `pBEREICH` varchar(255) DEFAULT NULL,
  `pORTREGION` varchar(255) DEFAULT NULL,
  `pFLORTSTEIL` varchar(255) DEFAULT NULL,
  `pFUNDPLATZ` varchar(255) DEFAULT NULL,
  `pPLATZTYPUS` varchar(255) DEFAULT NULL,
  `pPLOMBENFORM` varchar(255) DEFAULT NULL,
  `pERHALTUNG` varchar(255) DEFAULT NULL,
  `pSCHRIFT` varchar(255) DEFAULT NULL,
  `pKONTEXTDAT` varchar(255) DEFAULT NULL,
  `oaipmhsetObjektplomben` varchar(256) NOT NULL DEFAULT 'objektplomben',
  PRIMARY KEY (`PS_ObjektplombenID`),
  CONSTRAINT `objektplomben_ibfk_1` FOREIGN KEY (`PS_ObjektplombenID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektsiegel`
--

DROP TABLE IF EXISTS `objektsiegel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektsiegel` (
  `PS_ObjektsiegelID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `CMSNR` varchar(255) DEFAULT NULL,
  `cmsnrX` varchar(255) DEFAULT NULL,
  `CMSAENDER` varchar(255) DEFAULT NULL,
  `FUNDLAND` varchar(255) DEFAULT NULL,
  `BEREICH` varchar(255) DEFAULT NULL,
  `ORTREGION` varchar(255) DEFAULT NULL,
  `FLORTSTEIL` varchar(255) DEFAULT NULL,
  `FUNDPLATZ` varchar(255) DEFAULT NULL,
  `PLATZTYPUS` varchar(255) DEFAULT NULL,
  `KONTEXTDAT` varchar(255) DEFAULT NULL,
  `SITYPUS` varchar(255) DEFAULT NULL,
  `SIFANZAHL` varchar(255) DEFAULT NULL,
  `SIFRAGMENT` varchar(255) DEFAULT NULL,
  `SIZUSTAND` varchar(255) DEFAULT NULL,
  `SIFWOELBUNG` varchar(255) DEFAULT NULL,
  `SIFUMRISS` varchar(255) DEFAULT NULL,
  `SINEBENS` varchar(255) DEFAULT NULL,
  `SONSTMERK` varchar(255) DEFAULT NULL,
  `SIFMAT` varchar(255) DEFAULT NULL,
  `DEKORTECH` varchar(255) DEFAULT NULL,
  `FADENMAX` double DEFAULT NULL,
  `FADENMIN` double DEFAULT NULL,
  `SILAENGE` double DEFAULT NULL,
  `SIBREITE` double DEFAULT NULL,
  `SIDICKE` double DEFAULT NULL,
  `STILGRUPPE` varchar(255) DEFAULT NULL,
  `STILDAT` varchar(255) DEFAULT NULL,
  `sINVNR` varchar(255) DEFAULT NULL,
  `sMUSEUM` varchar(255) DEFAULT NULL,
  `LINK` varchar(255) DEFAULT NULL,
  `BOHRUNGEN` varchar(50) DEFAULT NULL,
  `DEKORTYPUS` varchar(255) DEFAULT NULL,
  `MAKROORNAMENT` varchar(255) DEFAULT NULL,
  `STANDARDORN` varchar(255) DEFAULT NULL,
  `HANDLUNG` varchar(255) DEFAULT NULL,
  `sPFLANZEN` varchar(255) DEFAULT NULL,
  `SYMBOLE` varchar(255) DEFAULT NULL,
  `GERAETE` varchar(255) DEFAULT NULL,
  `MOEBELBAU` varchar(255) DEFAULT NULL,
  `GELAENDE` varchar(255) DEFAULT NULL,
  `UNKLASS` varchar(255) DEFAULT NULL,
  `KOMPOSITIO` varchar(255) DEFAULT NULL,
  `GRUPPE` varchar(255) DEFAULT NULL,
  `SCHRIFT` varchar(255) DEFAULT NULL,
  `Abdruck` tinyint(1) DEFAULT NULL,
  `CMSBand` varchar(10) DEFAULT NULL,
  `MATERIALGRUPPE` varchar(255) DEFAULT NULL,
  `ZEITSTUFE` varchar(255) DEFAULT NULL,
  `KOMMENTAR` varchar(255) DEFAULT NULL,
  `MARKREGULAR` tinyint(4) DEFAULT '0',
  `oaipmhsetObjektsiegel` varchar(256) NOT NULL DEFAULT 'objektsiegel',
  PRIMARY KEY (`PS_ObjektsiegelID`),
  KEY `CMSNR` (`CMSNR`),
  KEY `cmsnrX` (`cmsnrX`),
  KEY `CMSBand` (`CMSBand`),
  KEY `sINVNR` (`sINVNR`),
  KEY `ORTREGION` (`ORTREGION`),
  KEY `STILGRUPPE` (`STILGRUPPE`),
  CONSTRAINT `objektsiegel_ibfk_1` FOREIGN KEY (`PS_ObjektsiegelID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektterrakotten`
--

DROP TABLE IF EXISTS `objektterrakotten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektterrakotten` (
  `PS_ObjektterrakottenID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `Anbringung` text NOT NULL,
  `Aufnahmedesiderate` text NOT NULL,
  `Beschreibung` text NOT NULL,
  `Besonderheit` text NOT NULL,
  `depotfremdeRepliken` text NOT NULL,
  `EingabenummerTerrakotten` text NOT NULL,
  `GenerationKoerper` text NOT NULL,
  `GenerationKopf` text NOT NULL,
  `GenerationKopfKoerper` text NOT NULL,
  `KatalogtextNoelke` text NOT NULL,
  `MatrserKoerper` text NOT NULL,
  `MatrserKopf` text NOT NULL,
  `MatrserKopfKoerper` text NOT NULL,
  `PatrizenqualitaetPur` text NOT NULL,
  `persNotizen` text NOT NULL,
  `Produktionsort` varchar(255) NOT NULL DEFAULT '',
  `StammCode` text NOT NULL,
  `Terrakottentyp` text NOT NULL,
  `Tonsorte` text NOT NULL,
  `Tonkonsistenz` text NOT NULL,
  `Tonfarbe` text NOT NULL,
  `Ueberarbeitung` text NOT NULL,
  `VariationKoerper` text NOT NULL,
  `VariationKopf` text NOT NULL,
  `VariationKopfKoerper` text NOT NULL,
  `Variationsart` text NOT NULL,
  `KomplexDatierung` text NOT NULL,
  `oaipmhsetObjektterrakotten` varchar(256) NOT NULL DEFAULT 'objektterrakotten',
  PRIMARY KEY (`PS_ObjektterrakottenID`),
  CONSTRAINT `objektterrakotten_ibfk_1` FOREIGN KEY (`PS_ObjektterrakottenID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektxclone`
--

DROP TABLE IF EXISTS `objektxclone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektxclone` (
  `PS_ObjektxcloneID` mediumint(9) unsigned NOT NULL DEFAULT '0',
  `XFormBekroenungKreuz` text NOT NULL,
  `XFormBildfelderKreuz` text NOT NULL,
  `XFormRahmungKreuz` text NOT NULL,
  `XFormVerankerungKreuz` text NOT NULL,
  `XNamenMetz` text NOT NULL,
  `XSammelsuriumMetz` text NOT NULL,
  `XZwischenablageMetz` text NOT NULL,
  `XEingangsnummer` text NOT NULL,
  `XFundstelle` text NOT NULL,
  `XSchicht` text NOT NULL,
  `XKoordinateX` text NOT NULL,
  `XKoordinateY` text NOT NULL,
  `XKoordinateZ` text NOT NULL,
  `XKorinthHKalathLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthHAbaLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthHKranzLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthHHochblattLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthAnzLappenLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthAnzFingerLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthHStuetzLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthHLippeLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthHEierLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthBEierLipps` varchar(100) NOT NULL DEFAULT '',
  `XKorinthEierLipps` varchar(20) NOT NULL DEFAULT '',
  `XIonDmVoluteLipps` varchar(100) NOT NULL DEFAULT '',
  `XIonBBalteusLipps` varchar(100) NOT NULL DEFAULT '',
  `XIonH1AkanthusLipps` varchar(100) NOT NULL DEFAULT '',
  `XIonH2AkanthusLipps` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`PS_ObjektxcloneID`),
  CONSTRAINT `objektxclone_ibfk_1` FOREIGN KEY (`PS_ObjektxcloneID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektzuobjekt`
--

DROP TABLE IF EXISTS `objektzuobjekt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektzuobjekt` (
  `PS_ObjektzuobjektID` int(11) NOT NULL AUTO_INCREMENT,
  `FS_Objekt1ID` mediumint(8) unsigned DEFAULT NULL,
  `FS_Objekt2ID` mediumint(8) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_ObjektzuobjektID`),
  KEY `FS_Objekt1ID` (`FS_Objekt1ID`),
  KEY `FS_Objekt2ID` (`FS_Objekt2ID`)
) ENGINE=MyISAM AUTO_INCREMENT=15524 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `objektzusammengehoerigkeit`
--

DROP TABLE IF EXISTS `objektzusammengehoerigkeit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objektzusammengehoerigkeit` (
  `PS_ObjektzusammengehoerigkeitID` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ObjektA_ID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `FS_ObjektB_ID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `KommentarObjekte` text NOT NULL,
  PRIMARY KEY (`PS_ObjektzusammengehoerigkeitID`),
  KEY `FS_ObjektA_ID` (`FS_ObjektA_ID`),
  KEY `FS_ObjektB_ID` (`FS_ObjektB_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `old_datenblatt_berlin`
--

DROP TABLE IF EXISTS `old_datenblatt_berlin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `old_datenblatt_berlin` (
  `PS_DatenblattBerlinID` int(6) NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` int(8) NOT NULL,
  `Name` varchar(510) NOT NULL,
  `Inventarnummer` varchar(255) NOT NULL,
  `Autor` varchar(255) NOT NULL,
  `Herkunft_Berlin` text NOT NULL,
  `Masze` text NOT NULL,
  `MaterialTechnik` text NOT NULL,
  `Erhaltung_Berlin` text NOT NULL,
  `Ergaenzungen` text NOT NULL,
  `Inschrift` text NOT NULL,
  `InventareArchivalien` text NOT NULL,
  `Kataloge` text NOT NULL,
  `Literatur` text NOT NULL,
  `Beschreibung_Berlin` text NOT NULL,
  `Datierung` text NOT NULL,
  `Interpretation` text NOT NULL,
  `Rezeption` text NOT NULL,
  `Standort` text NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_DatenblattBerlinID`),
  UNIQUE KEY `FS_ObjektID` (`FS_ObjektID`)
) ENGINE=InnoDB AUTO_INCREMENT=2782 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `old_datenblatt_berlin_inschrift`
--

DROP TABLE IF EXISTS `old_datenblatt_berlin_inschrift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `old_datenblatt_berlin_inschrift` (
  `PS_DatenblattBerlinInschriftID` int(10) NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` int(10) NOT NULL,
  `Inschrift_Anbringungsort` text NOT NULL,
  `Inschrift_Besonderheiten` text NOT NULL,
  `Inschrift_Buchstabenhoehe` text NOT NULL,
  `Inschrift_Zeilenabstand` text NOT NULL,
  `Inschrift_Interpunktion` text NOT NULL,
  `Inschrift_Wortlaut` text NOT NULL,
  `Inschrift_kritApparat` text NOT NULL,
  `Inschrift_Uebersetzung` text NOT NULL,
  `Inschrift_Literatur` text NOT NULL,
  `Inschrift_Kommentar` text NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_DatenblattBerlinInschriftID`),
  UNIQUE KEY `FS_ObjektID` (`FS_ObjektID`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oppenheimalbum`
--

DROP TABLE IF EXISTS `oppenheimalbum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oppenheimalbum` (
  `PS_OppenheimAlbumID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `DatensatzGruppeOppenheimAlbum_alt` varchar(255) NOT NULL DEFAULT 'Oppenheim',
  `DatensatzGruppeOppenheimAlbum` varchar(255) NOT NULL DEFAULT 'Oppenheim',
  `KurzbeschreibungOppenheimAlbum` text NOT NULL,
  `Bezugstabelle` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`PS_OppenheimAlbumID`),
  KEY `FS_DatensatzgruppeID` (`DatensatzGruppeOppenheimAlbum_alt`),
  KEY `DatensatzGruppeOppenheimAlbum` (`DatensatzGruppeOppenheimAlbum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ort`
--

DROP TABLE IF EXISTS `ort`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ort` (
  `PS_OrtID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `DatensatzGruppeOrt` varchar(255) NOT NULL DEFAULT 'Arachne',
  `Aufbewahrungsort` varchar(255) DEFAULT NULL,
  `Aufbewahrungsort_Synonym` varchar(255) DEFAULT NULL,
  `Ort_antik` text,
  `Stadt` varchar(100) DEFAULT NULL,
  `Stadt_Synonym` varchar(255) DEFAULT NULL,
  `Land` varchar(63) DEFAULT NULL,
  `Region` varchar(255) DEFAULT NULL,
  `Subregion` varchar(255) DEFAULT NULL,
  `continent` varchar(255) DEFAULT NULL,
  `continentCode` varchar(255) DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetOrt` varchar(256) NOT NULL DEFAULT 'ort',
  `Countrycode` varchar(2) DEFAULT NULL,
  `Geonamesid` int(11) DEFAULT NULL,
  `Gazetteerid` int(11) DEFAULT NULL,
  `Genauigkeit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_OrtID`),
  KEY `Aufbewahrungsort` (`Aufbewahrungsort`),
  KEY `Stadt` (`Stadt`),
  KEY `Land` (`Land`),
  KEY `continent` (`continent`),
  KEY `continentCode` (`continentCode`),
  KEY `Gazetteerid` (`Gazetteerid`),
  KEY `DatensatzgruppeOrt` (`DatensatzGruppeOrt`)
) ENGINE=InnoDB AUTO_INCREMENT=165515 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_ort` AFTER INSERT ON `ort` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='ort', `arachneentityidentification`.`ForeignKey`=NEW.`PS_OrtID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `ort_bkp`
--

DROP TABLE IF EXISTS `ort_bkp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ort_bkp` (
  `PS_OrtID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `DatensatzGruppeOrt` varchar(255) NOT NULL DEFAULT 'Arachne',
  `Aufbewahrungsort` varchar(255) DEFAULT NULL,
  `Aufbewahrungsort_Synonym` varchar(255) DEFAULT NULL,
  `Ort_antik` text,
  `Stadt` varchar(100) DEFAULT NULL,
  `Stadt_Synonym` varchar(255) DEFAULT NULL,
  `Land` varchar(63) DEFAULT NULL,
  `Region` varchar(255) DEFAULT NULL,
  `Subregion` varchar(255) DEFAULT NULL,
  `continent` varchar(255) DEFAULT NULL,
  `continentCode` varchar(255) DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetOrt` varchar(256) NOT NULL DEFAULT 'ort',
  `Countrycode` varchar(2) DEFAULT NULL,
  `Geonamesid` int(11) DEFAULT NULL,
  `Gazetteerid` int(11) DEFAULT NULL,
  `Genauigkeit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_OrtID`),
  KEY `Aufbewahrungsort` (`Aufbewahrungsort`),
  KEY `Stadt` (`Stadt`),
  KEY `Land` (`Land`),
  KEY `continent` (`continent`),
  KEY `continentCode` (`continentCode`),
  KEY `Gazetteerid` (`Gazetteerid`),
  KEY `DatensatzgruppeOrt` (`DatensatzGruppeOrt`)
) ENGINE=InnoDB AUTO_INCREMENT=165482 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ort_pre_full_import`
--

DROP TABLE IF EXISTS `ort_pre_full_import`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ort_pre_full_import` (
  `PS_OrtID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `Aufbewahrungsort` varchar(255) DEFAULT NULL,
  `Aufbewahrungsort_Synonym` varchar(255) DEFAULT NULL,
  `Ort_antik` text,
  `Stadt` varchar(100) DEFAULT NULL,
  `Stadt_Synonym` varchar(255) DEFAULT NULL,
  `Land` varchar(63) DEFAULT NULL,
  `Region` varchar(255) DEFAULT NULL,
  `Subregion` varchar(255) DEFAULT NULL,
  `continent` varchar(255) DEFAULT NULL,
  `continentCode` varchar(255) DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetOrt` varchar(256) NOT NULL DEFAULT 'ort',
  `Countrycode` varchar(2) DEFAULT NULL,
  `Geonamesid` int(11) DEFAULT NULL,
  `Gazetteerid` int(11) DEFAULT NULL,
  `Genauigkeit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_OrtID`),
  KEY `Aufbewahrungsort` (`Aufbewahrungsort`),
  KEY `Stadt` (`Stadt`),
  KEY `Land` (`Land`),
  KEY `continent` (`continent`),
  KEY `continentCode` (`continentCode`)
) ENGINE=InnoDB AUTO_INCREMENT=19242 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ort_pre_gazetteer`
--

DROP TABLE IF EXISTS `ort_pre_gazetteer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ort_pre_gazetteer` (
  `PS_OrtID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `Aufbewahrungsort` varchar(255) DEFAULT NULL,
  `Aufbewahrungsort_Synonym` varchar(255) DEFAULT NULL,
  `Ort_antik` text,
  `Stadt` varchar(100) DEFAULT NULL,
  `Stadt_Synonym` varchar(255) DEFAULT NULL,
  `Land` varchar(63) DEFAULT NULL,
  `Region` varchar(255) DEFAULT NULL,
  `Subregion` varchar(255) DEFAULT NULL,
  `continent` varchar(255) DEFAULT NULL,
  `continentCode` varchar(255) DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetOrt` varchar(256) NOT NULL DEFAULT 'ort',
  `Countrycode` varchar(2) DEFAULT NULL,
  `Geonamesid` int(11) DEFAULT NULL,
  `Gazetteerid` int(11) DEFAULT NULL,
  `Genauigkeit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_OrtID`),
  KEY `Aufbewahrungsort` (`Aufbewahrungsort`),
  KEY `Stadt` (`Stadt`),
  KEY `Land` (`Land`),
  KEY `continent` (`continent`),
  KEY `continentCode` (`continentCode`)
) ENGINE=InnoDB AUTO_INCREMENT=18777 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ortsbezug`
--

DROP TABLE IF EXISTS `ortsbezug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ortsbezug` (
  `PS_OrtsbezugID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_OrtID` mediumint(8) unsigned NOT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_MarbilderbestandID` int(10) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_PersonID` mediumint(8) unsigned DEFAULT NULL,
  `FS_FabricID` mediumint(8) DEFAULT NULL,
  `FS_BefundID` mediumint(8) DEFAULT NULL,
  `FS_IsolatedSherdID` mediumint(8) DEFAULT NULL,
  `FS_FabricDescriptionID` mediumint(8) DEFAULT NULL,
  `FS_GruppierungID` mediumint(8) unsigned DEFAULT NULL,
  `AltInvNr` varchar(255) DEFAULT NULL,
  `InvNr` varchar(255) DEFAULT NULL,
  `Zusatz` varchar(255) DEFAULT NULL,
  `Genauer` varchar(255) DEFAULT NULL COMMENT 'Hier kann eine Genauere Beschreibung der Orszuschribung über die Gebäudeebene hinaus beschreiben werden.',
  `Ursprungsinformationen` varchar(255) DEFAULT NULL COMMENT 'Falls die Ortsinformationen einer textuellen Beschreibung entspringt kann sie hier hinterlegt werden.',
  `ArtOrtsangabe` varchar(255) DEFAULT NULL,
  `BerlinIdentNr` varchar(255) DEFAULT NULL,
  `verborgen` varchar(8) DEFAULT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetOrtsbezug` varchar(256) NOT NULL DEFAULT 'ortsbezug',
  `AufbewahrungVonTag` tinyint(1) DEFAULT NULL,
  `AufbewahrungVonMonat` tinyint(1) DEFAULT NULL,
  `AufbewahrungVonJahr` smallint(4) DEFAULT NULL,
  `AufbewahrungBisTag` tinyint(1) DEFAULT NULL,
  `AufbewahrungBisMonat` tinyint(1) DEFAULT NULL,
  `AufbewahrungBisJahr` smallint(4) DEFAULT NULL,
  `DokumentationArt` varchar(255) DEFAULT NULL,
  `DokumentationBemerkungen` varchar(255) DEFAULT NULL,
  `ErwerbBemerkungen` varchar(255) DEFAULT NULL,
  `AktuelleAufbewahrung` varchar(255) DEFAULT NULL,
  `AngabeGesichert` varchar(255) DEFAULT NULL,
  `AntikeAufstellung` varchar(255) DEFAULT NULL,
  `ErwerbArt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_OrtsbezugID`),
  KEY `FS_OrtID` (`FS_OrtID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `InvNr` (`InvNr`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_MarbilderbestandID` (`FS_MarbilderbestandID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_GruppierungID` (`FS_GruppierungID`),
  KEY `FS_FabricID` (`FS_FabricID`),
  KEY `FS_FabricDescriptionID` (`FS_FabricDescriptionID`),
  KEY `FS_BefundID` (`FS_BefundID`),
  KEY `FS_IsolatedSherdID` (`FS_IsolatedSherdID`),
  KEY `AltInvNr` (`AltInvNr`),
  KEY `Zusatz` (`Zusatz`),
  KEY `ArtOrtsangabe` (`ArtOrtsangabe`)
) ENGINE=InnoDB AUTO_INCREMENT=1319589 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ortsbezug_leftjoin_ort`
--

DROP TABLE IF EXISTS `ortsbezug_leftjoin_ort`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ortsbezug_leftjoin_ort` (
  `PS_OrtsbezugID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `FS_OrtID` mediumint(8) unsigned NOT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_MarbilderbestandID` int(10) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_PersonID` mediumint(8) unsigned DEFAULT NULL,
  `FS_FabricID` mediumint(8) DEFAULT NULL,
  `FS_BefundID` mediumint(8) DEFAULT NULL,
  `FS_IsolatedSherdID` mediumint(8) DEFAULT NULL,
  `FS_FabricDescriptionID` mediumint(8) DEFAULT NULL,
  `FS_GruppierungID` mediumint(8) unsigned DEFAULT NULL,
  `AltInvNr` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `InvNr` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Zusatz` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Genauer` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT 'Hier kann eine Genauere Beschreibung der Orszuschribung über die Gebäudeebene hinaus beschreiben werden.',
  `Ursprungsinformationen` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT 'Falls die Ortsinformationen einer textuellen Beschreibung entspringt kann sie hier hinterlegt werden.',
  `ArtOrtsangabe` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `BerlinIdentNr` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `verborgen` varchar(8) CHARACTER SET utf8 DEFAULT NULL,
  `lastModified_ortsbezug` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `oaipmhsetOrtsbezug` varchar(256) CHARACTER SET utf8 NOT NULL DEFAULT 'ortsbezug',
  `AufbewahrungVonTag` tinyint(1) DEFAULT NULL,
  `AufbewahrungVonMonat` tinyint(1) DEFAULT NULL,
  `AufbewahrungVonJahr` smallint(4) DEFAULT NULL,
  `AufbewahrungBisTag` tinyint(1) DEFAULT NULL,
  `AufbewahrungBisMonat` tinyint(1) DEFAULT NULL,
  `AufbewahrungBisJahr` smallint(4) DEFAULT NULL,
  `DokumentationArt` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `DokumentationBemerkungen` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `ErwerbBemerkungen` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `AktuelleAufbewahrung` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `AngabeGesichert` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `AntikeAufstellung` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `ErwerbArt` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `PS_OrtID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `DatensatzGruppeOrt` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT 'Arachne',
  `Aufbewahrungsort` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Aufbewahrungsort_Synonym` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Ort_antik` text CHARACTER SET utf8,
  `Stadt` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `Stadt_Synonym` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Land` varchar(63) CHARACTER SET utf8 DEFAULT NULL,
  `Region` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Subregion` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `continent` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `continentCode` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `oaipmhsetOrt` varchar(256) CHARACTER SET utf8 NOT NULL DEFAULT 'ort',
  `Countrycode` varchar(2) CHARACTER SET utf8 DEFAULT NULL,
  `Geonamesid` int(11) DEFAULT NULL,
  `Gazetteerid` int(11) DEFAULT NULL,
  `Genauigkeit` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`PS_OrtsbezugID`),
  KEY `PS_OrtsbezugID` (`PS_OrtsbezugID`),
  KEY `FS_OrtID` (`FS_OrtID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_MarbilderbestandID` (`FS_MarbilderbestandID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_FabricID` (`FS_FabricID`),
  KEY `FS_BefundID` (`FS_BefundID`),
  KEY `FS_IsolatedSherdID` (`FS_IsolatedSherdID`),
  KEY `FS_FabricDescriptionID` (`FS_FabricDescriptionID`),
  KEY `FS_GruppierungID` (`FS_GruppierungID`),
  KEY `ArtOrtsangabe` (`ArtOrtsangabe`),
  KEY `AltInvNr` (`AltInvNr`),
  KEY `InvNr` (`InvNr`),
  KEY `Aufbewahrungsort` (`Aufbewahrungsort`),
  KEY `continent` (`continent`),
  KEY `continentCode` (`continentCode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ortsbezug_view_template`
--

DROP TABLE IF EXISTS `ortsbezug_view_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ortsbezug_view_template` (
  `PS_OrtsbezugID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `FS_OrtID` mediumint(8) unsigned NOT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_MarbilderbestandID` int(10) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `FS_PersonID` mediumint(8) unsigned DEFAULT NULL,
  `FS_FabricID` mediumint(8) DEFAULT NULL,
  `FS_BefundID` mediumint(8) DEFAULT NULL,
  `FS_IsolatedSherdID` mediumint(8) DEFAULT NULL,
  `FS_FabricDescriptionID` mediumint(8) DEFAULT NULL,
  `FS_GruppierungID` mediumint(8) unsigned DEFAULT NULL,
  `AltInvNr` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `InvNr` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Zusatz` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Genauer` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT 'Hier kann eine Genauere Beschreibung der Orszuschribung über die Gebäudeebene hinaus beschreiben werden.',
  `Ursprungsinformationen` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT 'Falls die Ortsinformationen einer textuellen Beschreibung entspringt kann sie hier hinterlegt werden.',
  `ArtOrtsangabe` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `BerlinIdentNr` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `verborgen` varchar(8) CHARACTER SET utf8 DEFAULT NULL,
  `lastModified_ortsbezug` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `oaipmhsetOrtsbezug` varchar(256) CHARACTER SET utf8 NOT NULL DEFAULT 'ortsbezug',
  `AufbewahrungVonTag` tinyint(1) DEFAULT NULL,
  `AufbewahrungVonMonat` tinyint(1) DEFAULT NULL,
  `AufbewahrungVonJahr` smallint(4) DEFAULT NULL,
  `AufbewahrungBisTag` tinyint(1) DEFAULT NULL,
  `AufbewahrungBisMonat` tinyint(1) DEFAULT NULL,
  `AufbewahrungBisJahr` smallint(4) DEFAULT NULL,
  `DokumentationArt` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `DokumentationBemerkungen` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `ErwerbBemerkungen` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `AktuelleAufbewahrung` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `AngabeGesichert` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `AntikeAufstellung` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `ErwerbArt` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `PS_OrtID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `DatensatzGruppeOrt` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT 'Arachne',
  `Aufbewahrungsort` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Aufbewahrungsort_Synonym` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Ort_antik` text CHARACTER SET utf8,
  `Stadt` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `Stadt_Synonym` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Land` varchar(63) CHARACTER SET utf8 DEFAULT NULL,
  `Region` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Subregion` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `continent` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `continentCode` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `oaipmhsetOrt` varchar(256) CHARACTER SET utf8 NOT NULL DEFAULT 'ort',
  `Countrycode` varchar(2) CHARACTER SET utf8 DEFAULT NULL,
  `Geonamesid` int(11) DEFAULT NULL,
  `Gazetteerid` int(11) DEFAULT NULL,
  `Genauigkeit` varchar(255) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person` (
  `PS_PersonID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `Cognomen` varchar(256) DEFAULT NULL,
  `CognomenSynonym1` varchar(256) DEFAULT NULL,
  `CognomenSynonym2` varchar(256) DEFAULT NULL,
  `CognomenSynonym3` varchar(256) DEFAULT NULL,
  `CognomenSynonym4` varchar(256) DEFAULT NULL,
  `VornameSonst` varchar(256) DEFAULT NULL,
  `VornameSonstSynonym1` varchar(256) DEFAULT NULL,
  `VornameSonstSynonym2` varchar(256) DEFAULT NULL,
  `VornameSonstSynonym3` varchar(256) DEFAULT NULL,
  `VornameSonstSynonym4` varchar(256) DEFAULT NULL,
  `FamVatersnameSonst` varchar(256) DEFAULT NULL,
  `FamVatersnameSonstSynonym1` varchar(256) DEFAULT NULL,
  `FamVatersnameSonstSynonym2` varchar(256) DEFAULT NULL,
  `FamVatersnameSonstSynonym3` varchar(256) DEFAULT NULL,
  `FamVatersnameSonstSynonym4` varchar(256) DEFAULT NULL,
  `Geschlecht` varchar(256) DEFAULT NULL,
  `Kurzbeschreibung` text,
  `Titel` varchar(256) DEFAULT NULL,
  `Namenszusatz` varchar(256) DEFAULT NULL,
  `Beiname` varchar(256) DEFAULT NULL,
  `EthnieNationalitaet` varchar(256) DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetPerson` varchar(256) NOT NULL DEFAULT 'person',
  `DatensatzGruppePerson` varchar(255) NOT NULL DEFAULT 'Arachne',
  `ArbeitsnotizPerson` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_PersonID`),
  KEY `DatensatzGruppePerson` (`DatensatzGruppePerson`),
  KEY `VornameSonst` (`VornameSonst`(255)),
  KEY `FamVatersnameSonst` (`FamVatersnameSonst`(255)),
  KEY `Titel` (`Titel`(255)),
  KEY `Kurzbeschreibung` (`Kurzbeschreibung`(255))
) ENGINE=InnoDB AUTO_INCREMENT=1115 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_person` BEFORE INSERT ON `person` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_person` AFTER INSERT ON `person` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='person', `arachneentityidentification`.`ForeignKey`= NEW.`PS_PersonID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDPerson` AFTER DELETE ON `person` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('person', OLD.`PS_PersonID`, OLD.`oaipmhsetPerson`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_PersonID` AND `arachneentityidentification`.`TableName` = 'person';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `personTEIthuc`
--

DROP TABLE IF EXISTS `personTEIthuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personTEIthuc` (
  `PS_PersonTEIthucID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `FS_PersonID` mediumint(8) unsigned NOT NULL,
  `thuc_id` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_PersonTEIthucID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  CONSTRAINT `personteithuc_ibfk_1` FOREIGN KEY (`FS_PersonID`) REFERENCES `person` (`PS_PersonID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personURI`
--

DROP TABLE IF EXISTS `personURI`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personURI` (
  `PS_PersonURIID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `FS_PersonID` mediumint(8) unsigned NOT NULL,
  `URI` varchar(256) NOT NULL,
  `Quelle` varchar(256) NOT NULL,
  PRIMARY KEY (`PS_PersonURIID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  CONSTRAINT `personuri_ibfk_1` FOREIGN KEY (`FS_PersonID`) REFERENCES `person` (`PS_PersonID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=232 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personobjekte`
--

DROP TABLE IF EXISTS `personobjekte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personobjekte` (
  `PS_PersonobjekteID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `FS_PersonID` mediumint(8) unsigned NOT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_InschriftID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BuchseiteID` mediumint(8) unsigned DEFAULT NULL,
  `Kommentar` text,
  PRIMARY KEY (`PS_PersonobjekteID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_InschriftID` (`FS_InschriftID`),
  KEY `FS_BuchID` (`FS_BuchID`),
  KEY `FS_BuchseiteID` (`FS_BuchseiteID`),
  CONSTRAINT `personobjekte_ibfk_1` FOREIGN KEY (`FS_PersonID`) REFERENCES `person` (`PS_PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personobjekte_ibfk_2` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personobjekte_ibfk_3` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personobjekte_ibfk_4` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personobjekte_ibfk_5` FOREIGN KEY (`FS_TypusID`) REFERENCES `typus` (`PS_TypusID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personobjekte_ibfk_6` FOREIGN KEY (`FS_InschriftID`) REFERENCES `inschrift` (`PS_InschriftID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personobjekte_ibfk_7` FOREIGN KEY (`FS_BuchseiteID`) REFERENCES `buchseite` (`PS_BuchseiteID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4528 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personsammlung`
--

DROP TABLE IF EXISTS `personsammlung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personsammlung` (
  `PS_PersonsammlungID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `FS_PersonID` mediumint(8) unsigned NOT NULL,
  `FS_SammlungenID` mediumint(8) unsigned NOT NULL,
  `Sammlerreihenfolge` varchar(256) DEFAULT NULL,
  `Verwandtschaftsverhaeltnis` text,
  PRIMARY KEY (`PS_PersonsammlungID`),
  KEY `FS_PersonID` (`FS_PersonID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  KEY `Sammlerreihenfolge` (`Sammlerreihenfolge`(255)),
  CONSTRAINT `personsammlung_ibfk_1` FOREIGN KEY (`FS_PersonID`) REFERENCES `person` (`PS_PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personsammlung_ibfk_2` FOREIGN KEY (`FS_SammlungenID`) REFERENCES `sammlungen` (`PS_SammlungenID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=817 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quantities`
--

DROP TABLE IF EXISTS `quantities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quantities` (
  `PS_QuantitiesID` mediumint(11) NOT NULL AUTO_INCREMENT,
  `PS_FMPQuantitiesID` mediumint(11) NOT NULL DEFAULT '-1',
  `RimCount` smallint(6) DEFAULT NULL,
  `HandleCount` smallint(6) DEFAULT NULL,
  `BaseCount` smallint(6) DEFAULT NULL,
  `BodySherdCount` smallint(6) DEFAULT NULL,
  `OthersCount` smallint(6) DEFAULT NULL,
  `RimWeight` float(10,2) DEFAULT NULL,
  `HandleWeight` float(10,2) DEFAULT NULL,
  `BodySherdWeight` float(10,2) DEFAULT NULL,
  `BaseWeight` float(10,2) DEFAULT NULL,
  `OthersWeight` float(10,2) DEFAULT NULL,
  `Joins` varchar(128) DEFAULT NULL,
  `MNI` smallint(6) DEFAULT NULL,
  `MXI` smallint(6) DEFAULT NULL,
  `RimPercentage` float(10,2) DEFAULT NULL,
  `MNIWeighted` float(10,2) DEFAULT NULL,
  `TotalSherds` smallint(6) DEFAULT NULL,
  `DatensatzGruppeQuantities` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_QuantitiesID`),
  KEY `PS_FMPQuantitiesID` (`PS_FMPQuantitiesID`)
) ENGINE=InnoDB AUTO_INCREMENT=7565 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `realien`
--

DROP TABLE IF EXISTS `realien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `realien` (
  `PS_RealienID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeRealien` varchar(255) NOT NULL DEFAULT 'Arachne',
  `LebensalterRealien` text NOT NULL,
  `AnzahlGegenstaendeRealien` text NOT NULL,
  `ArbeitsnotizRealien` varchar(255) NOT NULL,
  `Artillerie` text NOT NULL,
  `AttributAllg` text NOT NULL,
  `AttributSpez` text NOT NULL,
  `Auszeichnung` text NOT NULL,
  `BearbeiterRealien` text NOT NULL,
  `BearbeitungenRealien` text NOT NULL,
  `bekleidetRealien` text NOT NULL,
  `Belagerungsgeraet` text NOT NULL,
  `BemerkAngriffswaffen` text NOT NULL,
  `BemerkDekoration` text NOT NULL,
  `BemerkMilitaerzeichen` text NOT NULL,
  `BemerkFeldzeichen` text NOT NULL,
  `BemerkFigur` text NOT NULL,
  `BemerkGefaesse` text NOT NULL,
  `BemerkGeraet` text NOT NULL,
  `BemerkKriegsgeraet` text NOT NULL,
  `BemerkMilitaerkleidung` text NOT NULL,
  `BemerkMobiliar` text NOT NULL,
  `BemerkMonumente` text NOT NULL,
  `BemerkMusikinstrumente` text NOT NULL,
  `BemerkPflanzen` text NOT NULL,
  `BemerkSchutzwaffen` text NOT NULL,
  `BemerkTiere` text NOT NULL,
  `BenennungAllgRealien` text NOT NULL,
  `BenennungSpez` text NOT NULL,
  `BewaffnungAllg` text NOT NULL,
  `BewaffnungSpez` text NOT NULL,
  `DekorationRealien` text NOT NULL,
  `BearbeitungenModernRealien` text NOT NULL,
  `BearbeitungenAntikRealien` text NOT NULL,
  `ErhaltungRealien` text NOT NULL,
  `ErhaltungszustandRealien` text NOT NULL,
  `FarbresteRealien` text NOT NULL,
  `Feldzeichen` text NOT NULL,
  `Fernwaffen` text NOT NULL,
  `GefaeszeEssTrink` text NOT NULL,
  `GefaeszeGieszen` text NOT NULL,
  `GefaeszeKult` text NOT NULL,
  `GefaeszeSalben` text NOT NULL,
  `GefaeszeSonstige` text NOT NULL,
  `GefaeszeVorrat` text NOT NULL,
  `GeraeteHaushalt` text NOT NULL,
  `GeraeteKosmetik` text NOT NULL,
  `GeraeteSonstige` text NOT NULL,
  `GeraeteWerkzeuge` text NOT NULL,
  `GeschlechtRealien` text NOT NULL,
  `GuertungAllg` text NOT NULL,
  `GuertungSpez` text NOT NULL,
  `HaartrachtAllg` text NOT NULL,
  `HaartrachtSpez` text NOT NULL,
  `HaltungRealien` text NOT NULL,
  `Helm` text NOT NULL,
  `InschriftCorpusRealien` varchar(255) NOT NULL,
  `InschriftRealien` text NOT NULL,
  `InschriftSpracheRealien` varchar(255) NOT NULL,
  `KleidungAllg` text NOT NULL,
  `KleidungSpez` text NOT NULL,
  `KleidungBeschreibung` text NOT NULL,
  `KopfbedeckungAllg` text NOT NULL,
  `KopfbedeckungSpez` text NOT NULL,
  `KopfwendungRealien` text NOT NULL,
  `KorrektorRealien` text NOT NULL,
  `Kriegsguertung` text NOT NULL,
  `Kriegskleidung` text NOT NULL,
  `Kriegsschuhwerk` text NOT NULL,
  `KurzbeschreibungRealien` text NOT NULL,
  `Lokalisierung` text NOT NULL,
  `Militaereinheit` text NOT NULL,
  `MobiliarAufbewahrung` text NOT NULL,
  `MobiliarSitze` text NOT NULL,
  `MobiliarSonstiges` text NOT NULL,
  `MobiliarTextiles` text NOT NULL,
  `MobiliarTisch` text NOT NULL,
  `MonumentHaus` text NOT NULL,
  `MonumentKunstwerk` text NOT NULL,
  `MonumentSonstiges` text NOT NULL,
  `MonumentTempel` text NOT NULL,
  `Musikinstrumente` text NOT NULL,
  `Nahkampfwaffen` text NOT NULL,
  `NahkampfwaffenDetails` text NOT NULL,
  `Name` text NOT NULL,
  `Panzerung` text NOT NULL,
  `Pflanzen` text NOT NULL,
  `Rangzeichen` text NOT NULL,
  `RealienBreite` text NOT NULL,
  `RealienDurchmesser` text NOT NULL,
  `RealienHoehe` text NOT NULL,
  `RealienTiefe` text NOT NULL,
  `Realienart` text NOT NULL,
  `Realiennummer` text NOT NULL,
  `Richtung` text NOT NULL,
  `Schild` text NOT NULL,
  `SchmuckAllg` text NOT NULL,
  `SchmuckSpez` text NOT NULL,
  `SchuhwerkAllg` text NOT NULL,
  `SchuhwerkSpez` text NOT NULL,
  `Stangenwaffen` text NOT NULL,
  `TaetigkeitAllg` text NOT NULL,
  `TaetigkeitSpez` text NOT NULL,
  `TiereAttribut` text NOT NULL,
  `TiereFische` text NOT NULL,
  `TiereFunktion` text NOT NULL,
  `TiereMischwesen` text NOT NULL,
  `TiereSonstige` text NOT NULL,
  `TiereVierbeiner` text NOT NULL,
  `TiereVoegel` text NOT NULL,
  `ursprGroeszeRealien` text NOT NULL,
  `WesenRealien` text NOT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetRealien` varchar(256) NOT NULL DEFAULT 'realien',
  PRIMARY KEY (`PS_RealienID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `DatensatzGruppeRealien` (`DatensatzGruppeRealien`),
  KEY `KurzbeschreibungRealien` (`KurzbeschreibungRealien`(255)),
  CONSTRAINT `realien_ibfk_1` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=407632602 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_realien` BEFORE INSERT ON `realien` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_realien` AFTER INSERT ON `realien` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='realien', `arachneentityidentification`.`ForeignKey`=NEW.`PS_RealienID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDRealien` AFTER DELETE ON `realien` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('realien', OLD.`PS_RealienID`, OLD.`oaipmhsetRealien`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_RealienID` AND `arachneentityidentification`.`TableName` = 'realien';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `relief`
--

DROP TABLE IF EXISTS `relief`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relief` (
  `PS_ReliefID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` mediumint(8) unsigned NOT NULL,
  `FS_ObjektID_Reko` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeRelief` varchar(255) NOT NULL DEFAULT 'Arachne',
  `AnzahlFigurenRelief` text NOT NULL,
  `AnzahlGegenstaende` text NOT NULL,
  `AnzahlGoetterMythWesen` text NOT NULL,
  `AnzahlHeroenMenschen` text NOT NULL,
  `AnzahlMaennlich` text NOT NULL,
  `AnzahlTiere` text NOT NULL,
  `AnzahlUnbestimmt` text NOT NULL,
  `AnzahlWeiblich` text NOT NULL,
  `ArbeitsnotizRelief` varchar(255) NOT NULL,
  `BearbeiterRelief` text NOT NULL,
  `BearbeitungenRelief` text NOT NULL,
  `BemerkungenRelief` text NOT NULL,
  `BeschreibungHinten` text NOT NULL,
  `BeschreibungVorne` text NOT NULL,
  `BildImBild` text NOT NULL,
  `DekorationRelief` text NOT NULL,
  `BearbeitungenModernRelief` text NOT NULL,
  `BearbeitungenAntikRelief` text NOT NULL,
  `ErhaltungRelief` text NOT NULL,
  `ErhaltungszustandRelief` text,
  `FarbresteRelief` text,
  `HandlungAlltag` text,
  `HandlungBeruf` text,
  `HandlungBukolisch` text,
  `HandlungChristlich` text,
  `HandlungDionysisch` text,
  `HandlungHeerwesen` text,
  `HandlungHistorisch` text,
  `HandlungJagd` text,
  `HandlungLebenslauf` text,
  `HandlungMythos` text,
  `HandlungReligion` text,
  `HandlungSonstiges` text,
  `HandlungSport` text,
  `HandlungTransport` text,
  `InschriftCorpusRelief` varchar(255) NOT NULL,
  `InschriftRelief` text NOT NULL,
  `InschriftSpracheRelief` varchar(255) NOT NULL,
  `InschriftCorpusGriechRelief_OLD` text,
  `InschriftCorpusLateinRelief_OLD` text,
  `InschriftGriechRelief_OLD` text,
  `InschriftKommentarRelief` text,
  `InschriftLateinRelief_OLD` text,
  `InschriftPublikationRelief` text,
  `KorrektorRelief` text,
  `KurzbeschreibungRelief` text,
  `Personen` text,
  `PersonenGoetter` text,
  `PersonenGoetterWeitere` text,
  `PersonenHeroen` text,
  `PersonenHeroenWeitere` text,
  `PersonenIdentifiziert` text,
  `PersonenMenschen` text,
  `PersonenMenschenWeitere` text,
  `PersonenMythWesen` text,
  `PersonenMythWesenWeitere` text,
  `PersonenTiere` text,
  `PersonenTiereWeitere` text,
  `PositionGefaessRelief` varchar(255) NOT NULL,
  `PositionMosaikRelief` varchar(255) NOT NULL,
  `relevanteSeiteDrei` text,
  `relevanteSeiteEins` text,
  `relevanteSeiteVier` text,
  `relevanteSeiteZwei` text,
  `Relieferhebung` text,
  `Reliefgrunddicke` text,
  `SpezifizierungPosition` text,
  `SzeneBreite` text,
  `SzeneDurchmesser` text,
  `SzeneHoehe` text,
  `SzeneIst` text,
  `Szenennummer` smallint(10) unsigned NOT NULL DEFAULT '1',
  `Thematik` text,
  `ThematikAlltag` text,
  `ThematikBeruf` text,
  `ThematikBukolisch` text,
  `ThematikChristlich` text,
  `ThematikDionysisch` text,
  `ThematikHeerwesen` text,
  `ThematikHistorisch` text,
  `ThematikJagd` text,
  `ThematikLebenslauf` text,
  `ThematikMythos` text,
  `ThematikOrnamentik` text,
  `ThematikReligion` text,
  `ThematikSonstiges` text,
  `ThematikSport` text,
  `ThematikTransport` text,
  `ursprGroesze` text,
  `VergleicheRelief` text,
  `SzenennrLiteratur` varchar(15) NOT NULL DEFAULT '',
  `SzenennrLiteraturAutor` varchar(255) NOT NULL,
  `Ausrichtung` varchar(2) NOT NULL DEFAULT '',
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetRelief` varchar(256) NOT NULL DEFAULT 'relief',
  PRIMARY KEY (`PS_ReliefID`),
  KEY `FS_ObjektID_Reko` (`FS_ObjektID_Reko`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `DatensatzGruppeRelief` (`DatensatzGruppeRelief`),
  KEY `KurzbeschreibungRelief` (`KurzbeschreibungRelief`(255)),
  CONSTRAINT `relief_ibfk_1` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=300151373 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_relief` BEFORE INSERT ON `relief` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_relief` AFTER INSERT ON `relief` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='relief', `arachneentityidentification`.`ForeignKey`=NEW.`PS_ReliefID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDRelief` AFTER DELETE ON `relief` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('szenen', OLD.`PS_ReliefID`, OLD.`oaipmhsetRelief`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_ReliefID` AND `arachneentityidentification`.`TableName` = 'relief';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `reproduktion`
--

DROP TABLE IF EXISTS `reproduktion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reproduktion` (
  `PS_ReproduktionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ParentID` int(10) unsigned DEFAULT NULL,
  `ZweiDreiDimensional` varchar(255) DEFAULT NULL,
  `DatensatzGruppeReproduktion` varchar(255) NOT NULL DEFAULT 'Arachne',
  `AbguszformNr` text,
  `AbguszMitAltenErgaenzungen` text,
  `Abgusztechnik` text,
  `Ansicht` text,
  `ArbeitsnotizReproduktion` text NOT NULL,
  `ArtErwerbung` text,
  `Attribute` text,
  `Beschriftung` text,
  `BearbeiterReproduktion` text,
  `BearbeitungenReproduktion` text,
  `BemerkungenReproduktion` text,
  `BesonderheitenAbgusz` text,
  `Bezugsquelle` text,
  `BreiteGesamtRepro` text,
  `DurchmesserGesamtRepro` text,
  `ErgaenzungenReproduktion` text,
  `erhalteneFormReproduktion` text,
  `ErhaltungReproduktion` text,
  `ErhaltungszustandReproduktion` text,
  `Erwerbsdatum` varchar(255) DEFAULT NULL,
  `ErworbenVon` text,
  `EuroDMPreis` text,
  `EuroDMVersicherung` text,
  `Farbigkeit` text,
  `FormatReproduktion` text,
  `funktionaleVerwendungRepro` text,
  `GattungAllg` text,
  `GattungSpeziell` text,
  `GottGoettin` text,
  `HerkunftSlg` text,
  `Hersteller` text,
  `HoeheGesamtRepro` text,
  `HoeheKopfRepro` text,
  `HoeheStatueRepro` text,
  `KorrektorReproduktion` text,
  `KuenstlerErgaenzungen` text,
  `KuenstlerReproduktion` text,
  `KuenstlerSignatur` text,
  `KurzbeschreibungReproduktion` text,
  `MaterialReproduktion` text,
  `ModellBauphase` varchar(255) DEFAULT NULL,
  `ModellMaszstab` varchar(255) DEFAULT NULL,
  `MaterialbeschreibungRepro` text,
  `MessungKopfRepro` text,
  `MessungStatueRepro` text,
  `Mischwesen` text,
  `Preis` text,
  `PreisImEigenenVerkauf` varchar(256) DEFAULT NULL,
  `ReproRestauroBeschreibung` text NOT NULL,
  `ReproRestauroMaterialBemerk` text NOT NULL,
  `ReproMaszeBemerk` text NOT NULL,
  `ReproRestauroHerstell` text NOT NULL,
  `ReproRestauroBeschreibungVorzustand` text NOT NULL,
  `ReproRestauroMasznahmen` text NOT NULL,
  `ReproRestauroMasznahmenFruehere` text NOT NULL,
  `ReproRestauroRestaurier` text NOT NULL,
  `ReproRestauroZeitraum` text NOT NULL,
  `ReproRestauroDurchgefuehrtVon` text NOT NULL,
  `ReproRestauroAnalyseZiel` text NOT NULL,
  `ReproRestauroAnalyseMasznahmenMethoden` text NOT NULL,
  `ReproRestauroAnalyseDurchgefuehrtVon` text NOT NULL,
  `ReproRestauroAnalyseZeitraum` text NOT NULL,
  `ReproRestauroAnalyseErgebnis` text NOT NULL,
  `sonstigeAbweichungen` text,
  `sonstigeErgaenzungen` text,
  `StifterLeihgeber` text,
  `TechnikFlaechenkunstReproduktion` text,
  `TechnikReproduktion` text,
  `Teilabgusz` text,
  `TiefeGesamtRepro` text,
  `TraegerFlaechenkunst` text,
  `Umgebung` text,
  `Veraenderungen` text,
  `Versicherungswert` text,
  `Vorlagevorhanden` varchar(255) DEFAULT NULL,
  `Kuenstlerzuschreibung` text,
  `wissKommentarRepro` text,
  `Zusammensetzung` text,
  `GrundformReproduktion` text,
  `GleicheGipsformInvNr` varchar(255) DEFAULT NULL,
  `GleicheGipsformStandort` text,
  `GleicheGipsformSeriennummer` int(11) DEFAULT NULL,
  `ImportTmp` varchar(255) DEFAULT NULL,
  `IstEntliehen` varchar(8) DEFAULT NULL,
  `FuehrungsblattVorhanden` varchar(256) DEFAULT NULL,
  `Versicherung` text,
  `Besitzverhaeltnisse` text,
  `Vertraege` text,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ReproduktionErwerbUmstand` varchar(256) DEFAULT NULL,
  `ReproduktionGewicht` varchar(256) DEFAULT NULL,
  `ReproRestauroIntern` text,
  `ReproAnmerkungenForm` varchar(256) DEFAULT NULL,
  `ReproFormVerkauf` varchar(256) DEFAULT NULL,
  `ReproQualitaet` varchar(256) DEFAULT NULL,
  `ReproQualitaetZusatz` varchar(256) DEFAULT NULL,
  `ReproKuenstlerVorbildGemaelde` varchar(255) DEFAULT NULL,
  `ReproBezeichnet` varchar(255) DEFAULT NULL,
  `ReproUntenLinks` varchar(255) DEFAULT NULL,
  `ReproUntenMitte` varchar(255) DEFAULT NULL,
  `ReproUntenRechts` varchar(255) DEFAULT NULL,
  `ReproObenLinks` varchar(255) DEFAULT NULL,
  `ReproObenMitte` varchar(255) DEFAULT NULL,
  `ReproObenRechts` varchar(255) DEFAULT NULL,
  `ReproBildMasze` varchar(255) DEFAULT NULL,
  `ReproPlatteMasze` varchar(255) DEFAULT NULL,
  `ReproBlattMasze` varchar(255) DEFAULT NULL,
  `ReproBeschreibungGemaelde` varchar(255) DEFAULT NULL,
  `ReproZustandGemaelde` varchar(255) DEFAULT NULL,
  `tempAlteObjektID` varchar(255) DEFAULT NULL,
  `ReproWiederbeschaffung` varchar(256) DEFAULT NULL,
  `oaipmhsetReproduktion` varchar(256) NOT NULL DEFAULT 'reproduktion',
  PRIMARY KEY (`PS_ReproduktionID`),
  KEY `ParentID` (`ParentID`),
  KEY `DatensatzGruppeReproduktion` (`DatensatzGruppeReproduktion`),
  KEY `HerkunftSlg` (`HerkunftSlg`(255)),
  KEY `KurzbeschreibungReproduktion` (`KurzbeschreibungReproduktion`(255)),
  KEY `StifterLeihgeber` (`StifterLeihgeber`(255)),
  KEY `ArtErwerbung` (`ArtErwerbung`(255)),
  KEY `TechnikReproduktion` (`TechnikReproduktion`(255)),
  KEY `MaterialReproduktion` (`MaterialReproduktion`(255))
) ENGINE=InnoDB AUTO_INCREMENT=3320189 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_reproduktion` BEFORE INSERT ON `reproduktion` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_reproduktion` AFTER INSERT ON `reproduktion` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='reproduktion', `arachneentityidentification`.`ForeignKey`=NEW.`PS_ReproduktionID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDReproduktion` AFTER DELETE ON `reproduktion` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('reproduktion', OLD.`PS_ReproduktionID`, OLD.`oaipmhsetReproduktion`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_ReproduktionID` AND `arachneentityidentification`.`TableName` = 'reproduktion';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `reproduktion_bauwerksteil`
--

DROP TABLE IF EXISTS `reproduktion_bauwerksteil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reproduktion_bauwerksteil` (
  `PS_Reproduktion_bauwerksteilID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ReproduktionID` int(10) unsigned NOT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`PS_Reproduktion_bauwerksteilID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  CONSTRAINT `reproduktion_bauwerksteil_ibfk_1` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reproduktion_bauwerksteil_ibfk_2` FOREIGN KEY (`FS_BauwerksteilID`) REFERENCES `bauwerksteil` (`PS_BauwerksteilID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reproduktionsgruppen`
--

DROP TABLE IF EXISTS `reproduktionsgruppen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reproduktionsgruppen` (
  `PS_ReproduktionsgruppenID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ReproduktionID` int(10) unsigned NOT NULL,
  `FS_GruppenID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`PS_ReproduktionsgruppenID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  CONSTRAINT `reproduktionsgruppen_ibfk_1` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reproduktionsgruppen_ibfk_2` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=372 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reproduktionsobjekte`
--

DROP TABLE IF EXISTS `reproduktionsobjekte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reproduktionsobjekte` (
  `PS_ReproduktionsobjekteID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenrekonstruktionID` int(10) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `Spezifizierung` text NOT NULL,
  PRIMARY KEY (`PS_ReproduktionsobjekteID`),
  KEY `FS_GruppenrekonstruktionID` (`FS_GruppenrekonstruktionID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  CONSTRAINT `reproduktionsobjekte_ibfk_1` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reproduktionsobjekte_ibfk_2` FOREIGN KEY (`FS_RealienID`) REFERENCES `realien` (`PS_RealienID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reproduktionsobjekte_ibfk_3` FOREIGN KEY (`FS_ReliefID`) REFERENCES `relief` (`PS_ReliefID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reproduktionsobjekte_ibfk_4` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reproduktionsobjekte_ibfk_5` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reproduktionsobjekte_ibfk_6` FOREIGN KEY (`FS_GruppenrekonstruktionID`) REFERENCES `gruppenrekonstruktion` (`PS_GruppenrekonstruktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reproduktionsobjekte_ibfk_7` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reproduktionsobjekte_ibfk_8` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20151 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rezeption`
--

DROP TABLE IF EXISTS `rezeption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rezeption` (
  `PS_RezeptionID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FunddatumRezeption` text NOT NULL,
  `AdressatRezeption` text NOT NULL,
  `AntikerAufstellungsortRezeption` text NOT NULL,
  `ArbeitsnotizRezeption` varchar(255) NOT NULL,
  `AuftraggeberRezeption` text NOT NULL,
  `BearbeiterRezeption` text NOT NULL,
  `BemerkungenClarac` text NOT NULL,
  `BeschreibungClarac` text NOT NULL,
  `BreiteGesamtRezeption` text NOT NULL,
  `DarstellungErgaenzt` text NOT NULL,
  `DurchmesserGesamtRezeption` text NOT NULL,
  `ergImStich` text NOT NULL,
  `ErhaltungRezeption` text NOT NULL,
  `ErhaltungszustandRezeption` text NOT NULL,
  `FundkontextRezeption` text NOT NULL,
  `FarbresteRezeption` text NOT NULL,
  `HerkunftKommentar` text NOT NULL,
  `HerkunftSlgRezeption` text NOT NULL,
  `HoeheGesamtRezeption` text NOT NULL,
  `InschriftRezeption` text NOT NULL,
  `InschriftSpracheRezeption` varchar(255) NOT NULL,
  `InschriftGriechischRezeption_OLD` text NOT NULL,
  `InschriftLateinRezeption_OLD` text NOT NULL,
  `InschriftKommentarRezeption` text NOT NULL,
  `KatalogtextRezeption` text NOT NULL,
  `KopfparameterClarac` text NOT NULL,
  `KulturkreisRezeption` text NOT NULL,
  `MaterialRezeption` text NOT NULL,
  `MaterialbeschreibungRezeption` text NOT NULL,
  `Rezeptionsquelle` text NOT NULL,
  `spiegelverkehrt` text NOT NULL,
  `Stichbesonderheiten` text NOT NULL,
  `TiefeGesamtRezeption` text NOT NULL,
  `verschollen` text NOT NULL,
  `wissKommentarRezeption` text NOT NULL,
  `KurzbeschreibungRezeption` text NOT NULL,
  `DatensatzGruppeRezeption` varchar(255) NOT NULL DEFAULT 'Arachne',
  `KorrektorRezeption` text NOT NULL,
  `BearbeitungenModernRezeption` text NOT NULL,
  `BearbeitungenRezeption` text NOT NULL,
  `FundortRezeption` text NOT NULL,
  `FundstaatRezeption` text NOT NULL,
  `FunktionaleVerwendungRezeption` text NOT NULL,
  `FunktionRezeption` text NOT NULL,
  `GattungAllgemeinRezeption` text NOT NULL,
  `TypuszuschreibungClarac` text NOT NULL,
  `StandortRezeption` varchar(255) NOT NULL DEFAULT '',
  `StandstaatRezeption` varchar(255) NOT NULL DEFAULT '',
  `AufbewahrungsortRezeption` varchar(255) NOT NULL DEFAULT '',
  `InvNrRezeption` varchar(255) NOT NULL DEFAULT '',
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetRezeption` varchar(256) NOT NULL DEFAULT 'rezeption',
  PRIMARY KEY (`PS_RezeptionID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `DatensatzGruppeRezeption` (`DatensatzGruppeRezeption`),
  KEY `KurzbeschreibungRezeption` (`KurzbeschreibungRezeption`(255))
) ENGINE=InnoDB AUTO_INCREMENT=351527 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_rezeption` BEFORE INSERT ON `rezeption` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_rezeption` AFTER INSERT ON `rezeption` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='rezeption', `arachneentityidentification`.`ForeignKey`=NEW.`PS_RezeptionID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDRezeption` AFTER DELETE ON `rezeption` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('rezeption', OLD.`PS_RezeptionID`, OLD.`oaipmhsetRezeption`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_RezeptionID` AND `arachneentityidentification`.`TableName` = 'rezeption';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `rezeptiongruppen`
--

DROP TABLE IF EXISTS `rezeptiongruppen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rezeptiongruppen` (
  `PS_RezeptiongruppenID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_RezeptiongruppenID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  CONSTRAINT `rezeptiongruppen_ibfk_1` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rezeptiongruppen_ibfk_2` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rezeptionreliefszene`
--

DROP TABLE IF EXISTS `rezeptionreliefszene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rezeptionreliefszene` (
  `PS_RezeptionreliefszeneID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_RezeptionreliefszeneID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  CONSTRAINT `rezeptionreliefszene_ibfk_1` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rezeptionreliefszene_ibfk_2` FOREIGN KEY (`FS_ReliefID`) REFERENCES `relief` (`PS_ReliefID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rezeptionsbauwerke`
--

DROP TABLE IF EXISTS `rezeptionsbauwerke`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rezeptionsbauwerke` (
  `PS_RezeptionsbauwerkeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_RezeptionsbauwerkeID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  CONSTRAINT `rezeptionsbauwerke_ibfk_1` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rezeptionsbauwerke_ibfk_2` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=350444 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rezeptionsobjekte`
--

DROP TABLE IF EXISTS `rezeptionsobjekte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rezeptionsobjekte` (
  `PS_RezeptionsobjekteID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_RezeptionID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_RezeptionsobjekteID`),
  KEY `FS_RezeptionID` (`FS_RezeptionID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  CONSTRAINT `rezeptionsobjekte_ibfk_1` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rezeptionsobjekte_ibfk_2` FOREIGN KEY (`FS_RezeptionID`) REFERENCES `rezeption` (`PS_RezeptionID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3623 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sammlungen`
--

DROP TABLE IF EXISTS `sammlungen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sammlungen` (
  `PS_SammlungenID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `DatensatzGruppeSammlungen` varchar(255) NOT NULL DEFAULT 'Arachne',
  `AnmerkungSammlungen` text NOT NULL,
  `ArbeitsnotizSammlungen` varchar(255) NOT NULL,
  `Aufloesung` text NOT NULL,
  `AufloesungArt` text NOT NULL,
  `AufloesungDatum` text NOT NULL,
  `AufstellungSammlungen` text NOT NULL,
  `BearbeiterSammlungen` text NOT NULL,
  `Entstehung` text NOT NULL,
  `EntstehungDatum` text NOT NULL,
  `GeschichteSammlungen` text NOT NULL,
  `Herkunftsland` text NOT NULL,
  `Hinweise` text NOT NULL,
  `KorrektorSammlungen` text NOT NULL,
  `Logbuch` text NOT NULL,
  `KurzbeschreibungSammlungen` text NOT NULL,
  `Quellen` text NOT NULL,
  `regional` text NOT NULL,
  `Sammlungskategorie` text NOT NULL,
  `Vasen` text NOT NULL,
  `vollstaendig` text NOT NULL,
  `Weiterverarbeitung` text NOT NULL,
  `OrtSammlungen` text NOT NULL,
  `LandSammlungen` text NOT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetSammlungen` varchar(256) NOT NULL DEFAULT 'sammlungen',
  PRIMARY KEY (`PS_SammlungenID`),
  KEY `DatensatzGruppeSammlungen` (`DatensatzGruppeSammlungen`),
  KEY `KurzbeschreibungSammlungen` (`KurzbeschreibungSammlungen`(255))
) ENGINE=InnoDB AUTO_INCREMENT=1006197 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_sammlungen` BEFORE INSERT ON `sammlungen` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_sammlungen` AFTER INSERT ON `sammlungen` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='sammlungen', `arachneentityidentification`.`ForeignKey`=NEW.`PS_SammlungenID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDSammlungen` AFTER DELETE ON `sammlungen` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('sammlungen', OLD.`PS_SammlungenID`, OLD.`oaipmhsetSammlungen`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_SammlungenID` AND `arachneentityidentification`.`TableName` = 'sammlungen';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `sammlungenzubauwerke`
--

DROP TABLE IF EXISTS `sammlungenzubauwerke`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sammlungenzubauwerke` (
  `PS_SammlungenzubauwerkeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_BauwerkID` mediumint(8) unsigned NOT NULL,
  `FS_SammlungenID` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`PS_SammlungenzubauwerkeID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  CONSTRAINT `sammlungenzubauwerke_ibfk_1` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sammlungenzubauwerke_ibfk_2` FOREIGN KEY (`FS_SammlungenID`) REFERENCES `sammlungen` (`PS_SammlungenID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sammlungsobjekte`
--

DROP TABLE IF EXISTS `sammlungsobjekte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sammlungsobjekte` (
  `PS_SammlungsobjekteID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ObjektID` mediumint(9) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  `FS_BauwerksteilID` mediumint(8) unsigned DEFAULT NULL,
  `BemerkungenSlgsobjekte` text NOT NULL,
  `Sammlungsnummer` mediumint(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`PS_SammlungsobjekteID`),
  KEY `FS_SammlungID` (`FS_SammlungenID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_BauwerksteilID` (`FS_BauwerksteilID`),
  CONSTRAINT `sammlungsobjekte_ibfk_1` FOREIGN KEY (`FS_SammlungenID`) REFERENCES `sammlungen` (`PS_SammlungenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sammlungsobjekte_ibfk_2` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sammlungsobjekte_ibfk_3` FOREIGN KEY (`FS_BauwerksteilID`) REFERENCES `bauwerksteil` (`PS_BauwerksteilID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sammlungsobjekte_ibfk_4` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sammlungsobjekte_ibfk_5` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=158328 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sarkophag`
--

DROP TABLE IF EXISTS `sarkophag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sarkophag` (
  `PS_SarkophagID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `DatensatzGruppeSarkophag` varchar(255) NOT NULL DEFAULT 'Arachne',
  `Dekoration` text NOT NULL,
  `Fundkontext` text NOT NULL,
  `Fundort` text NOT NULL,
  `Fundstaat` varchar(255) NOT NULL DEFAULT '',
  `Gattung` varchar(255) NOT NULL DEFAULT '',
  `KurzbeschreibungSarkophag` varchar(255) NOT NULL DEFAULT '',
  `Material` varchar(255) NOT NULL DEFAULT '',
  `Thematik` text NOT NULL,
  `ThematikDeckel` text NOT NULL,
  `ThematikDeckelNebenseiten` text NOT NULL,
  `ThematikDeckelVorderseite` text NOT NULL,
  `ThematikFrei` text NOT NULL,
  `ThematikKasten` text NOT NULL,
  `ThematikKastenNebenseiten` text NOT NULL,
  `ThematikKastenVorderseite` text NOT NULL,
  PRIMARY KEY (`PS_SarkophagID`),
  KEY `DatensatzGruppeSarkophag` (`DatensatzGruppeSarkophag`)
) ENGINE=InnoDB AUTO_INCREMENT=7122 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sarkophag_datierung`
--

DROP TABLE IF EXISTS `sarkophag_datierung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sarkophag_datierung` (
  `PS_SarkophagDatierungID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_SarkophagID` mediumint(8) unsigned NOT NULL,
  `FS_DatierungID` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`PS_SarkophagDatierungID`),
  KEY `FS_SarkophagID` (`FS_SarkophagID`),
  KEY `FS_DatierungID` (`FS_DatierungID`)
) ENGINE=InnoDB AUTO_INCREMENT=6227 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sarkophag_literatur`
--

DROP TABLE IF EXISTS `sarkophag_literatur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sarkophag_literatur` (
  `PS_SarkophagLiteraturID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_SarkophagID` mediumint(8) unsigned NOT NULL,
  `FS_LiteraturID` mediumint(8) unsigned NOT NULL,
  `FS_LiteraturzitatID` mediumint(8) unsigned NOT NULL,
  `Supplement` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`PS_SarkophagLiteraturID`),
  KEY `FS_SarkophagID` (`FS_SarkophagID`),
  KEY `FS_LiteraturID` (`FS_LiteraturID`)
) ENGINE=InnoDB AUTO_INCREMENT=11003 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sarkophag_marbilder`
--

DROP TABLE IF EXISTS `sarkophag_marbilder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sarkophag_marbilder` (
  `PS_SarkophagMarbilderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_SarkophagID` mediumint(8) unsigned NOT NULL,
  `FS_MarbilderID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`PS_SarkophagMarbilderID`),
  KEY `FS_SarkophagID` (`FS_SarkophagID`),
  KEY `FS_MarbilderID` (`FS_MarbilderID`)
) ENGINE=InnoDB AUTO_INCREMENT=15675 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sarkophag_objekte`
--

DROP TABLE IF EXISTS `sarkophag_objekte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sarkophag_objekte` (
  `PS_SarkophagObjekteID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_SarkophagID` mediumint(8) unsigned NOT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ReliefID` int(10) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_SarkophagObjekteID`),
  KEY `FS_SarkophagID` (`FS_SarkophagID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_ReliefID` (`FS_ReliefID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_TopographieID` (`FS_TopographieID`)
) ENGINE=InnoDB AUTO_INCREMENT=17587 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sarkophag_ortsbezug`
--

DROP TABLE IF EXISTS `sarkophag_ortsbezug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sarkophag_ortsbezug` (
  `PS_SarkophagOrtsbezugID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_SarkophagID` mediumint(8) unsigned NOT NULL,
  `FS_OrtsbezugID` mediumint(8) unsigned NOT NULL,
  `FS_OrtID` mediumint(8) unsigned NOT NULL,
  `SarkophagOrtsanzeige` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`PS_SarkophagOrtsbezugID`),
  KEY `FS_SarkophagID` (`FS_SarkophagID`),
  KEY `FS_OrtsbezugID` (`FS_OrtsbezugID`)
) ENGINE=InnoDB AUTO_INCREMENT=8014 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_bauwerkall`
--

DROP TABLE IF EXISTS `search_bauwerkall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_bauwerkall` (
  `PS_Bauwerkall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_BauwerkID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortSeriennummer` int(10) unsigned NOT NULL,
  `sortLokalisierung` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Bauwerkall_ID`),
  KEY `FS_BauwerkID` (`PS_BauwerkID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortSeriennummer` (`sortSeriennummer`),
  KEY `sortLokalisierung` (`sortLokalisierung`)
) ENGINE=MyISAM AUTO_INCREMENT=9718 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_bauwerksteilall`
--

DROP TABLE IF EXISTS `search_bauwerksteilall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_bauwerksteilall` (
  `PS_BauwerksteilallID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_BauwerksteilID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortSeriennummer` int(10) unsigned NOT NULL,
  `sortBauwerk` int(10) unsigned NOT NULL,
  PRIMARY KEY (`PS_BauwerksteilallID`),
  KEY `PS_BauwerksteilID` (`PS_BauwerksteilID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortSeriennummer` (`sortSeriennummer`),
  KEY `sortBauwerk` (`sortBauwerk`)
) ENGINE=MyISAM AUTO_INCREMENT=6266 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_buchall`
--

DROP TABLE IF EXISTS `search_buchall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_buchall` (
  `PS_Buchall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_BuchID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `band` mediumint(8) DEFAULT NULL,
  `sortSeriennummer` mediumint(8) unsigned NOT NULL,
  `sortKurzbeschreibung` varchar(255) NOT NULL,
  `sortAutor` varchar(255) NOT NULL,
  `sortTitel` varchar(255) NOT NULL,
  `sortPubDate` varchar(255) NOT NULL,
  `sortAlias` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Buchall_ID`),
  KEY `FS_BuchID` (`PS_BuchID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortSeriennummer` (`sortSeriennummer`),
  KEY `sortKurzbeschreibung` (`sortKurzbeschreibung`),
  KEY `sortAutor` (`sortAutor`),
  KEY `sortTitel` (`sortTitel`),
  KEY `sortPubDate` (`sortPubDate`)
) ENGINE=MyISAM AUTO_INCREMENT=4275 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_buchseiteall`
--

DROP TABLE IF EXISTS `search_buchseiteall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_buchseiteall` (
  `PS_BuchseiteallID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_BuchseiteID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `PS_BuchID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `band` mediumint(8) DEFAULT NULL,
  `sortSeriennummer` mediumint(8) unsigned NOT NULL,
  `sortKurzbeschreibung` varchar(255) NOT NULL,
  `sortAutor` varchar(255) NOT NULL,
  `sortTitel` varchar(255) NOT NULL,
  `sortPubDate` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_BuchseiteallID`),
  KEY `FS_BuchseiteID` (`PS_BuchseiteID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortSeriennummer` (`sortSeriennummer`),
  KEY `sortKurzbeschreibung` (`sortKurzbeschreibung`),
  KEY `sortAutor` (`sortAutor`),
  KEY `sortTitel` (`sortTitel`),
  KEY `sortPubDate` (`sortPubDate`)
) ENGINE=MyISAM AUTO_INCREMENT=97227 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_clarac`
--

DROP TABLE IF EXISTS `search_clarac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_clarac` (
  `PS_SucheID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_WebseiteID` int(10) unsigned NOT NULL DEFAULT '0',
  `FS_RezeptionID` int(10) unsigned NOT NULL DEFAULT '0',
  `FS_uid` int(10) unsigned NOT NULL DEFAULT '0',
  `SearchTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `KurzbeschreibungRezeption` varchar(255) NOT NULL DEFAULT '',
  `Tafel` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `Katnummer` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `FundortRezeption` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `FundstaatRezeption` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `AufbewahrungsortRezeption` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `StandortRezeption` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`PS_SucheID`)
) ENGINE=InnoDB AUTO_INCREMENT=732 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_gruppenall`
--

DROP TABLE IF EXISTS `search_gruppenall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_gruppenall` (
  `PS_Gruppenall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_GruppenID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortKurzbeschreibung` varchar(255) NOT NULL,
  `sortAllgemein` varchar(255) NOT NULL,
  `sortKontext` varchar(255) NOT NULL,
  `sortThematik` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Gruppenall_ID`),
  KEY `FS_GruppenID` (`PS_GruppenID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortKurzbeschreibung` (`sortKurzbeschreibung`),
  KEY `sortAllgemein` (`sortAllgemein`),
  KEY `sortKontext` (`sortKontext`),
  KEY `sortThematik` (`sortThematik`)
) ENGINE=MyISAM AUTO_INCREMENT=9774 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_inschriftall`
--

DROP TABLE IF EXISTS `search_inschriftall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_inschriftall` (
  `PS_Inschriftall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_InschriftID` int(8) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortSeriennummer` varchar(255) NOT NULL,
  `sortInschrift` varchar(255) NOT NULL,
  `sortKommentar` varchar(255) NOT NULL,
  `sortSprache` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Inschriftall_ID`),
  KEY `FS_InschriftID` (`PS_InschriftID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortSeriennummer` (`sortSeriennummer`),
  KEY `sortInschrift` (`sortInschrift`),
  KEY `sortKommentar` (`sortKommentar`),
  KEY `sortSprache` (`sortSprache`)
) ENGINE=MyISAM AUTO_INCREMENT=10239 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_maffeiano`
--

DROP TABLE IF EXISTS `search_maffeiano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_maffeiano` (
  `PS_SucheID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_WebseiteID` int(10) unsigned NOT NULL DEFAULT '0',
  `FS_RezeptionID` int(10) unsigned NOT NULL DEFAULT '0',
  `FS_uid` int(10) unsigned NOT NULL DEFAULT '0',
  `SearchTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `KurzbeschreibungRezeption` varchar(255) NOT NULL DEFAULT '',
  `Tafel` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `Katnummer` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `FundortRezeption` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `FundstaatRezeption` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `AufbewahrungsortRezeption` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `StandortRezeption` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `Originaleintrag` text NOT NULL,
  `EntschluesselterEintrag` text NOT NULL,
  PRIMARY KEY (`PS_SucheID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_marbilderall`
--

DROP TABLE IF EXISTS `search_marbilderall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_marbilderall` (
  `PS_MARBilderAll_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_MARBilderID` int(10) unsigned NOT NULL DEFAULT '0',
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortDateiname` varchar(255) NOT NULL,
  `sortScannummer` varchar(255) NOT NULL,
  `sortErstellt` varchar(255) NOT NULL,
  `sortGeaendert` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_MARBilderAll_ID`),
  KEY `PS_MarbilderID` (`PS_MARBilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortDateiname` (`sortDateiname`),
  KEY `sortScannummer` (`sortScannummer`),
  KEY `sortErstellt` (`sortErstellt`),
  KEY `sortGeaendert` (`sortGeaendert`)
) ENGINE=MyISAM AUTO_INCREMENT=2020820 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_marbilderall_new`
--

DROP TABLE IF EXISTS `search_marbilderall_new`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_marbilderall_new` (
  `PS_MARBilderAll_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_MARBilderID` int(10) unsigned NOT NULL DEFAULT '0',
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortDateiname` varchar(255) NOT NULL,
  `sortScannummer` varchar(255) NOT NULL,
  `sortErstellt` varchar(255) NOT NULL,
  `sortGeaendert` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_MARBilderAll_ID`),
  KEY `PS_MarbilderID` (`PS_MARBilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`)
) ENGINE=MyISAM AUTO_INCREMENT=2025322 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_marbilderbestandall`
--

DROP TABLE IF EXISTS `search_marbilderbestandall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_marbilderbestandall` (
  `PS_MARBilderBestandAll_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_MARBilderBestandID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortDateiname` varchar(255) NOT NULL,
  `sortBestandsname` varchar(255) NOT NULL,
  `sortOrt` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_MARBilderBestandAll_ID`),
  KEY `PS_MARBilderBestandID` (`PS_MARBilderBestandID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortDateiname` (`sortDateiname`),
  KEY `sortBestandsname` (`sortBestandsname`),
  KEY `sortOrt` (`sortOrt`)
) ENGINE=MyISAM AUTO_INCREMENT=641595 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_marbilderbestandmeta`
--

DROP TABLE IF EXISTS `search_marbilderbestandmeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_marbilderbestandmeta` (
  `PS_MARBilderBestandMetaID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_MARBilderBestandID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeMeta` varchar(255) NOT NULL DEFAULT 'Arachne',
  `sortDateiname` varchar(255) NOT NULL,
  `sortBestandsname` varchar(255) NOT NULL,
  `sortOrt` varchar(255) NOT NULL,
  `meta` text NOT NULL,
  PRIMARY KEY (`PS_MARBilderBestandMetaID`),
  KEY `PS_MARBilderBestandID` (`PS_MARBilderBestandID`),
  KEY `DatensatzGruppeMeta` (`DatensatzGruppeMeta`),
  KEY `sortDateiname` (`sortDateiname`),
  KEY `sortBestandsname` (`sortBestandsname`),
  KEY `sortOrt` (`sortOrt`),
  FULLTEXT KEY `meta` (`meta`)
) ENGINE=MyISAM AUTO_INCREMENT=641595 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_marbilderoppenheimall`
--

DROP TABLE IF EXISTS `search_marbilderoppenheimall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_marbilderoppenheimall` (
  `PS_MarbilderoppenheimAll_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_MarbilderoppenheimID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortDateiname` varchar(255) NOT NULL,
  `sortBand` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_MarbilderoppenheimAll_ID`),
  KEY `PS_MarbilderoppenheimID` (`PS_MarbilderoppenheimID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortDateiname` (`sortDateiname`)
) ENGINE=MyISAM AUTO_INCREMENT=12834 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_marbilderrwwaall`
--

DROP TABLE IF EXISTS `search_marbilderrwwaall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_marbilderrwwaall` (
  `PS_MarbilderrwwaAll_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_MarbilderrwwaID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortBand` varchar(255) NOT NULL,
  `sortDateiname` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_MarbilderrwwaAll_ID`),
  KEY `PS_MarbilderrwwaID` (`PS_MarbilderrwwaID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortBand` (`sortBand`)
) ENGINE=MyISAM AUTO_INCREMENT=13361 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_objektall`
--

DROP TABLE IF EXISTS `search_objektall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_objektall` (
  `PS_Objektall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_ObjektID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortSeriennummer` int(10) unsigned NOT NULL,
  `sortAufbewahrung` varchar(255) NOT NULL,
  `sortFundort` varchar(255) NOT NULL,
  `sortGattung` varchar(255) NOT NULL,
  `sortWesen` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Objektall_ID`),
  KEY `FS_ObjektID` (`PS_ObjektID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortSeriennummer` (`sortSeriennummer`),
  KEY `sortAufbewahrung` (`sortAufbewahrung`),
  KEY `sortFundort` (`sortFundort`),
  KEY `sortGattung` (`sortGattung`),
  KEY `sortWesen` (`sortWesen`)
) ENGINE=MyISAM AUTO_INCREMENT=166838 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_realienall`
--

DROP TABLE IF EXISTS `search_realienall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_realienall` (
  `PS_Realienall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_RealienID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortSeriennummer` varchar(255) NOT NULL,
  `sortKurzbeschreibungReliefSzene` varchar(255) NOT NULL,
  `sortKurzbeschreibungObjekt` varchar(255) NOT NULL,
  `sortAufbewahrung` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Realienall_ID`),
  KEY `PS_RealienID` (`PS_RealienID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortSeriennummer` (`sortSeriennummer`),
  KEY `sortKurzbeschreibungReliefSzene` (`sortKurzbeschreibungReliefSzene`),
  KEY `sortKurzbeschreibungObjekt` (`sortKurzbeschreibungObjekt`),
  KEY `sortAufbewahrung` (`sortAufbewahrung`)
) ENGINE=MyISAM AUTO_INCREMENT=4435 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_reliefall`
--

DROP TABLE IF EXISTS `search_reliefall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_reliefall` (
  `PS_Reliefall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_ReliefID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortSeriennummer` varchar(255) NOT NULL,
  `sortAufbewahrung` varchar(255) NOT NULL,
  `sortRelieftraeger` varchar(255) NOT NULL,
  `sortThematik` varchar(255) NOT NULL,
  `sortHandlungen` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Reliefall_ID`),
  KEY `PS_ReliefID` (`PS_ReliefID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortSeriennummer` (`sortSeriennummer`),
  KEY `sortAufbewahrung` (`sortAufbewahrung`),
  KEY `sortRelieftraeger` (`sortRelieftraeger`),
  KEY `sortThematik` (`sortThematik`),
  KEY `sortHandlungen` (`sortHandlungen`)
) ENGINE=MyISAM AUTO_INCREMENT=13671 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_reproduktionall`
--

DROP TABLE IF EXISTS `search_reproduktionall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_reproduktionall` (
  `PS_Reproduktionall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_ReproduktionID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortKurzbeschreibung` varchar(255) NOT NULL,
  `sortAufbewahrung` varchar(255) NOT NULL,
  `sortVorlage` int(10) unsigned NOT NULL,
  `sortTechnik` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Reproduktionall_ID`),
  KEY `FS_ReproduktionID` (`PS_ReproduktionID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortKurzbeschreibung` (`sortKurzbeschreibung`),
  KEY `sortAufbewahrung` (`sortAufbewahrung`),
  KEY `sortVorlage` (`sortVorlage`),
  KEY `sortTechnik` (`sortTechnik`)
) ENGINE=MyISAM AUTO_INCREMENT=19334 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_rezeptionall`
--

DROP TABLE IF EXISTS `search_rezeptionall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_rezeptionall` (
  `PS_Rezeptionall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_RezeptionID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortSeriennummer` varchar(255) NOT NULL,
  `sortObjekt` varchar(255) NOT NULL,
  `sortAufbewahrung` varchar(255) NOT NULL,
  `sortReproduktion` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Rezeptionall_ID`),
  KEY `FS_RezeptionID` (`PS_RezeptionID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortSeriennummer` (`sortSeriennummer`),
  KEY `sortObjekt` (`sortObjekt`),
  KEY `sortAufbewahrung` (`sortAufbewahrung`),
  KEY `sortReproduktion` (`sortReproduktion`)
) ENGINE=MyISAM AUTO_INCREMENT=3581 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_sammlungenall`
--

DROP TABLE IF EXISTS `search_sammlungenall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_sammlungenall` (
  `PS_Sammlungenall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_SammlungenID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortKurzbeschreibung` varchar(255) NOT NULL,
  `sortAllgemein` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Sammlungenall_ID`),
  KEY `FS_SammlungenID` (`PS_SammlungenID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortKurzbeschreibung` (`sortKurzbeschreibung`),
  KEY `sortAllgemein` (`sortAllgemein`)
) ENGINE=MyISAM AUTO_INCREMENT=1332 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_topographieall`
--

DROP TABLE IF EXISTS `search_topographieall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_topographieall` (
  `PS_Topographieall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_TopographieID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortKurzbeschreibung` varchar(255) NOT NULL,
  `sortLokalisierung` varchar(255) NOT NULL,
  `sortTypus` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Topographieall_ID`),
  KEY `FS_TopographieID` (`PS_TopographieID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortKurzbeschreibung` (`sortKurzbeschreibung`),
  KEY `sortLokalisierung` (`sortLokalisierung`),
  KEY `sortTypus` (`sortTypus`)
) ENGINE=MyISAM AUTO_INCREMENT=6728 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `search_typusall`
--

DROP TABLE IF EXISTS `search_typusall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_typusall` (
  `PS_Typusall_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PS_TypusID` int(10) unsigned NOT NULL DEFAULT '0',
  `PS_MarbilderID` int(10) unsigned DEFAULT NULL,
  `DatensatzGruppeAll` varchar(255) DEFAULT NULL,
  `sortHauptbezeichnung` varchar(255) NOT NULL,
  `sortGattung` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_Typusall_ID`),
  KEY `FS_TypusID` (`PS_TypusID`),
  KEY `PS_MarbilderID` (`PS_MarbilderID`),
  KEY `DatensatzGruppeAll` (`DatensatzGruppeAll`),
  KEY `sortHauptbezeichnung` (`sortHauptbezeichnung`),
  KEY `sortGattung` (`sortGattung`)
) ENGINE=MyISAM AUTO_INCREMENT=939 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shoporder`
--

DROP TABLE IF EXISTS `shoporder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shoporder` (
  `PS_ShoporderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UserID` varchar(255) NOT NULL DEFAULT '',
  `Checknumber` bigint(20) DEFAULT NULL,
  `rechnung_Vorname` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Nachname` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Institution` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Strasse` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Postleitzahl` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Ort` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Land` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Email` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Telefon` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Fax` varchar(255) NOT NULL DEFAULT '',
  `liefer_Vorname` varchar(255) NOT NULL DEFAULT '',
  `liefer_Nachname` varchar(255) NOT NULL DEFAULT '',
  `liefer_Institution` varchar(255) NOT NULL DEFAULT '',
  `liefer_Strasse` varchar(255) NOT NULL DEFAULT '',
  `liefer_Postleitzahl` varchar(255) NOT NULL DEFAULT '',
  `liefer_Ort` varchar(255) NOT NULL DEFAULT '',
  `liefer_Land` varchar(255) NOT NULL DEFAULT '',
  `liefer_Email` varchar(255) NOT NULL DEFAULT '',
  `liefer_Telefon` varchar(255) NOT NULL DEFAULT '',
  `liefer_Fax` varchar(255) NOT NULL DEFAULT '',
  `gesamtPreis` float unsigned DEFAULT NULL,
  `Institut` varchar(255) NOT NULL DEFAULT '',
  `ShopKommentar` text NOT NULL,
  `ordered` tinyint(1) NOT NULL DEFAULT '0',
  `STATUS` enum('Unbearbeitet','Angenommen','Abgelehnt','Anfrage') NOT NULL DEFAULT 'Unbearbeitet',
  PRIMARY KEY (`PS_ShoporderID`)
) ENGINE=MyISAM AUTO_INCREMENT=731 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shoporderitem`
--

DROP TABLE IF EXISTS `shoporderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shoporderitem` (
  `PS_ShoporderitemID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ShoporderID` int(10) unsigned NOT NULL,
  `FS_MARBilderID` int(10) unsigned NOT NULL DEFAULT '0',
  `Preis` float unsigned DEFAULT NULL,
  `KurzbeschreibungShoppingcartitem` varchar(255) NOT NULL DEFAULT '',
  `Verwendung` varchar(255) NOT NULL DEFAULT '',
  `Format` varchar(255) NOT NULL DEFAULT '',
  `Institut` varchar(255) NOT NULL DEFAULT '',
  `ShopKommentar` text NOT NULL,
  PRIMARY KEY (`PS_ShoporderitemID`)
) ENGINE=MyISAM AUTO_INCREMENT=2771 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shoppingcart`
--

DROP TABLE IF EXISTS `shoppingcart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shoppingcart` (
  `PS_ShoppingcartID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_Uid` int(10) unsigned NOT NULL DEFAULT '0',
  `rechnung_Vorname` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Nachname` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Institution` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Strasse` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Postleitzahl` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Ort` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Land` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Email` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Telefon` varchar(255) NOT NULL DEFAULT '',
  `rechnung_Fax` varchar(255) NOT NULL DEFAULT '',
  `liefer_Vorname` varchar(255) NOT NULL DEFAULT '',
  `liefer_Nachname` varchar(255) NOT NULL DEFAULT '',
  `liefer_Institution` varchar(255) NOT NULL DEFAULT '',
  `liefer_Strasse` varchar(255) NOT NULL DEFAULT '',
  `liefer_Postleitzahl` varchar(255) NOT NULL DEFAULT '',
  `liefer_Ort` varchar(255) NOT NULL DEFAULT '',
  `liefer_Land` varchar(255) NOT NULL DEFAULT '',
  `liefer_Email` varchar(255) NOT NULL DEFAULT '',
  `liefer_Telefon` varchar(255) NOT NULL DEFAULT '',
  `liefer_Fax` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`PS_ShoppingcartID`),
  UNIQUE KEY `FS_Uid` (`FS_Uid`)
) ENGINE=MyISAM AUTO_INCREMENT=1640 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shoppingcartitem`
--

DROP TABLE IF EXISTS `shoppingcartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shoppingcartitem` (
  `PS_ShoppingcartitemID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_ShoppingcartID` int(10) unsigned NOT NULL,
  `FS_MARBilderID` int(10) unsigned NOT NULL DEFAULT '0',
  `Preis` float unsigned DEFAULT NULL,
  `KurzbeschreibungShoppingcartitem` varchar(255) NOT NULL DEFAULT '',
  `Verwendung` varchar(255) NOT NULL DEFAULT '',
  `Format` varchar(255) NOT NULL DEFAULT '',
  `Institut` varchar(255) NOT NULL DEFAULT '',
  `ShopKommentar` text NOT NULL,
  PRIMARY KEY (`PS_ShoppingcartitemID`)
) ENGINE=MyISAM AUTO_INCREMENT=8417 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shoppingpartner`
--

DROP TABLE IF EXISTS `shoppingpartner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shoppingpartner` (
  `PS_ShoppingpartnerID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Institut` varchar(255) NOT NULL DEFAULT '',
  `Anrede` varchar(255) NOT NULL DEFAULT '',
  `Name` varchar(255) NOT NULL DEFAULT '',
  `Email` varchar(255) NOT NULL,
  `Formate` varchar(255) NOT NULL DEFAULT '',
  `Preis` varchar(255) DEFAULT NULL,
  `PeisBunt` varchar(255) DEFAULT NULL,
  `Adresse` text NOT NULL,
  `SAP_Schluessel` varchar(255) NOT NULL,
  `Objektnummer` varchar(255) NOT NULL,
  PRIMARY KEY (`PS_ShoppingpartnerID`),
  UNIQUE KEY `Institut` (`Institut`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `siegel_lebewesen`
--

DROP TABLE IF EXISTS `siegel_lebewesen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `siegel_lebewesen` (
  `PS_Siegel_LebewesenID` int(11) NOT NULL AUTO_INCREMENT,
  `CMSNR` varchar(255) DEFAULT NULL,
  `Lebewesen_Merkmal_id` int(11) DEFAULT NULL,
  `Art` varchar(255) DEFAULT NULL,
  `LW1` varchar(255) DEFAULT NULL,
  `fz1` int(11) DEFAULT NULL,
  `LW2` varchar(255) DEFAULT NULL,
  `fz2` int(11) DEFAULT NULL,
  `LW3` varchar(255) DEFAULT NULL,
  `fz3` int(11) DEFAULT NULL,
  `Reihenfolge` smallint(6) DEFAULT NULL,
  `sHaltung` varchar(255) DEFAULT NULL,
  `Haltung_fz` smallint(6) DEFAULT NULL,
  `Stansicht` varchar(255) DEFAULT NULL,
  `Stansicht_fz` smallint(6) DEFAULT NULL,
  `Kopfrich` varchar(255) DEFAULT NULL,
  `Kopfrich_fz` smallint(6) DEFAULT NULL,
  `Halsrich` varchar(255) DEFAULT NULL,
  `Halsrich_fz` smallint(6) DEFAULT NULL,
  `KleidungA` varchar(255) DEFAULT NULL,
  `KleidungA_fz` smallint(6) DEFAULT NULL,
  `KleidungB` varchar(255) DEFAULT NULL,
  `KleidungB_fz` smallint(6) DEFAULT NULL,
  `KleidungC` varchar(255) DEFAULT NULL,
  `KleidungC_fz` smallint(6) DEFAULT NULL,
  `sGeschlecht` varchar(255) DEFAULT NULL,
  `Geschlecht_fz` smallint(6) DEFAULT NULL,
  `Auge` varchar(255) DEFAULT NULL,
  `Auge_fz` int(11) DEFAULT NULL,
  `kleinerals` varchar(255) DEFAULT NULL,
  `kleinerals_fz` int(11) DEFAULT NULL,
  `Mumps` varchar(255) DEFAULT NULL,
  `Mumps_fz` int(11) DEFAULT NULL,
  `Gelenkbohrung` varchar(255) DEFAULT NULL,
  `Gelenkbohrung_fz` int(11) DEFAULT NULL,
  `Konkatenierung` text,
  `AnzahlLebewesen` mediumint(9) DEFAULT NULL,
  `DatensatzgruppeSiegel_lebewesen` varchar(255) NOT NULL DEFAULT 'Arachne',
  PRIMARY KEY (`PS_Siegel_LebewesenID`),
  UNIQUE KEY `CMSNR_2` (`CMSNR`,`Lebewesen_Merkmal_id`),
  KEY `CMSNR` (`CMSNR`)
) ENGINE=MyISAM AUTO_INCREMENT=15005 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `strukturbereich`
--

DROP TABLE IF EXISTS `strukturbereich`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `strukturbereich` (
  `PS_StrukturBereichID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Projekt` varchar(255) DEFAULT NULL,
  `Teilprojekt` varchar(255) NOT NULL DEFAULT 'allgemein',
  `Suchbereich` varchar(255) DEFAULT NULL,
  `Anzeige` varchar(255) NOT NULL DEFAULT '',
  `order` int(4) unsigned NOT NULL DEFAULT '100',
  `Hilfetext` text,
  `muteInCatalog` tinyint(1) NOT NULL,
  PRIMARY KEY (`PS_StrukturBereichID`),
  KEY `Suchbereich` (`Suchbereich`),
  KEY `Projekt` (`Projekt`),
  KEY `Anzeige` (`Anzeige`)
) ENGINE=InnoDB AUTO_INCREMENT=259 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `strukturfeld`
--

DROP TABLE IF EXISTS `strukturfeld`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `strukturfeld` (
  `PS_StrukturFeldID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Feldname` varchar(255) DEFAULT NULL,
  `AnzeigeFeld` varchar(255) DEFAULT NULL,
  `Urtabelle` varchar(255) DEFAULT NULL,
  `Hilfetext` text,
  `Werteliste` int(10) unsigned DEFAULT NULL,
  `Kommentarfeld` varchar(255) DEFAULT NULL,
  `order` tinyint(4) unsigned NOT NULL DEFAULT '100',
  `mode` tinyint(4) DEFAULT '0',
  `findIncomplete` tinyint(4) DEFAULT '0',
  `aiax_ignore` tinyint(1) DEFAULT NULL,
  `aiax_numeric` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`PS_StrukturFeldID`),
  KEY `Feldname` (`Feldname`),
  KEY `AnzeigeFeld` (`AnzeigeFeld`),
  KEY `order` (`order`)
) ENGINE=InnoDB AUTO_INCREMENT=1651 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `strukturfeld_15.08.2018`
--

DROP TABLE IF EXISTS `strukturfeld_15.08.2018`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `strukturfeld_15.08.2018` (
  `PS_StrukturFeldID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Feldname` varchar(255) DEFAULT NULL,
  `AnzeigeFeld` varchar(255) DEFAULT NULL,
  `Urtabelle` varchar(255) DEFAULT NULL,
  `Hilfetext` text,
  `Werteliste` int(10) unsigned DEFAULT NULL,
  `Kommentarfeld` varchar(255) DEFAULT NULL,
  `order` tinyint(4) unsigned NOT NULL DEFAULT '100',
  `mode` tinyint(4) DEFAULT '0',
  `findIncomplete` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`PS_StrukturFeldID`),
  KEY `Feldname` (`Feldname`),
  KEY `AnzeigeFeld` (`AnzeigeFeld`),
  KEY `order` (`order`)
) ENGINE=InnoDB AUTO_INCREMENT=1628 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `strukturzuschreibung`
--

DROP TABLE IF EXISTS `strukturzuschreibung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `strukturzuschreibung` (
  `PS_StrukturZuschreibungID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_StrukturFeldID` int(10) unsigned DEFAULT NULL,
  `FS_StrukturBereichID` int(10) unsigned DEFAULT NULL,
  `muteInCatalog` tinyint(1) NOT NULL,
  PRIMARY KEY (`PS_StrukturZuschreibungID`),
  KEY `FS_StrukturFeldID` (`FS_StrukturFeldID`),
  KEY `FS_StrukturBereichID` (`FS_StrukturBereichID`),
  CONSTRAINT `strukturzuschreibung_ibfk_6` FOREIGN KEY (`FS_StrukturFeldID`) REFERENCES `strukturfeld` (`PS_StrukturFeldID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `strukturzuschreibung_ibfk_7` FOREIGN KEY (`FS_StrukturBereichID`) REFERENCES `strukturbereich` (`PS_StrukturBereichID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2003 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `suchestopword`
--

DROP TABLE IF EXISTS `suchestopword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suchestopword` (
  `PS_SucheStopwordID` smallint(6) NOT NULL AUTO_INCREMENT,
  `Stopword` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`PS_SucheStopwordID`),
  KEY `Stopword` (`Stopword`)
) ENGINE=InnoDB AUTO_INCREMENT=354 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `surfacetreatment`
--

DROP TABLE IF EXISTS `surfacetreatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `surfacetreatment` (
  `PS_SurfaceTreatmentID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Bezeichner` varchar(256) DEFAULT NULL,
  `PS_FMPSurfaceTreatmentID` mediumint(9) NOT NULL DEFAULT '-1',
  `ConnectedActions` text,
  `DatensatzGruppeSurfacetreatment` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_SurfaceTreatmentID`)
) ENGINE=InnoDB AUTO_INCREMENT=521 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `DeleteCrossTableReferenceST` AFTER DELETE ON `surfacetreatment` FOR EACH ROW BEGIN
DELETE FROM `xsurfacetreatmentx` WHERE `xsurfacetreatmentx`.`FS_SurfaceTreatmentID` = OLD.`PS_SurfaceTreatmentID`;
DELETE FROM `surfacetreatmentaction` WHERE `surfacetreatmentaction`.`FS_SurfaceTreatmentID` = OLD.`PS_SurfaceTreatmentID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `surfacetreatmentaction`
--

DROP TABLE IF EXISTS `surfacetreatmentaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `surfacetreatmentaction` (
  `PS_SurfaceTreatmentActionID` int(11) NOT NULL AUTO_INCREMENT,
  `PS_FMPSurfaceTreatmentActionID` int(11) NOT NULL DEFAULT '-1',
  `FS_SurfaceTreatmentID` int(11) NOT NULL,
  `TreatmentPosition` varchar(256) DEFAULT NULL,
  `Quality` varchar(256) DEFAULT NULL,
  `Homogenity` varchar(256) DEFAULT NULL,
  `Adherence` varchar(256) DEFAULT NULL,
  `PartOfSurfaceTreated` varchar(256) DEFAULT NULL,
  `MomentOfSurfaceTreatmentAction` varchar(256) DEFAULT NULL,
  `Alignment` varchar(256) DEFAULT NULL,
  `TreatmentAction` varchar(256) DEFAULT NULL,
  `TreatmentActionSubCoating` varchar(256) DEFAULT NULL,
  `Condition` varchar(256) DEFAULT NULL,
  `ColourFreeQualifierVon` varchar(256) DEFAULT NULL,
  `ColourFreeVon` varchar(256) DEFAULT NULL,
  `ColourFreeQualifierBis` varchar(256) DEFAULT NULL,
  `ColourFreeBis` varchar(256) DEFAULT NULL,
  `ColourMunsellVon` varchar(256) DEFAULT NULL,
  `ColourMunsellBis` varchar(256) DEFAULT NULL,
  `Thickness` varchar(256) DEFAULT NULL,
  `Glossiness` varchar(256) DEFAULT NULL,
  `Conservation` varchar(256) DEFAULT NULL,
  `AddedMaterialType` varchar(256) DEFAULT NULL,
  `StampedStamp` varchar(256) DEFAULT NULL,
  `NumberOfSherds` smallint(6) DEFAULT NULL,
  `FreeDescription` text,
  `IncisionDescription` text,
  `DatensatzGruppeSurfacetreatmentaction` varchar(128) NOT NULL DEFAULT 'ceramalex',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_SurfaceTreatmentActionID`)
) ENGINE=InnoDB AUTO_INCREMENT=605 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `topographie`
--

DROP TABLE IF EXISTS `topographie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topographie` (
  `PS_TopographieID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `TopographieTypusZusatz` text,
  `antikeQuellen` text,
  `antikerOrt` text,
  `antikeGriechLandschaftTopographie` text,
  `ArbeitsnotizTopographie` varchar(255) NOT NULL,
  `Ausdehnung` text,
  `Ausgrabungen` text,
  `BearbeiterTopographie` text,
  `freieBeschreibung` text,
  `KorrektorTopographie` text,
  `GeschichteTopographie` text,
  `KommentarTopographie` text,
  `modernerOrt` text,
  `modernesLand` text,
  `KurzbeschreibungTopographie` text,
  `Region` text,
  `RegioRomItalienTopographie` text,
  `moderneLandschaft` text,
  `antikeRoemProvinzTopographie` text,
  `DatensatzGruppeTopographie` varchar(255) NOT NULL DEFAULT 'Arachne',
  `TopographieTypus` text,
  `TopographieArt` varchar(255) NOT NULL,
  `Katalogbearbeitung` varchar(255) NOT NULL,
  `Katalognummer` varchar(255) NOT NULL,
  `Katalogtext` text NOT NULL,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetTopographie` varchar(256) NOT NULL DEFAULT 'topographie',
  PRIMARY KEY (`PS_TopographieID`),
  KEY `DatensatzGruppeTopographie` (`DatensatzGruppeTopographie`),
  KEY `KurzbeschreibungTopographie` (`KurzbeschreibungTopographie`(255))
) ENGINE=InnoDB AUTO_INCREMENT=8012462 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_topographie` BEFORE INSERT ON `topographie` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_topographie` AFTER INSERT ON `topographie` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='topographie', `arachneentityidentification`.`ForeignKey`=NEW.`PS_TopographieID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDTopographieID` AFTER DELETE ON `topographie` FOR EACH ROW BEGIN
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_TopographieID` AND `arachneentityidentification`.`TableName` = 'topographie';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `topographieobjekte`
--

DROP TABLE IF EXISTS `topographieobjekte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topographieobjekte` (
  `PS_TopographieobjekteID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_TopographieID` int(10) unsigned DEFAULT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(8) unsigned DEFAULT NULL,
  `FS_SammlungenID` mediumint(8) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_TopographieobjekteID`),
  KEY `FS_TopographieID` (`FS_TopographieID`),
  KEY `FS_BauwerkID` (`FS_BauwerkID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_SammlungenID` (`FS_SammlungenID`),
  CONSTRAINT `topographieobjekte_ibfk_1` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `topographieobjekte_ibfk_2` FOREIGN KEY (`FS_ObjektID`) REFERENCES `objekt` (`PS_ObjektID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `topographieobjekte_ibfk_3` FOREIGN KEY (`FS_TopographieID`) REFERENCES `topographie` (`PS_TopographieID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `topographieobjekte_ibfk_4` FOREIGN KEY (`FS_BauwerkID`) REFERENCES `bauwerk` (`PS_BauwerkID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `topographieobjekte_ibfk_5` FOREIGN KEY (`FS_SammlungenID`) REFERENCES `sammlungen` (`PS_SammlungenID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66285 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `topographiezutopographie`
--

DROP TABLE IF EXISTS `topographiezutopographie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topographiezutopographie` (
  `PS_TopographiezutopographieID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_Topographie1ID` int(10) unsigned DEFAULT NULL,
  `FS_Topographie2ID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_TopographiezutopographieID`),
  KEY `FS_Topographie1ID` (`FS_Topographie1ID`),
  KEY `FS_Topographie2ID` (`FS_Topographie2ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8876 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `typus`
--

DROP TABLE IF EXISTS `typus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `typus` (
  `PS_TypusID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `DatensatzGruppeTypus` varchar(255) NOT NULL DEFAULT 'Arachne',
  `BearbeiterTypus` text,
  `AntikeQuelle` text,
  `ArbeitsnotizTypus` varchar(255) NOT NULL,
  `AttributTypus` text,
  `BekleidungTypus` text,
  `HistorischerKommentar` text,
  `Klassifizierung` text,
  `KorrektorTypus` text,
  `KunsthistorischeEinordnung` text,
  `Bildschema` text,
  `Einordnungsargumente` text,
  `Barttracht` text,
  `Haartracht` text,
  `HaltungTypus` text,
  `KurzbeschreibungTypus` text,
  `KommentarKopien` text,
  `KommentarVorbild` text,
  `KuenstlerTypus` text,
  `NamengebendeReplik` text,
  `TypusNebenbezeichnung` text,
  `RoemGriech` text,
  `StirnhaarTypus` text,
  `KopfwendungTypus` text,
  `VorsterFertig` text,
  `creation` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oaipmhsetTypus` varchar(256) NOT NULL DEFAULT 'typus',
  PRIMARY KEY (`PS_TypusID`),
  KEY `DatensatzGruppeTypus` (`DatensatzGruppeTypus`),
  KEY `KurzbeschreibungTypus` (`KurzbeschreibungTypus`(255))
) ENGINE=InnoDB AUTO_INCREMENT=1020 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `creation_typus` BEFORE INSERT ON `typus` FOR EACH ROW BEGIN
	  		SET NEW.creation = NOW();
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_entity_id_typus` AFTER INSERT ON `typus` FOR EACH ROW BEGIN
 INSERT INTO `arachneentityidentification` SET `arachneentityidentification`.`TableName`='typus', `arachneentityidentification`.`ForeignKey`=NEW.`PS_TypusID`;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `StoreDeletedRecordIDTypus` AFTER DELETE ON `typus` FOR EACH ROW BEGIN
INSERT INTO `deleted_records` (`Kategorie`, `key`, `oaipmhsetDeletedRecords`) VALUES ('typus', OLD.`PS_TypusID`, OLD.`oaipmhsetTypus`);
UPDATE `arachne`.`arachneentityidentification`  SET `isDeleted` = '1' WHERE `arachneentityidentification`.`ForeignKey` = OLD.`PS_TypusID` AND `arachneentityidentification`.`TableName` = 'typus';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `typuszuschreibung`
--

DROP TABLE IF EXISTS `typuszuschreibung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `typuszuschreibung` (
  `PS_TypuszuschreibungID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `FS_TypusID` int(10) unsigned DEFAULT NULL,
  `FS_ObjektID` mediumint(9) unsigned DEFAULT NULL,
  `FS_RealienID` int(10) unsigned DEFAULT NULL,
  `FS_BauwerkID` mediumint(8) unsigned DEFAULT NULL,
  `KommentarTypuszu` text NOT NULL,
  `FS_GruppenID` int(10) unsigned DEFAULT NULL,
  `FS_ReproduktionID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`PS_TypuszuschreibungID`),
  KEY `FS_TypusID` (`FS_TypusID`),
  KEY `FS_ObjektID` (`FS_ObjektID`),
  KEY `FS_RealienID` (`FS_RealienID`),
  KEY `FS_GruppenID` (`FS_GruppenID`),
  KEY `FS_ReproduktionID` (`FS_ReproduktionID`),
  CONSTRAINT `typuszuschreibung_ibfk_1` FOREIGN KEY (`FS_RealienID`) REFERENCES `realien` (`PS_RealienID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `typuszuschreibung_ibfk_2` FOREIGN KEY (`FS_TypusID`) REFERENCES `typus` (`PS_TypusID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `typuszuschreibung_ibfk_3` FOREIGN KEY (`FS_GruppenID`) REFERENCES `gruppen` (`PS_GruppenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `typuszuschreibung_ibfk_4` FOREIGN KEY (`FS_ReproduktionID`) REFERENCES `reproduktion` (`PS_ReproduktionID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9784 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verwaltung_benutzer`
--

DROP TABLE IF EXISTS `verwaltung_benutzer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verwaltung_benutzer` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `gid` set('0','500','550','600','700','800','900') NOT NULL DEFAULT '500',
  `dgid_alt` varchar(255) DEFAULT NULL,
  `dgid` varchar(255) DEFAULT 'Arachne',
  `username` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(32) NOT NULL DEFAULT '',
  `password_confirm` varchar(32) NOT NULL DEFAULT '',
  `institution` varchar(64) DEFAULT NULL,
  `firstname` varchar(64) NOT NULL DEFAULT '',
  `lastname` varchar(64) NOT NULL DEFAULT '',
  `email` varchar(128) NOT NULL DEFAULT '',
  `emailAuth` varchar(24) DEFAULT NULL,
  `homepage` varchar(128) DEFAULT NULL,
  `strasse` varchar(64) DEFAULT NULL,
  `plz` varchar(20) DEFAULT NULL,
  `ort` varchar(64) DEFAULT NULL,
  `land` varchar(64) DEFAULT NULL,
  `telefon` varchar(32) DEFAULT NULL,
  `all_groups` enum('TRUE','FALSE') NOT NULL DEFAULT 'FALSE',
  `login_permission` enum('TRUE','FALSE') NOT NULL DEFAULT 'FALSE',
  `info_windows` tinyint(1) NOT NULL DEFAULT '1',
  `LastLogin` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`),
  KEY `all_groups` (`all_groups`),
  KEY `gid` (`gid`),
  KEY `dgid` (`dgid`)
) ENGINE=InnoDB AUTO_INCREMENT=24379 DEFAULT CHARSET=utf8 PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verwaltung_benutzer_datensatzgruppen`
--

DROP TABLE IF EXISTS `verwaltung_benutzer_datensatzgruppen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verwaltung_benutzer_datensatzgruppen` (
  `udgid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `dgid` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`udgid`),
  KEY `uid` (`uid`),
  KEY `dgid` (`dgid`),
  CONSTRAINT `verwaltung_benutzer_datensatzgruppen_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `verwaltung_benutzer` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `verwaltung_benutzer_datensatzgruppen_ibfk_2` FOREIGN KEY (`dgid`) REFERENCES `verwaltung_datensatzgruppen` (`dgid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=197865 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verwaltung_benutzer_reset_password_request`
--

DROP TABLE IF EXISTS `verwaltung_benutzer_reset_password_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verwaltung_benutzer_reset_password_request` (
  `PS_verwaltung_benutzer_reset_password_requestID` int(10) NOT NULL AUTO_INCREMENT,
  `FS_uid` int(10) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_verwaltung_benutzer_reset_password_requestID`),
  KEY `FS_uid` (`FS_uid`),
  KEY `token` (`token`),
  KEY `expiration_date` (`expiration_date`)
) ENGINE=InnoDB AUTO_INCREMENT=461 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verwaltung_bildrechtegruppen`
--

DROP TABLE IF EXISTS `verwaltung_bildrechtegruppen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verwaltung_bildrechtegruppen` (
  `bgid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `resolution_anonymous` varchar(255) NOT NULL,
  `watermark_anonymous` varchar(255) NOT NULL,
  `resolution_registered` varchar(255) NOT NULL,
  `watermark_registered` varchar(255) NOT NULL,
  `override_for_group` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`bgid`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verwaltung_change_emailrequest`
--

DROP TABLE IF EXISTS `verwaltung_change_emailrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verwaltung_change_emailrequest` (
  `PS_Verwaltung_change_emailrequestID` bigint(20) unsigned NOT NULL COMMENT 'Dies ist die UID',
  `NewMail` varchar(255) NOT NULL COMMENT 'Neue Emailadresse des Benutzers',
  `HASH` varchar(255) NOT NULL COMMENT 'Hashwert zur ueberpruefung',
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp',
  PRIMARY KEY (`PS_Verwaltung_change_emailrequestID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verwaltung_datensatzgruppen`
--

DROP TABLE IF EXISTS `verwaltung_datensatzgruppen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verwaltung_datensatzgruppen` (
  `dgid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `dgname` varchar(255) NOT NULL,
  PRIMARY KEY (`dgid`),
  UNIQUE KEY `dgname` (`dgname`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verwaltung_export`
--

DROP TABLE IF EXISTS `verwaltung_export`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verwaltung_export` (
  `verwaltung_export` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) unsigned NOT NULL,
  `pfad` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`verwaltung_export`)
) ENGINE=MyISAM AUTO_INCREMENT=229 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verwaltung_sessions`
--

DROP TABLE IF EXISTS `verwaltung_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verwaltung_sessions` (
  `uid` int(10) unsigned NOT NULL DEFAULT '0',
  `gid` int(10) NOT NULL DEFAULT '0',
  `dgid` text NOT NULL,
  `sid` varchar(128) NOT NULL DEFAULT '',
  `username` varchar(16) NOT NULL DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cookie` varchar(128) NOT NULL DEFAULT '',
  `ipaddress` varchar(15) NOT NULL DEFAULT '',
  `useragent` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`sid`),
  KEY `uid` (`uid`),
  KEY `gid` (`gid`),
  KEY `dgid` (`dgid`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verwaltung_sessions_arachne4`
--

DROP TABLE IF EXISTS `verwaltung_sessions_arachne4`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verwaltung_sessions_arachne4` (
  `uid` int(10) unsigned NOT NULL DEFAULT '0',
  `gid` int(10) NOT NULL DEFAULT '0',
  `sid` varchar(128) NOT NULL DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ipaddress` varchar(128) NOT NULL DEFAULT '',
  `useragent` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `webseite`
--

DROP TABLE IF EXISTS `webseite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `webseite` (
  `PS_WebseiteID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `Dateipfad1` varchar(255) DEFAULT NULL,
  `Dateipfad2` varchar(255) DEFAULT NULL,
  `Dateipfad3` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_WebseiteID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wertelisten`
--

DROP TABLE IF EXISTS `wertelisten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wertelisten` (
  `PS_wertelisten` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FS_WlID` int(10) unsigned DEFAULT NULL,
  `Group_ID` int(10) unsigned DEFAULT NULL,
  `Inhalt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_wertelisten`),
  KEY `FS_WlID` (`FS_WlID`),
  CONSTRAINT `wertelisten_ibfk_1` FOREIGN KEY (`FS_WlID`) REFERENCES `wertelisten_namen` (`PS`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86797 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wertelisten_namen`
--

DROP TABLE IF EXISTS `wertelisten_namen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wertelisten_namen` (
  `PS` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Namen` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`PS`),
  KEY `Namen` (`Namen`)
) ENGINE=InnoDB AUTO_INCREMENT=423 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wertelisten_zusatztext`
--

DROP TABLE IF EXISTS `wertelisten_zusatztext`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wertelisten_zusatztext` (
  `PS_wertelisten_zusatztextID` int(11) NOT NULL AUTO_INCREMENT,
  `werteliste_name` varchar(255) NOT NULL,
  `wert` varchar(255) NOT NULL,
  `wert_englisch` varchar(255) NOT NULL,
  `zusatztext` text,
  `zusatztext_englisch` text,
  `bildunterschrift_1` varchar(255) DEFAULT NULL,
  `bildunterschrift_2` varchar(255) DEFAULT NULL,
  `bildunterschrift_3` varchar(255) DEFAULT NULL,
  `bildunterschrift_4` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PS_wertelisten_zusatztextID`)
) ENGINE=InnoDB AUTO_INCREMENT=1605 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `xmorphologyx`
--

DROP TABLE IF EXISTS `xmorphologyx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xmorphologyx` (
  `PS_XMorphologyXID` int(11) NOT NULL AUTO_INCREMENT,
  `FS_MainAbstractID` int(11) NOT NULL,
  `FS_MorphologyID` int(11) NOT NULL,
  `PS_FMPXMorphologyXID` int(11) NOT NULL DEFAULT '-1',
  `Level1` varchar(512) DEFAULT NULL,
  `Level2` varchar(512) DEFAULT NULL,
  `Level3` varchar(512) DEFAULT NULL,
  `Level4` varchar(512) DEFAULT NULL,
  `Level5` varchar(512) DEFAULT NULL,
  `Level6` varchar(512) DEFAULT NULL,
  `Level1_6` varchar(256) DEFAULT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_XMorphologyXID`)
) ENGINE=InnoDB AUTO_INCREMENT=39020 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `xsherdtovesselx`
--

DROP TABLE IF EXISTS `xsherdtovesselx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xsherdtovesselx` (
  `PS_XSherdToVesselXID` int(11) NOT NULL AUTO_INCREMENT,
  `PS_FMPSherdToVesselID` int(11) DEFAULT '-1',
  `FS_IsolatedSherdID` int(11) NOT NULL,
  `FS_IndividualVesselID` int(11) NOT NULL,
  `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PS_XSherdToVesselXID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `xsurfacetreatmentx`
--

DROP TABLE IF EXISTS `xsurfacetreatmentx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xsurfacetreatmentx` (
  `PS_XSurfacetreatmentXID` int(11) NOT NULL AUTO_INCREMENT,
  `FS_SurfaceTreatmentID` int(11) NOT NULL,
  `FS_MainAbstractID` int(11) DEFAULT NULL,
  `FS_IsolatedSherdID` int(11) DEFAULT NULL,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PS_FMPXSurfaceTreatmentXID` int(11) DEFAULT NULL,
  PRIMARY KEY (`PS_XSurfacetreatmentXID`)
) ENGINE=InnoDB AUTO_INCREMENT=2686 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zenon`
--

DROP TABLE IF EXISTS `zenon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zenon` (
  `zenonid` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `leader` varchar(255) DEFAULT NULL,
  `001` varchar(255) DEFAULT NULL,
  `003` varchar(255) DEFAULT NULL,
  `005` varchar(255) DEFAULT NULL,
  `008` varchar(255) DEFAULT NULL,
  `026_a` varchar(255) DEFAULT NULL,
  `026_b` varchar(255) DEFAULT NULL,
  `026_c` varchar(255) DEFAULT NULL,
  `035_a` varchar(255) DEFAULT NULL,
  `041` varchar(255) DEFAULT NULL,
  `041_a` varchar(255) DEFAULT NULL,
  `041_b` varchar(255) DEFAULT NULL,
  `041_h` varchar(255) DEFAULT NULL,
  `044_a` varchar(255) DEFAULT NULL,
  `048_a` varchar(255) DEFAULT NULL,
  `100_a` varchar(255) DEFAULT NULL,
  `100_c` varchar(255) DEFAULT NULL,
  `100_d` varchar(255) DEFAULT NULL,
  `100_q` varchar(255) DEFAULT NULL,
  `109_a` varchar(255) DEFAULT NULL,
  `109_b` varchar(255) DEFAULT NULL,
  `110_a` varchar(255) DEFAULT NULL,
  `111_a` varchar(255) DEFAULT NULL,
  `119_a` varchar(255) DEFAULT NULL,
  `119_b` varchar(255) DEFAULT NULL,
  `119_c` varchar(255) DEFAULT NULL,
  `210_a` varchar(255) DEFAULT NULL,
  `240_a` varchar(255) DEFAULT NULL,
  `240_h` varchar(255) DEFAULT NULL,
  `240_l` varchar(255) DEFAULT NULL,
  `245_a` text,
  `245_b` text,
  `245_c` text,
  `245_k` varchar(255) DEFAULT NULL,
  `245_n` varchar(255) DEFAULT NULL,
  `245_p` text,
  `246_a` text,
  `246_b` varchar(255) DEFAULT NULL,
  `246_c` varchar(255) DEFAULT NULL,
  `246_n` varchar(255) DEFAULT NULL,
  `246_p` text,
  `250_a` text,
  `255_a` varchar(255) DEFAULT NULL,
  `260_a` varchar(255) DEFAULT NULL,
  `260_b` varchar(255) DEFAULT NULL,
  `260_c` varchar(255) DEFAULT NULL,
  `260_e` varchar(255) DEFAULT NULL,
  `260_f` varchar(255) DEFAULT NULL,
  `260_g` varchar(255) DEFAULT NULL,
  `300_a` varchar(255) DEFAULT NULL,
  `300_b` varchar(255) DEFAULT NULL,
  `300_c` varchar(255) DEFAULT NULL,
  `300_e` varchar(255) DEFAULT NULL,
  `300_f` varchar(255) DEFAULT NULL,
  `300_g` varchar(255) DEFAULT NULL,
  `300_3` varchar(255) DEFAULT NULL,
  `440_a` varchar(255) DEFAULT NULL,
  `440_v` varchar(255) DEFAULT NULL,
  `490_a` varchar(255) DEFAULT NULL,
  `490_v` varchar(255) DEFAULT NULL,
  `500_a` text,
  `504_a` varchar(255) DEFAULT NULL,
  `505_a` text,
  `506_a` varchar(255) DEFAULT NULL,
  `515_a` varchar(255) DEFAULT NULL,
  `520_a` text,
  `520_b` varchar(255) DEFAULT NULL,
  `540_a` varchar(255) DEFAULT NULL,
  `542_d` varchar(255) DEFAULT NULL,
  `546_a` varchar(255) DEFAULT NULL,
  `561_a` text,
  `563_a` varchar(255) DEFAULT NULL,
  `581_a` text,
  `590_a` varchar(255) DEFAULT NULL,
  `600_a` text,
  `610_a` text,
  `650_a` varchar(255) DEFAULT NULL,
  `653_a` text,
  `700` varchar(255) DEFAULT NULL,
  `700_a` text,
  `700_c` varchar(255) DEFAULT NULL,
  `700_d` varchar(255) DEFAULT NULL,
  `700_e` varchar(255) DEFAULT NULL,
  `709_a` text,
  `709_b` text,
  `710_a` text,
  `710_b` varchar(255) DEFAULT NULL,
  `710_e` varchar(255) DEFAULT NULL,
  `711_a` varchar(255) DEFAULT NULL,
  `719_a` text,
  `719_b` text,
  `719_c` text,
  `740_a` text,
  `852_b` text,
  `852_c` text,
  `852_h` varchar(255) DEFAULT NULL,
  `909_a` text,
  `856_u` text,
  `856_z` text,
  `878_l` text,
  `998_a` varchar(255) DEFAULT NULL,
  `998_b` varchar(255) DEFAULT NULL,
  `998_l` varchar(255) DEFAULT NULL,
  `998_m` varchar(255) DEFAULT NULL,
  `998_n` varchar(255) DEFAULT NULL,
  `998_s` varchar(255) DEFAULT NULL,
  `999_a` text,
  `999_m` varchar(255) DEFAULT NULL,
  `999_e` varchar(255) DEFAULT NULL,
  `999_r` varchar(255) DEFAULT NULL,
  `24613_a` text,
  PRIMARY KEY (`zenonid`),
  KEY `001` (`001`),
  KEY `005` (`005`),
  KEY `008` (`008`),
  KEY `026_a` (`026_a`),
  KEY `026_b` (`026_b`),
  KEY `026_c` (`026_c`),
  KEY `035_a` (`035_a`),
  KEY `041` (`041`),
  KEY `041_a` (`041_a`),
  KEY `041_h` (`041_h`),
  KEY `048_a` (`048_a`),
  KEY `100_a` (`100_a`),
  KEY `100_c` (`100_c`),
  KEY `100_d` (`100_d`),
  KEY `100_q` (`100_q`),
  KEY `110_a` (`110_a`),
  KEY `111_a` (`111_a`),
  KEY `210_a` (`210_a`),
  KEY `240_a` (`240_a`),
  KEY `240_h` (`240_h`),
  KEY `240_l` (`240_l`),
  KEY `245_n` (`245_n`),
  KEY `246_b` (`246_b`),
  KEY `246_c` (`246_c`),
  KEY `246_n` (`246_n`),
  KEY `255_a` (`255_a`),
  KEY `260_a` (`260_a`),
  KEY `260_b` (`260_b`),
  KEY `260_c` (`260_c`),
  KEY `300_a` (`300_a`),
  KEY `300_b` (`300_b`),
  KEY `300_c` (`300_c`),
  KEY `300_e` (`300_e`),
  KEY `440_a` (`440_a`),
  KEY `504_a` (`504_a`),
  KEY `520_b` (`520_b`),
  KEY `546_a` (`546_a`),
  KEY `563_a` (`563_a`),
  KEY `590_a` (`590_a`),
  KEY `650_a` (`650_a`),
  KEY `700` (`700`),
  KEY `700_c` (`700_c`),
  KEY `700_d` (`700_d`),
  KEY `700_e` (`700_e`),
  KEY `711_a` (`711_a`),
  KEY `zenonid` (`zenonid`),
  KEY `245_a` (`245_a`(255)),
  KEY `245_b` (`245_b`(255)),
  KEY `245_c` (`245_c`(255)),
  KEY `700_a` (`700_a`(255))
) ENGINE=MyISAM AUTO_INCREMENT=29807 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'arachne'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-13 11:53:20
