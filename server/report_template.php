<?php echo '<?xml version="1.0" encoding="UTF-8"?>', "\n"; ?>
<report>
<?php foreach ($this->return['dainstMetadata'] as $articleID => $meta) { ?>
	<url><?php echo $this->settings['ojs_url']; ?>/index.php/<?php echo $data->journal->ojs_journal_code; ?>/article/view/<?php echo $articleID; ?></url>
	<zenonid><?php echo (isset($meta['zenonId']) and $meta['zenonId']) ? $meta['zenonId']  : ''; ?></zenonid>
<?php } ?>
</report>

