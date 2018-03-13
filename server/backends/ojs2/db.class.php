<?php

/**
 * Class ojs2_db
 *
 * class to get some basic infos out of OJS2-Database quick, dirty and efficient
 *
 */
namespace backends\ojs2 {

	class db {

		public $connection;
		public $settings;
		private $_;

		function __construct($settings) {

			$this->settings = $settings;

			if (!isset($this->settings['db_type'])) {
				$this->settings['db_type'] = 'mysql';
			}

			if ($settings['db_type'] == 'mysql') {

				if (!class_exists("mysqli")) {
					throw new \Exception("mysqli Extension not installed");
				}

				$mysqli = new \mysqli('localhost', $this->settings['username'], $this->settings['password'], $this->settings['db']);
				if ($mysqli->connect_errno) {
					throw new \Exception("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
				}
				$this->connection = $mysqli;
			} else if ($settings['db_type'] == 'psql') {

				if (!function_exists("pg_pconnect")) {
					throw new \Exception("PSQL Extension not installed");
				}

				$connstring = "host={$this->settings['host']} port={$this->settings['port']} dbname={$this->settings['db']} user={$this->settings['username']} password={$this->settings['password']}";
				$psql = pg_pconnect($connstring);
				if (!$psql) {
					throw new \Exception("An error occurred during PSQL connection.");
				}
				$this->connection = $psql;
			}
		}



		function query($sql) {
			return ($this->settings['db_type'] == "psql") ? $this->_queryPsql($sql) : $this->_queryMysql($sql);
		}

		private function _queryPsql($sql) {
			pg_send_query($this->connection, $sql);
            $result = pg_get_result($this->connection);
            $error = pg_result_error($result);
            $return = array();
			if ($error) {
				throw new \Exception("An error occurred doing pg query:" . $error);
			}
			while ((gettype($result) != 'boolean') and ($row = pg_fetch_assoc($result))) {
				$return[] = $row;
			}
			return $return;
		}

		private function _queryMysql($sql) {
			if ($this->connection and $result = $this->connection->query($sql)) {
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
}
?>