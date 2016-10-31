<?php
/**
 * abstract class to use mysql os psql database
 * 
 * .. I wouldn't have wrote such thing by mysqlf i I had known, that I will have to deal with different versions of ojs before
 * 
 * 
 */
class ojs_database {
	
	public $connection;
	public $settings;
	private $_;
	
	function __construct($settings) {
		
		$this->settings = $settings;
		
		if (!isset($this->settings['use_psql'])) {
			$this->settings['use_psql'] = false;
		}
		
		if ($settings['use_psql'] == false) {
			
			if (!class_exists("mysqli")) {
				throw new Exception("mysqli Extension not installed");
			}
			
			$mysqli = new mysqli('localhost', $this->settings['mysql_user'], $this->settings['mysql_password'], $this->settings['mysql_db']);
			if ($mysqli->connect_errno) {
				throw new Exception("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
			}
			$this->connection = $mysqli;
		} else {
			
			if (!function_exists("pg_pconnect")) {
				throw new Exception("PSQL Extension not installed");
			}
			
			$connstring = "host={$this->settings['psql_host']} port={$this->settings['psql_port']} dbname={$this->settings['psql_db']} user={$this->settings['psql_user']} password={$this->settings['psql_password']}";
			$psql = pg_pconnect($connstring);
			if (!$psql) {
				throw new Exception("An error occurred during PSQL connection.");
			}
			$this->connection = $psql;
		}
	}
	


	
	
	function query($sql) {
		return ($this->settings['use_psql']) ? $this->_queryPsql($sql) : $this->_queryMysql($sql);
	}
	
	private function _queryPsql($sql) {
		$result = pg_query($this->connection, $sql);
		
		$return = array();
		if (!$result) {
			throw new Exception("An error occurred doing pg query.");
			exit;
		}
		while ((gettype($result) != 'boolean') and ($row = pg_fetch_assoc($result))) {

			$return[] = $row;
		}
		return $return;
	}
	
	private function _queryMysql($sql) {		
		if ($result = $this->connection->query($sql)) {
			$return = array();
			while((gettype($result) != 'boolean') and ($row = $result->fetch_assoc())){
				$return[] = $row;
			}
			return $return;
		} else {
			return array();
		}
	}

	
}




?>