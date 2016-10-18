<?php
class logger {
	
	public $debug = true;
	
	public $log = [];
	public $warnings = [];
	
	private  $_lockstart;
	
	/**
	 * logs sensible information if debugmode
	 * @param unknown $string
	 */
	function debug($string) {
		if ($this->debug) {
			$this->log[] = $this->_timestamp()  . $string;
		}
	}
	
	/**
	 * stores a warning
	 * @param unknown $string
	 */
	function warning($string) {
		$this->warnings[] = $string;
	}
	
	/**
	 * logs something
	 * @param unknown $string
	 */
	function log($string) {
		$this->log[] = $this->_timestamp()  . $string;
	}
	
	
	private function _timestamp() {
		return str_pad((microtime(true) - $this->_lockstart), 18, '0', STR_PAD_RIGHT) . ' ';
	}
	
	function __construct($debug) {
		$this->debug = $debug;
		$this->_lockstart = microtime(true);
	}
	
	function dump() {
		return implode("\n", $this->log);
	}
	
}