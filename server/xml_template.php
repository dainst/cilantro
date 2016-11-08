<?php 
/*
echo "<pre>";
var_dump($data);
echo "</pre>";

//var_dump($journal);
/*
var_dump($articles[0]->pages);
*/
/*//*/
?>
<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<!DOCTYPE issues PUBLIC "-//PKP//OJS Articles and Issues XML//EN" "http://pkp.sfu.ca/ojs/dtds/2.4.8/native.dtd">
<issues>
    <issue identification="<?php echo $journal->identification; ?>" published="true">      
        <volume><?php echo $journal->volume->value->value; ?></volume>
        <year><?php echo $journal->year->value->value; ?></year>
        <section>            
            <title>Articles</title>
            <?php foreach ($articles as $article) { ?>
	            <article>
	                <title><?php echo htmlspecialchars($article->title->value->value); ?></title>
	                <abstract>
	                	<![CDATA[<?php 
	                	echo htmlspecialchars($article->abstract->value->value);
	                	if (isset($article->zenonId) and ($article->zenonId != '(((new)))')) {
	                		echo "<a class='zenonlink' href='http://zenon.dainst.org/Record/{$article->zenonId}' data-meta='dainst_metadata:{$this->return['uploadId']}:zenonId:{$article->zenonId}'>Zenon</a>";
	              	  	} 
	              	  	
	              	  	echo "<br data-meta='dainst_metadata:{$this->return['uploadId']}:find:me' style='display:none'>"; // !important
	              	  	
	              	  	?>]]>
	                </abstract>

	                <?php 
	                	if (!isset($article->author) or (!count($article->author->value))) {
	                		throw new Exception("Article '{$article->title->value->value}' has no author!");
	                	}
	                ?>
	                <?php foreach ($article->author->value as $author) { ?>
		                <author>
		                    <firstname><?php echo htmlspecialchars($author->firstname); ?></firstname>
		                    <lastname><?php echo htmlspecialchars($author->lastname); ?></lastname>
		                    <email>no@email.given</email>
		                </author>
		            <?php } ?>
	                <pages><?php echo htmlspecialchars($article->pages->value->pagedesc); ?></pages>
	                <date_published><?php echo htmlspecialchars($article->date_published->value->value); ?></date_published>
	                <galley>
	                    <label>PDF</label>
	                    <file>
	                        <href src="<?php echo htmlspecialchars($article->filepath); ?>" mime_type="application/pdf" />
	                    </file>
	                </galley>
	            </article>
	    	<?php } ?>
        </section>
    </issue>
</issues>
<?php //*/ ?>