<?php



/**
 * 
 * @author Philipp Franck
 * 
 * abstract for different journal extensions
 *
 */
class journal {
	public $settings = array();		// settings from settings file like paths and so
	
	public $metadata = array(
		'article_author'	=> '', 
		'article_title'		=> '',
		'journal_title'		=> '',
		'issue_tag'			=> '',
		'journal_url'		=> '',
		'journal_info'		=> '',
		'pub_id'			=> 'unknown',
		'zenon_id'			=> 'unknown'
	);
	
	private $_base_path = "../";
	
	function __construct($settings, $base_path = "../") {
		$this->_base_path = $base_path;
		include_once($this->_base_path  . 'settings.php');
		$this->settings = $settings;
	}
	
	function setDefaultMetadata($article, $issue) {
		$this->metadata['article_author']	= $this->assembleAuthorlist($article);
		$this->metadata['article_title' ] 	= $article->title->value->value;
		$this->metadata['issue_tag']		= "VOLUME {$issue->volume->value->value} • {$issue->year->value->value}";
		$this->metadata['pub_id']			= $article->pubid;
	}
	
	function createPDF() {

		require_once('inc/TCPDF/tcpdf.php');
		require_once('daipdf.class.php');
		
		$pdf = new daiPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
		
		$pdf->daiInit($this->metadata);
		
		return $pdf;
	}
	
	public function assembleAuthorlist($article) {
		$author_list = [];
		foreach ($article->author->value as $author) {
			$author_list[] = "{$author->firstname} {$author->lastname}";
		}
		return implode('; ', $author_list);
	
	}

	
	public function checkFile($file) {
		if (substr($file, 0, 1) != '/') { // relative path
			$file = $this->settings['rep_path'] . '/' . $file;
		}
		if (!file_exists($file)) {
			throw new Exception("File " . $file . ' does not exist!');
		}
		return true;
	}
	
}