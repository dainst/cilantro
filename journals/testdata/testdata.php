<?php
class testdata extends journal {
	function setMetadata($article, $issue) {

		$this->metadata['journal_title'] 	= 'Testdata';
		$this->metadata['journal_sub'] 		= 'Unglaubliche Testdatei';
		$this->metadata['editor'] 			= "<br>Kommission für Alte Geschichte und Epigraphik des Deutschen Archäologischen Instituts, Amalienstr. 73b, 80799 München";
		$this->metadata['journal_url'] 		= "https://publications.dainst.org/test";
		$this->metadata['issue_tag']		= "{$issue->volume->value->value} • {$issue->year->value->value}";
		$this->metadata['issn']				= "666-999";
		
		$this->metadata['publisher'] 		= "Gumpg Verlag, berlin";
		
	}
	
	function checkFile($file) {
		return true;
	}
}
?>