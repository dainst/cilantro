<pre>
<?php

ini_set ("display_errors", "1");
error_reporting(E_ALL);

$data = (object) array('journal' => (object) array("journal_code" => 'chiron'));

require_once('ojsis.php');
$ojsis = new ojsis($data, true);

$ojsis->getJournal($data);
$journal = $ojsis->getJournalObject();

$front = $journal->createFrontPage($article, $data->journal);
echo $front;

var_dump($ojsis->return);
?>
</pre>
<hr>
<pre>
<?php 
var_dump($ojsis->debug);

?>
</pre>
