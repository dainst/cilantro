<?php
/**
 * extension of the TCPDF class to create front matters
 * 
 * 
 * 
 * @author Philipp Franck
 *
 */
class daiPDF extends TCPDF {

	public $metadata = array();

	public function daiPrint($html, $font = '1') {

		switch($font) {
			case '1': 	$this->SetFont('dejavusanscondensed', '', 13, '', true); break;
			case '2': 	$this->SetFont('dejavusanscondensed', '', 18, '', true); break;
			case '3': 	$this->SetFont('dejavusans', 'B', 22, '', true); break;
			case '2B': 	$this->SetFont('dejavusanscondensed', 'B', 18, '', true); break;
			case 'S': 	$this->SetFont('dejavusansextralight', 'B', 20, '', true); break;
		}

		//$this->Cell('','',$text,0,0,'C',false,'',0,0,'T','M');
		//$this->Write(0, $text, '', 0, 'L', true, 0, false, false, 0);

		$html = '<p style="text-align:justify">' . $html . '</p>';
		$this->writeHTML($html, true, 0, true, true);


		//$this->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);
	}


	public function daiFrontpage() {
		$this->daiPrint($this->metadata['article_author'], '2B');
		$this->daiPrint($this->metadata['article_title'], '2');
		$this->daiPrint('<br>from<br>', '1');
		$this->daiPrint($this->metadata['journal_title'], '2B');
		$this->daiPrint($this->metadata['journal_sub'], '2');
		$this->daiPrint($this->metadata['issue_tag']);

	}

	public function daiInit($metadata) {

		$this->metadata = $metadata;

		// set document information
		//$this->SetCreator(PDF_CREATOR);
		$this->SetAuthor($this->metadata['article_author']);
		$this->SetTitle($this->metadata['article_title']);
		//$this->SetSubject('TCPDF Tutorial');
		//$this->SetKeywords('TCPDF, PDF, example, test, guide');

		$this->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

		// set margins
		$this->SetMargins(12, 50, 12);

		// set auto page breaks
		$this->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

		// set image scale factor
		$this->setImageScale(PDF_IMAGE_SCALE_RATIO);

		// set default font subsetting mode
		$this->setFontSubsetting(true);

		// Add a page
		$this->AddPage();
	}

	//Page header
	public function Header() {

		$path = realpath(__DIR__);
		$this->SetFont('dejavusansextralight', '', 20);

		$this->writeHTMLCell(0, 35, 13, 26,'German Archaeological Institute<br><b><span style="color: rgb(0, 68, 148)">e</span><span style="color: rgb(133, 134, 138)">-</span></b>Publications', 0, 1, 0, true, '', true);
		$this->Image("$path/artwork/dailogo.png", 10, 8, '', 35, 'PNG', '', 'T', false, 300, 'R', false, false, 0, false, false, false);

		$this->SetLineStyle(array('width' => 0.85 / $this->k, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 68, 148)));
		$this->SetY((2.835 / $this->k) + max($this->getImageRBY(), $this->y));
		$this->SetX($this->original_lMargin + 1);
		$this->Cell(($this->w - $this->original_lMargin - $this->original_rMargin), 0, '', 'T', 0, 'C');

	}

	// Page footer
	public function Footer() {
		//$this->daiPrint();
		$this->SetY(-80);
		$this->daiPrint($this->metadata['journal_info']);
		//$this->writeHTMLCell(0, 35, 13, 26,$this->metadata['journal_info'], 0, 1, 0, true, '', true);
	}
}