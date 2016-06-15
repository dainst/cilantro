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
		
	}
	function xxx() {
		
	}
	
	function finish() { // not __destruct, because it shall not be called in case of exception
		array_map('unlink', glob($this->settings['tmp_path'] . '/*'));
		file_put_contents("{$this->settings['tmp_path']}/import.".microtime(true).".log", implode("\n", $this->debug));
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
		
		$test = new SimpleXMLElement($xml); // should throw an error on error..
		
		if ($save) {
			$filename = 'importXml.' . microtime(true) . '.xml';
			file_put_contents('../tmp/' . $filename, $xml);
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
	}
	
	/**
	 * get journal specific stuff
	 * @param unknown $data
	 * @return unknown
	 */
	function getJournal($data) {
		$journal = $data->journal->journal_code;
		require_once("../journals/{$journal}/{$journal}.php");
		$this->_journal = new journal($data);
		return $data;
	}
	
	/**
	 * do it
	 * 
	 * @param unknown $data
	 * @throws Exception
	 */
	function toOJS($data) {
		
		// get jpurnal specific fu
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
	}
	
	function cutPdf($data) {

		foreach ($data->articles as $nr => $article) {
			
			$start = (int) $article->pages->value->realpage + (int) $article->pages->context->offset;
			$end   = (int) $article->pages->value->endpage  + (int) $article->pages->context->offset;
			$end   = $end ? $end : $start;
			$name  = "{$data->journal->importFilePath}.$nr.pdf"; 
			$front = $this->_journal->createFrontPage($data);
			
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
	
	
	function checkPw($data) {
		return (isset($data->password) and ($data->password == $this->settings['password']));
	}
	
	function checkStart($data) {	
		if (!file_exists($this->settings['rep_path'] . '/' . $data->file))  {
			throw new Exception("File " . $this->settings['rep_path'] . '/' . $data->file . ' does not exist!');
		}
	}
	
}

?>