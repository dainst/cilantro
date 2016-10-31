<?php



/**
 * 
 * 
 * STAND

 * 
 * 
 * 
 * 
 * @author Philipp Franck
 * 
 * abstract for different journal extensions
 *
 */
class journal {
	public $settings = array();		// settings from settings file like paths and so
	
	public $metadata = array(
		'article_author'	=> '###', 
		'article_title'		=> '###',
		'editor'			=> '###',
		'issue_tag'			=> '###',
		'journal_title'		=> '###',
		'journal_url'		=> '###',
		'pages'				=> '###',
		'pub_id'			=> '###',
		'publisher'			=> '###',	
		'url'				=> '###',
		'urn'				=> '###',
		'volume'			=> '###',
		'year'				=> '###',
		'zenon_id'			=> '###'
		
	);
	
	public $lang = array();
	
	private $_base_path = "../";
	private $_journals_path = "../";
	
	public $logger;
	
	function __construct($logger, $settings, $base_path = "../") {
		$this->_base_path = $base_path;
		include_once($this->_base_path  . 'settings.php');
		$this->settings = $settings;
		$this->logger = $logger;
		$this->lang = json_decode(file_get_contents(realpath(__DIR__ . '/../journals/common.json')));
		
	}
	
	function setDefaultMetadata($article, $issue) {
		
		$this->metadata['article_author']	= $this->assembleAuthorlist($article);
		$this->metadata['article_title' ] 	= $article->title->value->value;		
		$this->metadata['pages']			= "{$article->pages->value->realpage} - {$article->pages->value->endpage}";
		$this->metadata['pub_id']			= $article->pubid;
		$this->metadata['url']				= $article->url;
		$this->metadata['urn']				= $article->urn;
		$this->metadata['volume']			= $issue->volume->value->value;
		$this->metadata['year']				= $issue->year->value->value;
		$this->metadata['zenon_id']			= $issue->year->value->value;

	}
	
	function checkMetadata() {
		foreach($this->metadata as $key => $value) {
			if ($value == '###') {
				$this->logger->warning('Metadata ' . $key . ' not set');
			} 
		}
	}
	
	function createFrontPage($article, $issue) {
		$this->setDefaultMetadata($article, $issue);
		$this->setMetadata($article, $issue);
		$this->checkMetadata();
		$pdf = $this->createPDF();		
		$pdf->daiFrontpage(); // default frontpage layout
		$path = $this->settings['tmp_path'] . '/' . md5($article->title->value->value) . '.pdf';
		$pdf->Output($path, 'F');
		return $path;
	}
	
	
	function createPDF() {
		define(K_TCPDF_THROW_EXCEPTION_ERROR, true);
		require_once('inc/TCPDF/tcpdf.php');
		require_once('daipdf.class.php');
		
		define(XXXXXX, true);
		$pdf = new daiPDF('P', 'mm', 'A4', true, 'UTF-8', false);
		$pdf->logger = $this->logger;
		
		$pdf->daiInit($this->lang, $this->metadata);
		
		return $pdf;
	}
	
	public function assembleAuthorlist($article) {
		$author_list = [];
		foreach ($article->author->value as $author) {
			$author_list[] = "{$author->firstname} {$author->lastname}";
		}
		return implode(' – ', $author_list);
	
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