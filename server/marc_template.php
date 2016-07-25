<?php 
if (!isset($article->author) or (!count($article->author->value))) {
	throw new Exception("Article '{$article->title->value->value}' has no author!");
}

$author_list = $this->_assembleAuthorlist($article);

?>
<?php echo '<?xml version="1.0" encoding="UTF-8"?>', "\n"; ?>
<?php echo '<collection xmlns="http://www.loc.gov/MARC21/slim">', "\n" ?>
	<record>
	
		<leader></leader>
		<controlfield tag="800"></controlfield>

		<datafield tag="100" ind1="1" ind2=" ">
	    	<subfield code="a"><?php echo htmlspecialchars($data->article->author->value[0]->firstname); ?>, <?php echo htmlspecialchars($data->article->author->value[0]->lastname); ?></subfield>
		</datafield>
		
		<datafield tag="245" ind1="1" ind2="0">
			<subfield code="a"><?php echo htmlspecialchars($article->title->value->value); ?></subfield>
			<subfield code="b"></subfield>
			<subfield code="c"><?php echo htmlspecialchars($author_list); ?></subfield>
		</datafield>
		
		<datafield tag="260" ind1=" " ind2=" ">
			<subfield code="a">München :</subfield>
			<subfield code="b">C. Beck,</subfield>
			<subfield code="c"><?php echo htmlspecialchars($journal->year->value->value); ?></subfield>
		</datafield>
		
		<datafield tag="300" ind1=" " ind2=" ">
			<subfield code="a">p. <?php echo htmlspecialchars($article->pages->value->realpage); ?>-<?php echo htmlspecialchars($article->pages->value->endpage); ?> :</subfield>
		</datafield>
		
		<datafield tag="504" ind1=" " ind2=" ">
			<subfield code="a">Includes bibliographical footnotes.</subfield>
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
			<subfield code="n">Chiron. Mitteilungen der Kommission für Alte Geschichte und Epigraphik des Deutschen Archäologischen Instituts, <?php echo htmlspecialchars($journal->volume->value->value); ?>.<?php echo htmlspecialchars($journal->year->value->value); ?></subfield>
			<subfield code="m"><?php echo htmlspecialchars($article->title->value->value); ?></subfield>
		</datafield>
	
		
		<?php /* ?>
		<datafield tag="700" ind1="1" ind2=" ">
			<?php foreach ($article->author->value as $author) { ?>
			<subfield code="a"><?php echo $author->lastname ?>, <?php echo $author->firstname ?></subfield>
			<?php } ?>
			<subfield code="e">joint author</subfield>
		</datafield>
		<?php //*/ ?>

		
		
		
	</record>
</collection>