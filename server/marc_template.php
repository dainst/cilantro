<?php
if (!isset($article->author)) {
	$this->log->debug($article);
	throw new Exception("Article '{$article->title}' has no author!");
}

$author_list = $this->_assembleAuthorlist($article);

?>
<?php echo '<?xml version="1.0" encoding="UTF-8"?>', "\n"; ?>
<?php echo '<collection xmlns="http://www.loc.gov/MARC21/slim">', "\n" ?>
	<record>

		<controlfield tag="008">160120s2015    gw            000   ger d</controlfield>
		<leader>     nab a22      a 4500</leader>

		<datafield tag="100" ind1="1" ind2=" ">
	    	<subfield code="a"><?php echo htmlspecialchars($article->author[0]->lastname); ?>, <?php echo htmlspecialchars($article->author[0]->firstname); ?></subfield>
		</datafield>
		
		<datafield tag="245" ind1="1" ind2="0">
			<subfield code="a"><?php echo htmlspecialchars($article->title); ?></subfield>
			<subfield code="b"></subfield>
			<subfield code="c"><?php echo htmlspecialchars($author_list); ?></subfield>
		</datafield>
		
		<datafield tag="260" ind1=" " ind2=" ">
			<subfield code="a">München :</subfield>
			<subfield code="b">Beck,</subfield>
			<subfield code="c"><?php echo htmlspecialchars($journal->year); ?></subfield>
		</datafield>
		
		<datafield tag="300" ind1=" " ind2=" ">
			<subfield code="a"><?php echo htmlspecialchars($article->pages->startPrint); ?>-<?php echo htmlspecialchars($article->pages->endPrint); ?></subfield>
		</datafield>
		
		<datafield tag="504" ind1=" " ind2=" ">
			<subfield code="a">includes bibliographical references.</subfield>
		</datafield>

		<datafield tag="590" ind1=" " ind2=" ">
			<subfield code="a">arom</subfield>
		</datafield>
	
		<datafield tag="590" ind1=" " ind2=" ">
			<subfield code="a">#loadchiron</subfield>
		</datafield>
		
		<datafield tag="LKR" ind1=" " ind2=" ">
			<subfield code="a">ANA</subfield>
			<subfield code="b">(manuell: ID des Bandes)</subfield>
			<subfield code="l">DAI01</subfield>
			<subfield code="n">Chiron. Mitteilungen der Kommission für Alte Geschichte und Epigraphik des Deutschen Archäologischen Instituts, <?php echo htmlspecialchars($journal->volume); ?> (<?php echo htmlspecialchars($journal->year); ?>)</subfield>
			<subfield code="m"><?php echo htmlspecialchars($article->title); ?></subfield>
		</datafield>
	
		
		<?php /* ?>
		<datafield tag="700" ind1="1" ind2=" ">
			<?php foreach ($article->author as $author) { ?>
			<subfield code="a"><?php echo $author->lastname ?>, <?php echo $author->firstname ?></subfield>
			<?php } ?>
			<subfield code="e">joint author</subfield>
		</datafield>
		<?php //*/ ?>

		
		
		
	</record>
</collection>