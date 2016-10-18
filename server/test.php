<pre>
<?php

ini_set ("display_errors", "1");
error_reporting(E_ALL);

$data = (object) array('journal' => (object) array("journal_code" => 'chiron'), 'uploadId' => '59e4d217d0d19ffcbb24a240a938e7a2');

require_once('ojsis.php');
$ojsis = new ojsis($data, true, true);

$ojsis->ojsUnlock();


/*
$ojsis->getDainstMetadata();
$ojsis->checkUpload();
*/
var_dump($ojsis->return);
/*

$ojsis->getJournal($data);
$journal = $ojsis->getJournalObject();

$front = $journal->createFrontPage($article, $data->journal);
echo $front;

var_dump($ojsis->return);*/
/*
require_once('ojs_database.class.php');

include('../settings.php');

$db = new ojs_database($settings);
*/
/*
var_dump($db->lock());

$db->query("insert into notifications values ('4', '5', '0', '2', '268435477', '2016-08-23 11:49:49', NULL, '0', '0')");

sleep(60);

var_dump($db->unlock());
*/
/*
$db->query("lock table notifications in ROW EXCLUSIVE mode");
$db->query("insert into notifications values ('10', '5', '0', '2', '268435477', '2016-08-23 11:49:49', NULL, '0', '0'");
sleep(60);
$db->query("unlock tables");
*/

?>
</pre>
<hr>
<pre>
<?php 
var_dump($ojsis->debuglog);

?>
</pre>
