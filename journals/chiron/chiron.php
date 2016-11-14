<?php
class chiron extends journal {
	function setMetadata($article, $issue) {

		//error_reporting(E_ALL);
		//ini_set('display_errors', 1);
		
		$this->metadata['journal_title'] 	= 'Chiron';
		$this->metadata['journal_sub'] 		= 'Mitteilungen der Kommission für alte Geschichte und Epigraphik des Deutschen Archäologischen Instituts';
		$this->metadata['editor'] 			= "Kommission für Alte Geschichte und Epigraphik des DAI, Amalienstr. 73b, 80799 München";
		$this->metadata['journal_url'] 		= "https://publications.dainst.org/chiron";
		$this->metadata['issue_tag']		= "{$issue->volume->value->value} • {$issue->year->value->value}";
		$this->metadata['issn']				= "0069-3715";
		
		if ($this->metadata['volume'] > 35) {
			$this->metadata['publisher'] 	= "Walter de Gruyter GmbH, Berlin";
		} else {
			$this->metadata['publisher'] 	= "Verlag C. H. Beck, München";
		}
	}
}
?>
