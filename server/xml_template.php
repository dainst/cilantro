<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<!DOCTYPE issues PUBLIC "-//PKP//OJS Articles and Issues XML//EN" "http://pkp.sfu.ca/ojs/dtds/2.4.8/native.dtd">
<issues>
    <issue identification="<?php echo $journal->identification; ?>" published="<?php echo ($journal->auto_publish_issue->value->value) ? 'true' : 'false'?>">      
        <volume><?php echo $journal->volume->value->value; ?></volume>
        <year><?php echo $journal->year->value->value; ?></year>
        <section>            
            <title locale="en_US">Articles</title>
            <?php foreach ($articles as $article) { ?>
            	<?php $locale = (isset($article->language) && $article->language->value->value) ? 'language="' . substr($article->language->value->value, 0, 2) . '" locale="' . $article->language->value->value . '"' : '' ?>
				<article <?php echo $locale ?>>
	                <title><?php echo htmlspecialchars($article->title->value->value); ?></title>
	                <?php //<abstract></abstract> ?>
					<?php //@ TODO $article->zenonId as other::zenon -> in OJS3 ?>
					<?php if (isset($article->zenonId) and $article->zenonId) { ?>
						<id type="other::zenon"><?php echo $article->zenonId ?></id>
	                <?php } ?>
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
	                <date_published><?php htmlspecialchars($article->date_published->value->value); ?></date_published>
	                <?php if ($article->auto_publish->value->value) { /* @ TODO auto_publish to be implemented */ } ?>
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