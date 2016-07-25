<?php
class ojsis { // you're my wonderwall bla bla whimmer
	
	public $return = array(
		'warnings'	=> array()
	);
	
	public $debug = array();
	
	private $_journal = null;
	
	public $settings = array();
	
	function __construct($data) {
		set_error_handler(array($this, 'errorHandler'));
		
		include_once('../settings.php');
		$this->settings = $settings;
		
		if (!$this->checkPw($data)) {
			throw new Exception("Wrong Password");
		}
		
		$uploadId = $this->getUploadId($data);
		
		
		$this->debug[] = $uploadId;
		$this->debug[] = print_r($this->settings,1);
		
	}

	
	function finish() { // not __destruct, because it shall not be called in case of exception
		array_map('unlink', glob($this->settings['tmp_path'] . '/*'));
	}
	
	function errorHandler($fehlercode, $fehlertext, $fehlerdatei, $fehlerzeile) {
		$this->return['warnings'][] = "Error $fehlercode in $fehlerdatei row $fehlerzeile: $fehlertext";
	}
	
	function makeXML($data, $save = false) {
		$journal = $data->journal;
		$articles = $data->articles;
				
		ob_start();
		include('xml_template.php');
		$xml = ob_get_contents();
		ob_end_clean();
		
		try {
			$test = new SimpleXMLElement($xml); // should throw an error on error..
		} catch(Exception $e) {
			$this->debug[] = $xml;
			throw $e;
		}
		
		
		if ($save) {
			$filename = 'importXml.' . $this->getUploadId($data) . '.xml';
			file_put_contents($this->settings['tmp_path'] . '/' . $filename, $xml);
			$this->return['filename'] = $filename;
			return $filename;
		} else {
			$this->return['message'] = "XML successfully generated";
			$this->return['xml'] = $xml;
		}
		
	}
	
	function sendToZenon($data) {
		$journal = $data->journal;
		$article = $data->article;
	
		ob_start();
		include('marc_template.php');
		$xml = ob_get_contents();
		ob_end_clean();
		
		$test = new SimpleXMLElement($xml); // should throw an error on error..
		
		$this->return['message'] = "XML successfully generated";
		$this->return['xml'] = $xml;
		
		$this->return['f'] = print_r($journal,1);
		
		$this->sendReport($data->article->title->value->value . '.xml', $xml);
	}
	
	/**
	 * get journal specific stuff
	 * @param unknown $data
	 * @return unknown
	 */
	function getJournal($data) {
		$journal = $data->journal->journal_code;
		require_once("journal.class.php");
		require_once("../journals/{$journal}/{$journal}.php");
		$this->_journal = new $journal($this->settings);
		return $data;
	}
	
	/**
	 * do it
	 * 
	 * @param unknown $data
	 * @throws Exception
	 */
	function toOJS($data) {
		
		try {
			
			// get journal specific fu
			$data = $this->getJournal($data);
			
			// cut my life (the pdf file) into pieces
			$data = $this->cutPdf($data);
			
			// make transport XML
			$xmlFile = $this->makeXML($data, true);
			
			// pump into ojs
			$execline = "php {$this->settings['ojs_path']}/tools/importExport.php NativeImportExportPlugin import {$this->settings['tmp_path']}/$xmlFile {$data->journal->ojs_journal_code} {$data->journal->ojs_user}";
			
			// this is my last result
			$this->debug[] = $execline;	
			$this->return['message'] = shell_exec($execline);
			$successmsg = "The import was successful";
			if (substr($this->return['message'], 0, strlen($successmsg)) != $successmsg) {
				throw new Exception($this->return['message']);
			}
			
			// create report about ids to zenon
			$this->getDainstMetadata($data);
			$this->createZenonReport($data);
			
		} catch (Exception $e) {
			// write debug log
			$this->debug[] = $this->data;
			file_put_contents("{$this->settings['log_path']}/{$this->return['uploadId']}.log", implode("\n", $this->debug));
			throw $e;
		}
		
		

		
	}
	
	function cutPdf($data) {

		foreach ($data->articles as $nr => $article) {
			
			$start = (int) $article->pages->value->realpage + (int) $article->pages->context->offset;
			$end   = (int) $article->pages->value->endpage  + (int) $article->pages->context->offset;
			$end   = $end ? $end : $start;
			$name  = "{$data->journal->importFilePath}.$nr.pdf"; 
			$front = $this->_journal->createFrontPage($article, $data->journal);
			
			$shell = "pdftk A={$this->settings['rep_path']}/{$data->journal->importFilePath}  B=$front cat B1 A$start-$end output {$this->settings['tmp_path']}/$name 2>&1";
			
			$this->debug[] = $shell;
			
			$cut = shell_exec($shell);
			
			if($cut != '') {
				throw new Exception($cut);
			}
			
			$data->articles[$nr]->filepath = "{$this->settings['tmp_path']}/$name";
			
		}
		
		return $data;
	}
	
	
	/**
	 * it a little bit unconvient, but this is the only solution I found to connect get the ids of uploaded stuff to publish them in
	 * zenon and stuff.
	 * 
	 * 
	 * @param unknown $data
	 */
	function getDainstMetadata($data) {
		
		$mysqli = new mysqli('localhost', $this->settings['mysql_user'], $this->settings['mysql_password'], $this->settings['mysql_db']);
		if ($mysqli->connect_errno) {
			throw new Exception("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
		}
		
		$sql = 
		"SELECT
			a_s.article_id as id,
			a_s.setting_value as abstract
		FROM 
			{$this->settings['mysql_db']}.{$this->settings['mysql_prefix']}article_settings as a_s
		WHERE 
			a_s.setting_name = 'abstract'
		    and
			a_s.setting_value like '%dainst_metadata:{$this->return['uploadId']}%'
		GROUP BY
			a_s.article_id";
		
		$this->debug[] = $sql;
			
		if ($result = $mysqli->query($sql)) {
			$this->return['dainstMetadata'] = array();
			while($row = $result->fetch_assoc()){
				$this->return['dainstMetadata'][$row['id']] = $this->_harvestDainstMetadata($row['abstract']);
			}
			$this->debug[] = print_r($this->return['dainstMetadata'], 1);
		} else {
			throw new Exception('found nothing in sql' . $sql);
		}
		
	}
	
	private function _harvestDainstMetadata($abstract) {		
		$regex = "#dainst_metadata:{$this->return['uploadId']}:([^\':]*):([^\']*)#";		
		preg_match_all($regex, $abstract, $matches);		
		$return = array();		
		foreach($matches[1] as $i=>$key) {
			$return[$key] = $matches[2][$i];
		}
		return $return;
	}
	
	/**
	 * 
	 * creates a report with zeninIds
	 * 
	 * @param unknown $data
	 */
	function createZenonReport($data) {
		
		ob_start();
		include('report_template.php');
		$xml = ob_get_contents();
		ob_end_clean();
		
		$test = new SimpleXMLElement($xml); // should throw an error on error..
		
		$this->return['xml'] = $xml;
		$this->sendReport('urls.xml', $xml);
	}
	
	
	function checkPw($data) {
		return (isset($data->password) and ($data->password == $this->settings['password']));
	}
	
	function checkStart($data) {	
		if (!file_exists($this->settings['rep_path'] . '/' . $data->file))  {
			throw new Exception("File " . $this->settings['rep_path'] . '/' . $data->file . ' does not exist!');
		}
	}
	
	function getUploadId($data) {
		if (!isset($this->return['uploadId']) or !$this->return['uploadId']) {
			$this->return['uploadId'] = md5(time());		
		}
		
		if (isset($data->uploadId)) {
			$this->return['uploadId'] = $data->uploadId;
		}

		return $this->return['uploadId'];
	}
	
	/**
	 * send report to sabine
	 * 
	 * to keep it easy we just save it and send them manually later
	 * 
	 * @param unknown $data
	 */
	function sendReport($filename, $content) {
		file_put_contents($this->settings['log_path'] . '/' . $this->return['uploadId'] . '.' . $filename, $this->return['xml']);
	}
	
	private function _assembleAuthorlist($article) {
		$author_list = [];
		foreach ($article->author->value as $author) {
			$author_list[] = "{$author->firstname} {$author->lastname}";
		}
		return implode('; ', $author_list);

	}
	
	
}

?>