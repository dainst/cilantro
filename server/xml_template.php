<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<!DOCTYPE issues PUBLIC "-//PKP//OJS Articles and Issues XML//EN" "http://pkp.sfu.ca/ojs/dtds/2.4.8/native.dtd">
<issues>
    <issue identification="<?php echo $journal->identification; ?>" published="<?php echo ($journal->auto_publish_issue) ? 'true' : 'false'?>">
        <volume><?php echo $journal->volume; ?></volume>
        <year><?php echo $journal->year; ?></year>
        <section>            
            <title locale="en_US">Articles</title>
            <?php foreach ($articles as $article) { ?>
            	<?php $locale = (isset($article->language) && $article->language) ? 'language="' . substr($article->language, 0, 2) . '" locale="' . $article->language . '"' : '' ?>
				<article <?php echo $locale ?>>
	                
	                <title><?php echo htmlspecialchars($article->title); ?></title>
	                
	                <?php //<abstract></abstract> ?>
					
					<?php 
						$zenonId  = (isset($article->zenonId) and $article->zenonId and ($article->zenonId != '(((new)))')) ? $article->zenonId : '';
						if ($zenonId) {
					?>
						<id type="other::zenon"><?php echo $zenonId ?></id>
					<?php } ?>
	                
	                <?php 
	                	if (!isset($article->author) or (!count($article->author))) {
	                		throw new Exception("Article '{$article->title}' has no author!");
	                	}
	                ?>
	                <?php foreach ($article->author as $author) { ?>
		                <author>
		                    <firstname><?php echo htmlspecialchars($author->firstname); ?></firstname>
		                    <lastname><?php echo htmlspecialchars($author->lastname); ?></lastname>
		                    <email>no@email.given</email>
		                </author>
		            <?php } ?>

					<?php 	// we abuse the page id to send a marker, that a front matter is missing...
					$pages = htmlspecialchars($article->pages->showndesc);
						$pages .= ($article->createFrontpage) ? '#DFM' : '';
					?>
	                <pages><?php echo $pages; ?></pages>


					<date_published><?php htmlspecialchars($article->date_published); ?></date_published>
	                <?php if ($article->auto_publish) { /* @ TODO auto_publish to be implemented */ } ?>
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
