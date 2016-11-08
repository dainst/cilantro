<?php
class ojsis { // you're my wonderwall bla bla whimmer
	
	// return value
	public $return = array();
	
	// do we debug log? (change in server script)
	public $debug = false;
	// debug log
	public $debuglog = array();
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
	 * @param <array> $additional_settings (base_path, skiplock, skippw) <- necessary to use this from testing contexts
	 * @throws Exception
	 */
	function __construct($data, $logger, $additional_settings = array()) {
		
		$this->log = $logger;
		
		$this->log->log('starting ojsis');
				
		$this->_base_path = isset($additional_settings['base_path']) ? $additional_settings['base_path'] : '../';
		
		set_error_handler(array($this, 'errorHandler'));
				
		include_once($this->_base_path . 'settings.php');
		$this->settings = $settings;
		
		$this->data = $data;
				
		$this->getUploadId();
		/*
		if(!isset($additional_settings['skiplock'])) {
			$this->checkLock();
		}
		*/
	}
	
	function call($task, $additional_settings = array()) {
		
		if (!in_array($task, $this->noPwFunctions)) {
			if (!$this->checkPw() and !isset($additional_settings['skippw'])) {
				throw new Exception("Wrong Password");
			}
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
		$this->getJournal();
		$this->_journal->checkFile($this->data->file);
	}
	

	
	/**
	 *  __destruct is counted und get only called in case of really fnishing the script, we call finish in most cases manually
	 *  so we need both, in case of error finish as well
	 */
	private $_isdead = false;
	
	function finish() {
		$this->log->log('finishing ojsis');
		$this->ojsUnlock();
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
	
		try {
			
			$this->log->log('starting import');
			
			$this->log->log("temporaly lock down OJS for writing");
			$this->ojsLockdown();
			
			$this->log->log("get last used ID in OJS and assume URNs and URLs");
			$lastId = $this->getLastId();
			$this->assumeUrls($lastId);
			
			$this->log->log("get journal specific instructions");
			$journal = $this->getJournal();
			
			if ($journal->doCut) {
				$this->log->log("cut the pdf file into pieces");
				$this->cutPdf();
			} else {
				$this->log->log("cut pdf file into pieces disabled");
			}

			if (!$journal->doImport) {
				$this->log->log("ready, import disabled");
				$this->clearTmp();
				return;
			}
			
			$this->log->log("make transport XML");
			$xmlFile = $this->makeXML(true);
				
			$this->log->log("pump into ojs");
			$execline = "php {$this->settings['ojs_path']}/tools/importExport.php NativeImportExportPlugin import {$this->settings['tmp_path']}/$xmlFile {$data->journal->ojs_journal_code} {$this->settings['ojs_user']}";
		
			$this->log->log("this is my last result");
			$this->debuglog[] = $execline;
			$this->return['message'] = shell_exec($execline);
						
			$this->log->log("check if it  was successfull?");
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
							
			$this->log->log("read in what we have done");
			$this->getDainstMetadata();
			$this->checkUpload($lastId);
				
			$this->log->log("create report about ids to zenon");
			$this->createZenonReport();
	
			$this->log->log("tidy up");
			$this->clearTmp();
			
			if ($this->debug) {
				throw new Exception("success but debug is on!");
			}

		} catch (Exception $e) {
			$this->ojsUnlock();
			$this->log->debug($this->data);
			
			$this->writeLog();
			throw $e;
		}
	
	}
	
	
	/**
	 * get journal specific stuff
	 * @param unknown $data
	 * @return <journal>
	 */
	function getJournal() {
		if ($this->_journal) {
			return $this->_journal;
		}
		$data = $this->data;
		$journal = $data->journal->journal_code;
		require_once("journal.class.php");
		$file = $this->_base_path . "journals/{$journal}/{$journal}.php";
		require_once($this->_base_path . "journals/{$journal}/{$journal}.php");
		$this->_journal = new $journal($this->log, $this->settings, $this->_base_path);
		$this->log->log("use journal " . $data->journal->journal_code);
		
		return $this->_journal;
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
				
			$start = (int) $article->pages->value->realpage + (int) $article->pages->context->offset;
			$end   = (int) $article->pages->value->endpage  + (int) $article->pages->context->offset;
			$end   = $end ? $end : $start;
			
			$isDir = (substr($data->journal->importFilePath, -6) == 'pdfdir');
			
			
			
			$name  = $isDir ? $article->filepath : "{$article->filepath}.$nr.pdf";
			$outp  = str_replace('/','-', $name);

			$front = $this->_journal->createFrontPage($article, $data->journal);
			
			$this->log->log("XXX" . $front);
			$shell = "pdftk A={$this->settings['rep_path']}/{$article->filepath}  B=$front cat B1 A$start-$end output {$this->settings['tmp_path']}/$outp 2>&1";
				
			$this->log->debug($shell);
				
			$cut = shell_exec($shell);
				
			if($cut != '') {
				throw new Exception($cut);
			}
				
			$data->articles[$nr]->filepath = "{$this->settings['tmp_path']}/$outp";
				
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
		$journal = $data->journal;
		$articles = $data->articles;
				
		ob_start();
		include('xml_template.php');
		$xml = ob_get_contents();
		ob_end_clean();
		
		try {
			$test = new SimpleXMLElement($xml); // should throw an error on error..
		} catch(Exception $e) {
			$this->debuglog[] = $xml;
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
	 * checkUpload
	 * 
	 * 
	 * @param unknown $desired_from - last given ojs id when upload began
	 */
	function checkUpload($last_index) {

		$ids = array_keys($this->return['dainstMetadata']);
		sort($ids);
		$desired_from 	= $last_index + 1;
		$desired_to 	= count($this->data->articles) - 1 + $desired_from;
		$reality_from 	= $ids[0];
		$reality_to 	= $ids[count($ids) - 1];
		
		if ($desired_from != $reality_from or $desired_to != $reality_to) {
			$this->log->warning("Something went wrong! Articles where imported but gut the wrong IDs.  Desired: $desired_from - $desired_to. Reality: $reality_from - $reality_to");
		}
		
		$this->log->debug("IDs. Desired: $desired_from - $desired_to. Reality: $reality_from - $reality_to");

		//throw new Exception("IDs. Desired: $desired_from - $desired_to. Reality: $reality_from - $reality_to");
	}
	
	
	/**
	 * its a little bit unconvient, but this is the only solution I found to connect get the ids of uploaded stuff to publish them in
	 * zenon and stuff.
	 *
	 */
	function getDainstMetadata() {
			
		$db = $this->getDB();
	
		$sql =
		"SELECT
			a_s.article_id as id,
			a_s.setting_value as abstract
		FROM
			{$this->settings['mysql_prefix']}article_settings as a_s
		WHERE
			a_s.setting_name = 'abstract'" .
			(isset($this->return['uploadId']) ? " and a_s.setting_value like '%dainst_metadata:{$this->return['uploadId']}%'" : " and a_s.setting_value like '%dainst_metadata:%'");

		$this->log->debug($sql);
			
		foreach ($db->query($sql) as $row) {
			$this->return['dainstMetadata'][$row['id']] = $this->_harvestDainstMetadata($row['abstract']);
		}
		
		return $this->return['dainstMetadata'];
	}
	
	
	/**
	 *
	 * creates a report with zeninIds
	 *
	 */
	function createZenonReport() {
		$data = $this->data;
		ob_start();
		include('report_template.php');
		$xml = ob_get_contents();
		ob_end_clean();
	
		$test = new SimpleXMLElement($xml); // should throw an error on error..
	
		$this->return['xml'] = $xml;
		$this->sendReport('urls.xml', $xml);
	}
	
	/**
	 * send report to sabine
	 *
	 * to keep it easy we just save it and send them manually later
	 *
	 */
	function sendReport($filename, $content) {
		file_put_contents($this->settings['log_path'] . '/' . $this->return['uploadId'] . '.' . $filename, $this->return['xml']);
	}
	
	
	/* send to zenon */
	
	/**
	 *
	 */
	function sendToZenon() {
			
		$data = $this->data;
		$journal = $data->journal;
		$article = $data->article;
	
		ob_start();
		include('marc_template.php');
		$xml = ob_get_contents();
		ob_end_clean();
	
		$test = new SimpleXMLElement($xml); // should throw an error on error..
	
		$this->return['message'] = "XML successfully generated";
		$this->return['xml'] = $xml;
	
		$this->sendReport($data->article->title->value->value . '.xml', $xml);
	}
	

	
	
	/* helper functions */
	
	/**
	 * get journal object. this is only necessary in for other environments than the server script (eg the testing suite)
	 */
	function getJournalObject() {
		return $this->_journal;
	}
	
	
	
	/**
	 * clear all tmp data
	 */
	function clearTmp() {
		//array_map('unlink', glob($this->settings['tmp_path'] . '/*'));
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
		$this->log->log('pw set ' . $this->settings['password']);
		return (isset($data->password) and ($data->password == $this->settings['password']));
	}
		
	/*  lock related functions */
	
	/**
	 * 
	 * checks if lock file with this IP is present
	 * 
	 * @throws Exception
	 */
	/*
	function checkLock() {
		
		return true; // check lock diabled because it eats my nerves
				
		$ip = !empty($_SERVER['HTTP_CLIENT_IP']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];
		$time = time();
		$lockfile = $this->settings['log_path'] . '/lock';
		$uploadId = $this->getUploadId();
		
		$lockcode = $time . '###' . $ip . '###' . $uploadId;
		$this->log->debug("lockcode: " . $lockcode);

		if (isset($this->data->unlock) && $this->data->unlock) {
			$this->unlockSession();
		}
		
		if (file_exists($lockfile)) {
			list($locked_time, $locked_ip, $locked_uid) = explode('###', file_get_contents($lockfile));
			if ($locked_ip != $ip) {
				throw new Exception("Importer is locked by another user");
			}
			if ($locked_uid != $uploadId) {
				$this->log->debug("More than one session going on ($locked_uid != $uploadId)");
				throw new Exception("Session locked");
			}
		}
		file_put_contents($lockfile, $lockcode);

	}
	


	function unlockSession() {
		$this->log->log('unlocking session');
		$lockfile = $this->settings['log_path'] . '/lock';
		unlink($lockfile);
	}
	*/
	/* ojs functions */
	
	/**
	 * 
	 * @throws Exception
	 */
	function ojsLockdown() {
					
		//  prevent no login
		file_put_contents($this->settings['ojs_path'] . '/lock',   '');
		
		// kill ojs sessions
		$db = $this->getDB();
		$db->query("DELETE FROM sessions");
	}
	
	function ojsUnlock() {		
		$this->log->log('unlock');
		if (file_exists($this->settings['ojs_path'] . '/lock')) {
			unlink($this->settings['ojs_path'] . '/lock');
		}
	}

	
	
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
	
	
	/* database related functions */
	
	/**
	 *
	 * @return ojs_database
	 */
	function getDB() {
		if (!$this->_db) {
			require_once('ojs_database.class.php');
			$this->_db = new ojs_database($this->settings);
		}
		return $this->_db;
	}
	
	/**
	 * getLastID from DB
	 */
	function getLastId() {
		$db = $this->getDB();
		
		$sql = "SELECT max(a.article_id) as id FROM articles as a";
		
		foreach ($db->query($sql) as $row) {
			$next = $row['id'];
		}
		
		$this->log->debug('next id: ' + $next);
		
		return $next;
	}
	
	
	/**
	 * assume url Urn
	 */
	function assumeUrls($last) {
		foreach ($this->data->articles as $nr => $article) {
			$article->pubid 		= $last + 1 + $nr;
			$article->url 			= $this->settings['ojs_url'] . $this->data->journal->ojs_journal_code . '/' . $article->pubid;
			$article->urn 			= sprintf($this->settings['urn_base'], $this->data->journal->ojs_journal_code, $article->pubid);
		}
	}
	
	
	
	
	/**
	 * 
	 */
	function testDatabaseConnection() {
		$db = $this->getDB();
	}
		
	/**
	 * 
	 * @param unknown $abstract
	 * @return multitype:NULL
	 */
	private function _harvestDainstMetadata($abstract) {		
		$regex = isset($this->return['uploadId']) ? "#dainst_metadata:{$this->return['uploadId']}:([^\':]*):([^\']*)#" : "#dainst_metadata:[^:]*:([^\':]*):([^\']*)#";		
		preg_match_all($regex, $abstract, $matches);		
		$return = array();		
		/*var_dump($abstract);
		var_dump($matches);
		echo "\n\n--\n\n";*/
		foreach($matches[1] as $i=>$key) {
			$return[$key] = $matches[2][$i];
		}
		return $return;
	}
	

	/* other */

	
	/**
	 * 
	 * @param unknown $article
	 * @return string
	 */
	private function _assembleAuthorlist($article) {
		$author_list = [];
		foreach ($article->author->value as $author) {
			$author_list[] = "{$author->firstname} {$author->lastname}";
		}
		return implode('; ', $author_list);

	}
	
	
	/* upload functions */
	
	function upload() {
		$this->log->log($_FILES);
		
		if (!isset($_FILES['files']) or !count($_FILES['files'])) {
			throw new Exception("No files!");
		}
		
		$uploadedFiles = [];
		
		for($i = 0; $i < count($_FILES['files']['name']); $i++) {
			$destination = $this->settings['tmp_path'] . '/' . $_FILES['files']['name'][$i];
			$this->log->debug('goto ' . $destination);
			
			if (!in_array($_FILES['files']['type'][$i], array('application/acrobatreader', 'application/pdf'))) {
				$this->log->warning($_FILES['files']['name'][$i] . ' has wrong type ' . $_FILES['files']['type'][$i]);
				continue;
			}
			
			if ($_FILES['files']['error'][$i] != 0) {
				$this->log->warning('error  ' . $_FILES['files']['error'][$i] . ' in file ' . $_FILES['files']['name'][$i]);
				continue;
			}
			
			$x  = move_uploaded_file($_FILES['files']['tmp_name'][$i], $destination);
			$this->log->log('ul:' . $x . ':' . $destination);
			
			$uploadedFiles[] = $_FILES['files']['name'][$i];
		}
		
		$this->return['uploadedFiles'] = $uploadedFiles;
		

	}
	
	
	
	/* other */
	
	function resetSession() {
		$this->clearTmp();
		//$this->unlockSession();
	}
	
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
	
	function getRepositoryFolder() {
		
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
	

	
	
}

?>