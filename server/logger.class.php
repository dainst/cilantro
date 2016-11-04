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
			$this->_pushlog($string);
		}
	}
	
	/**
	 * stores a warning
	 * @param unknown $string
	 */
	function warning($string) {
		$this->warnings[] = $string . (($this->debug) ? "\n" . $this->_backtrace() : '');
	}
	
	private function _backtrace() {
		$bb = debug_backtrace();
		$re = [];
		foreach ($bb as $b) {
			@$re[] = "{$b["function"]} in {$b["file"]} line {$b["line"]}";
		}
		return implode("\n", $re);
	}
	
	/**
	 * logs something
	 * @param unknown $string
	 */
	function log($string) {
		$this->_pushlog($string);
	}
	
	private function _pushlog($string) {
		if (gettype($string) !== "string") {
			$string = print_r($string,1);
		}
		
		$this->log[] = $this->_timestamp() . ' ' . $string;
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