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
	
	public $logger;

	public function daiInit($lang, $metadata) {
		$this->importMissingFonts();
		
		$this->lang = $lang;
		$this->metadata = $metadata;

		// set document information
		$this->SetCreator("DAI OJS Uploader");
		$this->SetAuthor($this->metadata['article_author']);
		$this->SetTitle($this->metadata['article_title']);
		//$this->SetSubject('TCPDF Tutorial');
		//$this->SetKeywords('TCPDF, PDF, example, test, guide');
		
		// set additional DAI specific metadata
		$xmp  = '<dai xmlns:dai="xml.dainst.org">';
		$xmp .= "\n\t";
		$xmp .= (isset($this->metadata['pub_id'])) ?  '<dai:pubid>' . $this->metadata['pub_id'] . '</dai:pubid>' : '';
		$xmp .= "\n\t";
		$xmp .= (isset($this->metadata['zenon_id'])) ?  '<dai:zenonid>' . $this->metadata['zenon_id'] . '</dai:zenonid>' : '';
		$xmp .= "\n\t";
		$xmp .= (isset($this->metadata['urn'])) ?  '<dai:urn>' . $this->metadata['urn'] . '</dai:urn>' : '';
		$xmp .= "\n\t";
		$xmp .= (isset($this->metadata['url'])) ?  '<dai:url>' . $this->metadata['url'] . '</dai:url>' : '';
		$xmp .= "\n";
		$xmp .= '</dai>';		
		$this->setExtraXMP($xmp);
		
		// set monosprace font
		$this->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

		// set margins // $left, $top, $right
		
		$this->SetMargins(20, 15, 19);

		// set auto page breaks
		$this->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

		// set image scale factor
		$this->setImageScale(PDF_IMAGE_SCALE_RATIO);

		// set default font subsetting mode
		$this->setFontSubsetting(true);
		
		// kill paddings
		$this->setCellPaddings(0,0,0,0);

		// Add a page
		$this->AddPage();
	}
	
	public function daiFrontpage() {
	
		$path = realpath(__DIR__);
	
		// image
		//$this->Image("$path/artwork/dailogo.png", 114, 15, '', 23, 'PNG', '', 'B', false, 300, '', false, false, 0, false, false, false);
		
		$this->ImageSVG("$path/artwork/dailogo.svg", 114, 15, '', 23, '', true, 'B');
	
		// url right to image
		$this->daiFont('xs');
		$this->SetXY(0,0.1);
		$this->Cell(0, 38,'https://publications.dainst.org', 0, 1,'R', false, 'https://publications.dainst.org ', 0, false, 'T', 'B'); //, 'T'
	
		// first grey line
		$this->SetLineStyle(array('width' => 0.1 / $this->k, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(128, 130, 133)));
		$this->SetXY(115, $this->GetY() + 2.7);
		$this->Cell(75.7, 0, '', 'T', 0, 'C');
	
		// iDAI.publications below
		//$this->SetXY(107, $this->GetY() + 2.7);
		$this->daiPrint('<span style="color: rgb(0, 68, 148)">i</span>DAI.publications', 'h1', array(
				'x' => 103,
				'y' => $this->GetY() + 1,
				'w' => 87.7,
				'align' => 'R'
		));
	
		// second grey line
		$this->SetLineStyle(array('width' => 0.1 / $this->k, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(128, 130, 133)));
		$this->SetXY(115, $this->GetY() - 1);
		$this->Cell(75.7, 0, '', 'T', 0, 'C');
	
		// underline text
		$this->daiPrint($this->lang->electronic_publication->de, "h2", array(
				'x'	=> 115.3,
				'y' => $this->GetY() + 2.7,
				'w' => 74.7,
				'align' => 'L'
		));
	
		// Sonderdruck
		$this->SetXY(20, $this->GetY() + 19);
		$this->daiPrintInfo('digital_offprint', 1.5);
	
	
		// author(s), title
		$this->SetXY(20, $this->GetY() + 3.3);
		$this->daiPrint($this->metadata['article_author'], '2');
		$this->daiPrint($this->metadata['article_title'], '3');
	
		// aus
		$this->SetXY(20, $this->GetY() + 26);
		$this->daiPrintInfo('from', 1.5);
	
		// journal
		$this->SetXY(20, $this->GetY() + 3.3);
		$this->daiPrint($this->metadata['journal_title'], '3');
		$this->daiPrint($this->metadata['journal_sub'], '2');
	
		// page
		$this->SetXY(20, $this->GetY() + 6.6);
		$this->daiPrintInfo('issue_tag', 1.5);
		$this->daiPrintInfo('pages', 1.5);
	
		// aus
		$this->SetXY(20, $this->GetY() + 28);
		$this->daiPrint('<a style="color:black;text-decoration:none" href="' . $this->metadata['url'] . '">' . $this->metadata['url'] . '</a><b style="color:rgb(128,130,133)"> / ' . $this->metadata['urn'] . '</b>');
		$this->daiPrintInfo('editor');
		$this->daiPrintInfo('journal_url');
		$this->daiPrintInfo('issn');
		$this->daiPrintInfo('publisher');
	
		// (c)
		$this->SetXY(20, $this->GetY() + 6.6);
		$this->daiPrint("<b style=\"font-family:calibrib\">©" . date('Y') . '</span> ' . $this->lang->copyright->de);
	
		// terms
		$this->SetXY(20, $this->GetY() + 3.3);
		$this->daiPrint($this->lang->terms->de);
		$this->SetXY(20, $this->GetY() + 3.3);
		$this->daiPrint('<span style="color:rgb(128,130,133)">' . $this->lang->terms->en . '</span>');

	}
	
	// some helper functions
	
	/**
	 * creates font file if font mssing
	 * @param unknown $file
	 */
	public function importMissingFonts() {
		$path = realpath(__DIR__);
	
		$fonts = array(
			"calibri",
			"calibril",
			"calibrib",
			"calibrii",
		);
	
		foreach ($fonts as $font) {
			if (!file_exists("$path/inc/TCPDF/fonts/$font.php")) {
				if (!TCPDF_FONTS::addTTFfont("$path/artwork/$font.ttf", 'TrueTypeUnicode', 32)) {
					$this->logger->warning("font $font not installed");
				} else {
					$this->logger->log("font $font successfull installed");
				}
			} else {
				$this->logger->log("font $font allready installed");
			}
		}
	
	
	}
	
	/**
	 * wrapper fro some writeHTML functions
	 * 
	 * @param unknown $html
	 * @param string $font
	 * @param unknown $cell
	 */
	public function daiPrint($html, $font = '1', $cell = array()) {
	
		$this->daiFont($font);
	
		//$html = '<p style="text-align:justify">' . $html . '</p>';
	
	
		$debug = 0;
	
		if (!count($cell)) {
			$this->writeHTML($html, true, 0, true, true);
		} else {
			$this->writeHTMLCell(
					isset($cell['w']) ? $cell['w'] : '',
					isset($cell['h']) ? $cell['h'] : '',
					isset($cell['x']) ? $cell['x'] : '',
					isset($cell['y']) ? $cell['y'] : '',
					$html,
					$debug, /* border */
					1, /* ln */
					false, /* fill */
					true, /* reseth */
					isset($cell['align']) ? $cell['align'] : '',
					true /* autopadding */
			);
		}
	
	}
	
	/**
	 * prints a line with an information triple like publisher etc.
	 *
	 * @param unknown $field
	 * @param unknown $value
	 * @param unknown $font
	 */
	public function daiPrintInfo($field, $font = '1') {
		$this->daiPrint($this->lang->$field->de . '<span style="color:rgb(128,130,133)">' . ' / ' . $this->lang->$field->en . (isset($this->metadata[$field]) ? '</span> <span style="font-family:calibrib">' . $this->metadata[$field] . '</span>' : ''), $font);
	}
	
	
	/**
	 * selects one of the rpedefiend font configurations
	 * @param unknown $font
	 */
	public function daiFont($font) {
	
		// reset
		$this->setFontSpacing(0);
	
		switch($font) {
				
			case '1':
				$this->SetFont('calibril', '', 7, '', true);
				break;
					
			case '1.5':
				$this->SetFont('calibril', '', 8, '', true);
				break;
	
			case '2':
				$this->SetFont('calibri', '', 13, '', true);
				break;
	
			case '3':
				$this->SetFont('calibrib', '', 13, '', true);
				break;
	
			case 'xs':
				$this->SetFont('calibril', '', 6, '', true);
				break;
					
			case 'h1':
				$this->setFontSpacing(0.5);
				$this->SetFont('calibril', '', 30, '', true);
				break;
	
			case 'h2':
				$this->setFontSpacing(0.3);
				$this->SetFont('calibril', '', 9, '', true);
				break;
		}
	
	}
	
	
	
	public function Header() {}
	public function Footer() {}
}