<?php

/**
 * Class ojsis
 *
 * This is the main webservice, to interact with the importer. At one point there will be an abstraction layer in between to
 * communicate with different types of repositories like ojs2, ojs3, omp, dspace (?) etc.
 *
 * the folder backends/.. contains parts wich are allready in this structure
 *
 *
 * this file will be a main class backend, and the backend-specific function will be implemented there,
 * but atm it's just for ojs2, thats why it's called like this.
 *
 */


class ojsis { // you're my wonderwall bla bla whimmer
	
	// return value
	public $return = array();
	
	// do we debug log? (change in server script)
	public $debug = false;
	// settings
	public $settings = array();
	// the data
	public $data = null;
	
	private $_journal = null;
	private $_base_path = "../";	
	private $_db = null;
	
	public $log = null;
	
	public $noPwFunctions = array('getRepository');
	
	/* system functions */
	
	/**
	 * 
	 * @param <array> $data
	 * @param <object> $logger object wich implements warning() and debug() and log()
	 * @param <array> $settings (base_path, skiplock, skippw) <- necessary to use this from testing contexts
	 * @throws Exception
	 */
	function __construct($data, $logger, $settings = array()) {

		set_error_handler(array($this, 'errorHandler'));
		$this->log = $logger;


		$this->settings = $settings;
		$this->data = $data;

		$this->log->log('starting ojsis');
		$this->getUploadId();


	}
	
	function call($task, $additional_settings = array()) {
		
		if (!in_array($task, $this->noPwFunctions)) {
			if (!$this->checkPw() and !isset($additional_settings['skippw'])) {
				throw new Exception("Wrong Password");
			}
		}

		if (!method_exists($this, $task)) {
			throw new Exception("Task $task not known.");
		}
		
		$this->$task();
	}
	
	/* check start */
	
	/**
	 * check if the file exists (get called in the beginning of uploading process)
	 *
	 * @param unknown $data
	 * @throws Exception
	 */
	function checkStart() {
		if (!property_exists($this->data, 'file')) {
			throw new Exception("No File selected");
		}
		$this->checkFile($this->data->file);
	}
	

	
	/**
	 *  __destruct is counted und get only called in case of really fnishing the script, we call finish in most cases manually
	 *  so we need both, in case of error finish as well
	 */
	private $_isdead = false;
	
	function finish() {
		$this->log->log('finishing ojsis');
		$this->writeLog();
		$this->_isdead = true;
	}
	
	function __destruct() {
		if (!$this->_isdead) {
			$this->finish();
		}
	}
	
	/**
	 * 
	 * @param unknown $fehlercode
	 * @param unknown $fehlertext
	 * @param unknown $fehlerdatei
	 * @param unknown $fehlerzeile
	 */
	function errorHandler($fehlercode, $fehlertext, $fehlerdatei, $fehlerzeile) {
		$this->log->warning("Error $fehlercode in $fehlerdatei row $fehlerzeile: $fehlertext");
	}
	
	
	/* import functions */
	
	/**
	 * do it
	 *
	 * @param unknown $data
	 * @throws Exception
	 */
	function toOJS() {
				
		$data = $this->data;
		$data = $this->data;

		try {
			
			$this->log->log('starting import');
			
			$this->log->log("cut the pdf file into pieces");
			$this->cutPdf();
			
			$this->log->log("make transport XML");
			$xmlFile = $this->makeXML(true);
				
			$this->log->log("pump into ojs");
			$execline = "php {$this->settings['ojs_path']}/tools/importExport.php NativeImportExportPlugin import {$this->settings['tmp_path']}/$xmlFile {$data->data->ojs_journal_code} {$this->settings['ojs_user']}";
		
			$this->log->log("this is my last result");
			$this->log->debug($execline);
			$this->return['message'] = shell_exec($execline);

			$this->log->log("create front matters");
			$this->updateFrontmatters();
			
			$this->log->log("check if it was successfull?");
			$successmsgs = array("The import was successful", "Der Import war erfolgreich");
			$success = false;
			foreach ($successmsgs as $successmsg) {
				if (substr($this->return['message'], 0, strlen($successmsg)) == $successmsg) {
					$success = true;
				}
			}
				
			if (!$success) {
				throw new Exception($this->return['message']);
			}
	
			$this->log->log("tidy up");
			$this->clearTmp();
			
			if ($this->debug) {
				throw new Exception("success but debug is on!");
			}

		} catch (Exception $e) {
			$this->log->debug($this->data);
			
			$this->writeLog();
			throw $e;
		}
	
	}
	
	
	
	/**
	 * sort articles by order value
	 */
	function orderArticles() {	
		if (!isset($this->data) or !isset($this->data->articles) or !count($this->data->articles)) {
			return;
		}
		uasort($this->data->articles, function($a, $b) {
			return $a->order < $b->order  ? -1 : 1;
		});
		
		$this->log->log("order articles");
	}
	
	
	/**
	 *
	 * @param unknown $data
	 * @data last used id;
	 * @throws Exception
	 * @return <array>
	 */
	function cutPdf() {
		$data = $this->data;		
	
		foreach ($data->articles as $nr => $article) {
				
			$start = (int) $article->pages->startPdf;
			$end   = (int) $article->pages->endPdf;
			$end   = $end ? $end : $start;

			if (!isset($article->filepath)) {
				$this->log->warning('article without file!');
				continue;
			}

			$isDir = (substr($data->data->importFilePath, -6) == 'pdfdir');

			$name  = $isDir ? $article->filepath : "{$article->filepath}.$nr.pdf";
			$outp  = str_replace('/','-', $name);
			$outp  = str_replace(' ','-', $outp);

			$files = array();
			
			
			$files[] = (object) array(// the file itself
				"file"	=>	"{$this->settings['rep_path']}/{$article->filepath}",
				"from"	=>	$start,
				"to"	=>	$end,
				"absolute" => true
			);
			
			// any "attached" files, files meant to merge		
			if (isset($article->attached)) {
				$files = array_merge($files, $article->attached);
			}
			$mergeStr = $this->_mergePdfString($files);
			
			$shell = "pdftk $mergeStr output {$this->settings['tmp_path']}/$outp 2>&1";
				
			$this->log->debug($shell);
				
			$cut = shell_exec($shell);
				
			if($cut != '') {
				throw new Exception($cut);
			}
				
			$data->articles[$nr]->filepath = "{$this->settings['tmp_path']}/$outp";
				
		}
	
	}
	
	
	private function _mergePdfString($files) {
		
		$handles = "ABCDEFGHIJKLMNOPQRTUVWXYZ";
		$handleDef = array();
		$cutDef = array();
		$i = 0;
		
		foreach ($files as $file) {
			$handle = substr($handles, $i++, 1);
			
			$file->file = (isset($file->absolute) ? $file->file : "{$this->settings['rep_path']}/{$file->file}");
			
			if (!file_exists($file->file)) {
				$this->log->warning("file |{$file->file}| could not be found");
				continue;
			}
			
			$handleDef[] = $handle. '="' . $file->file . '"';
			$cutDef[] = (isset($file->from) and isset($file->to)) ? $handle . (int) $file->from . '-' . (int) $file->to : $handle;
		}
		
		$handleDef = implode(" ", $handleDef);
		$cutDef = implode(" ", $cutDef);
		
		$this->log->debug('attached:' . print_r($files,1));
		
		return ($handleDef . ' cat ' . $cutDef);
		
	}

	/**
	 * 
	 */
	function updateFrontmatters() {
		$execline = "cd {$this->settings['ojs_path']} && php plugins/generic/ojs-dainst-frontpage-generator-plugin/dfmcli.php add missing 0";
		$this->log->debug($execline);
		$message = shell_exec($execline);
		$stop = array('Could ', 'Error:', 'Fatal error:');
		if (in_array(substr(trim($message), 0, 6), $stop) or (trim($message) == '')) {
			$this->log->warning("Frontmatters were not created! \n\n $message");
		} else {
			$this->log->log($message);
		}
	}

	
	/**
	 * 
	 * @param string $save
	 * @throws Exception
	 * @return string
	 */
	function makeXML($save = false) {
		$data = $this->data;

		$journal = $data->data;
				
		$this->orderArticles();
		$articles = $data->articles;
				
		ob_start();
		include('xml_template.php');
		$xml = ob_get_contents();
		ob_end_clean();
		
		try {
			$test = new SimpleXMLElement($xml); // should throw an error on error..
		} catch(Exception $e) {
			$this->log->debug($xml);
			throw $e;
		}
		
		
		if ($save) {
			$filename = 'importXml.' . $this->getUploadId() . '.xml';
			file_put_contents($this->settings['tmp_path'] . '/' . $filename, $xml);
			$this->return['filename'] = $filename;
			return $filename;
		} else {
			$this->return['message'] = "XML successfully generated";
			$this->return['xml'] = $xml;
		}
		
	}
	
	
	/**
	 * send report to sabine
	 *
	 * to keep it easy we just save it and send them manually later
	 *
	 */
	function sendReport($filename, $content) {
		file_put_contents($this->settings['log_path'] . '/' . $filename, $content);
	}
	
	
	/* send to zenon */
	
	/**
	 *
	 */
	function sendToZenon() {
			
		$data = $this->data;
		$journal = $data->data;
		$article = $this->data->articles[0];
	
		ob_start();
		include('marc_template.php');
		$xml = ob_get_contents();
		ob_end_clean();
	
		$test = new SimpleXMLElement($xml); // should throw an error on error..

		$filename = $this->return['uploadId'] . '.' . $this->_clean_string($article->title) . '.xml';
		$this->return['report'] = $filename;
		$this->sendReport($filename, $xml);
		$this->return['message'] = "Report >>$filename<< successfully generated";
	}
	

	
	
	/* helper functions */
	
		
	/**
	 * clear all tmp data
	 */
	function clearTmp() {
		array_map('unlink', glob($this->settings['tmp_path'] . '/*'));
	}
	

	/**
	 * writes log.file in case of error or debug mode
	 */
	function writeLog() {
		file_put_contents("{$this->settings['log_path']}/{$this->return['uploadId']}.log", $this->log->dump());
	}
	
	/* password related functions */
		
	/**
	 *
	 * @return boolean
	 */
	function checkPw() {
		$data = $this->data;
		$this->log->log('pw sent ' . (isset($data->password) ? $data->password : ''));
		//$this->log->log('pw set ' . $this->settings['password']);
		return (isset($data->password) and ($data->password == $this->settings['password']));
	}
		
	/*  lock related functions */
	

	


	function unlockSession() {
		$this->log->log('unlocking session');
		$lockfile = $this->settings['log_path'] . '/lock';
		unlink($lockfile);
	}

	
	/* ojs functions */
	
	
	/* uploadID related functions */
	
	/**
	 *
	 * @return <string>:
	 */
	function getUploadId() {
		$data= $this->data;
		if (!isset($this->return['uploadId']) or !$this->return['uploadId']) {
			$this->return['uploadId'] = md5(time());
		}
	
		if (isset($data->uploadId)) {
			$this->return['uploadId'] = $data->uploadId;
		}
		
		$this->log->debug("uploadId: {$this->return['uploadId']}");
	
		return $this->return['uploadId'];
	}
	
	


	/* other */

	
	/**
	 * 
	 * @param unknown $article
	 * @return string
	 */
	private function _assembleAuthorlist($article) {
		$author_list = [];
		foreach ($article->author as $author) {
			$author_list[] = "{$author->firstname} {$author->lastname}";
		}
		return implode('; ', $author_list);

	}
	
	
	/* upload functions */
	
	function upload() {
		$this->log->log($_FILES);

		// check for too big uploads
		if (!isset($_FILES['files']) or !count($_FILES['files'])) {
			throw new Exception("Unknown Error, maybe file to big");
		}

		$acceptedFiles = array(
			'application/acrobatreader',
			'application/pdf',
			'application/vnd.adobe.xdp+xml'
		);

		$uploadedFiles = [];

		for($i = 0; $i < count($_FILES['files']['name']); $i++) {

			$destination = $_FILES['files']['name'][$i];
			while (file_exists($this->settings['rep_path'] . '/' . $destination)) {
				$destination = '_' . $destination;
			}

			$this->log->debug('goto ' . $destination);

			if (isset($_FILES['error']) and ($_FILES['error']  != 0)) {
				$this->log->warning('error while uploading ' . $_FILES['files']['name'][$i] . ': ' . $_FILES['error']);
				continue;
			}

			// bug in FF < 50 @see https://bugzilla.mozilla.org/show_bug.cgi?id=373621
			if ($_FILES['files']['type'][$i] == 'application/force-download') {
				$this->log->warning($_FILES['files']['name'][$i] . " has is detected as wrong filetype. \n\nIf you are using an outdated version of Firefox, this might be a result of a known and fixed bug. Please update your browser.");
				continue;
			}

			if (!in_array($_FILES['files']['type'][$i], $acceptedFiles)) {
				$this->log->warning($_FILES['files']['name'][$i] . ' has wrong type ' . $_FILES['files']['type'][$i]);
				continue;
			}
			
			if ($_FILES['files']['error'][$i] != 0) {
				$this->log->warning('error  ' . $_FILES['files']['error'][$i] . ' in file ' . $_FILES['files']['name'][$i]);
				continue;
			}

			$x  = move_uploaded_file($_FILES['files']['tmp_name'][$i], $this->settings['rep_path'] . '/' . $destination);
			$this->log->log('ul:' . $x . ':' . $destination);
			
			$uploadedFiles[] = $destination;
		}
		
		$this->return['uploadedFiles'] = $uploadedFiles;

		$this->getRepository();
		

	}


	function uploadCSV() {
		$this->log->log($_FILES);

		// check for too big uploads
		if (!isset($_FILES['files']) or !count($_FILES['files'])) {
			throw new Exception("Unknown Error, maybe file to big");
		}

		$i = 0;

		$acceptedFiles = array(
			'text/csv'
		);

		if (!in_array($_FILES['files']['type'][$i], $acceptedFiles)) {
			throw new Exception($_FILES['files']['name'][$i] . ' has wrong type ' . $_FILES['files']['type'][$i]);
		}



		if ($_FILES['files']['error'][$i] != 0) {
			throw new Exception('error  ' . $_FILES['files']['error'][$i] . ' in file ' . $_FILES['files']['name'][$i]);
		}



		$this->return['csv'] = file_get_contents($_FILES['files']['tmp_name'][$i]);


	}
	
	
	/* other */
	
	
	function getRepository() {
		$rep = scandir($this->settings['rep_path']);
		
		$list = array();
		
		foreach ($rep as $fil) {
			
			if ($fil == '.' or $fil == '..') {
				continue;
			}
			$file = $this->settings['rep_path'] . '/' . $fil; 
			$file_parts = pathinfo($file);
			
			$ext = (isset($file_parts['extension'])) ? strtolower($file_parts['extension']) : '';
			
			//$this->log->log($ext . . $file . is_dir($file));
			
			if ($ext == 'pdf') {
				$list[] = array('path' => $fil, 'caption' => $fil, 'type' => 'file');
				continue;
			}
			
			if ($ext == 'pdfdir' and is_dir($file)) {
				$list[] = array('path' => $fil, 'caption' => "[DIR] $fil", 'type' => 'dir');
			}
			
		}
		
		$this->return['repository'] = $list;

	}

	/**
	 * this is provisional solution. will be implemented in the deriving backend class, when this is transformed into a
	 * generic webservice for different backends
	 */
	function getBackendData() {
		$backendData = array();

		require_once('backends/ojs2/db.class.php');
		$db = new \backends\ojs2\db($this->settings['ojs2']);
		$query =
			"select 
				journals.journal_id, 
				path as journal_key,
				setting_value as supportedLocales 
			 from 
			 	journals
				left join journal_settings on journals.journal_id = journal_settings.journal_id
			where 
				setting_name = 'supportedLocales'
			order by
				path;";
		$result = $db->query($query);
		$output = array();
		foreach ($result as $row) {
			$output[$row['journal_key']] = array(
				'id'		=>	$row['journal_id'],
				'locales'	=>	unserialize($row['supportedLocales'])
			);
		}
		$this->return['backendData'] = array('journals' => $output);
	}
	
	function getRepositoryFolder() {

		if (!property_exists($this->data, 'dir')) {
			throw new Exception("no dir given!");
		}

		$dir = $this->settings['rep_path'] . '/' . $this->data->dir;
		
		if (!file_exists($dir)) {
			throw new Exception("dir $dir is not in state of existence");
		}
		
		if (!is_dir($dir)) {
			throw new Exception("$dir is not a dir");
		}
		
		$this->return['dir'] = array_values(array_filter(scandir($dir), function($e) {
			$file_parts = pathinfo($this->settings['rep_path'] . '/' . $e);
			return ((isset($file_parts['extension']) && (strtolower($file_parts['extension'])) == 'pdf'));
		}));
		

		
		
	}
	
	function checkFile($file) {
		if (substr($file, 0, 1) != '/') { // relative path
			$file = $this->settings['rep_path'] . '/' . $file;
		}
		if (!file_exists($file)) {
			throw new Exception("File " . $file . ' does not exist!');
		}
		return true;
	}

	private function _clean_string($string) {
		$string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
		$string = preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.

		return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
	}



	
	
}



?>
