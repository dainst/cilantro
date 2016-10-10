<?php



/**
 * 
 * @author Philipp Franck
 * 
 * abstract for different journal extensions
 *
 */
class journal {
	public $settings = array();
	
	
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
	
}