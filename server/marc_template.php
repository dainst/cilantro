<?php 
if (!isset($article->author) or (!count($article->author->value))) {
	throw new Exception("Article '{$article->title->value->value}' has no author!");
}
$author_list = [];
foreach ($article->author->value as $author) {
	$author_list[] = "{$author->lastname}, {$author->firstname}";
}
$author_list = implode('; ', $author_list);

?>
<?php echo '<?xml version="1.0" encoding="UTF-8"?>', "\n"; ?>
<?php echo '<collection xmlns="http://www.loc.gov/MARC21/slim">', "\n" ?>
	<record>

		<datafield tag="100" ind1="1" ind2=" ">
	    	<subfield code="a"><?php echo $data->article->author->value[0]->firstname; ?>, <?php echo $data->article->author->value[0]->lastname; ?></subfield>
		</datafield>
		
		<datafield tag="245" ind1="1" ind2="0">
			<subfield code="a"><?php echo $article->title->value->value; ?></subfield>
			<subfield code="b"></subfield>
			<subfield code="c"><?php echo $author_list; ?></subfield>
		</datafield>
		
		<datafield tag="260" ind1=" " ind2=" ">
			<subfield code="a">München :</subfield>
			<subfield code="b">C. Beck,</subfield>
			<subfield code="c"><?php echo $journal->year->value->value; ?>.</subfield>
		</datafield>
		
		<datafield tag="300" ind1=" " ind2=" ">
			<subfield code="a">p. <?php echo $article->pages->value->realpage; ?>-<?php echo $article->pages->value->endpage; ?> :</subfield>
		</datafield>
		
		<datafield tag="504" ind1=" " ind2=" ">
			<subfield code="a">Includes bibliographical footnotes.</subfield>
		</datafield>
	
		<datafield tag="700" ind1="1" ind2=" ">
			<?php foreach ($article->author->value as $author) { ?>
			<subfield code="a"><?php echo $author->lastname ?>, <?php echo $author->firstname ?></subfield>
			<?php } ?>
			<subfield code="e">joint author</subfield>
		</datafield>
		
		<datafield tag="773" ind1="0" ind2="8">
			<subfield code="a">Chiron</subfield>
			<subfield code="b">Bd. <?php echo $journal->volume->value->value; ?>.<?php echo $journal->year->value->value; ?></subfield>
		</datafield>
		
	</record>
</collection>