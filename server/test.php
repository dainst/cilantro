<pre>
<?php

ini_set ("display_errors", "1");
error_reporting(E_ALL);

$data = array();
require_once 'logger.class.php';
require_once('ojsis.php');
$logger = new logger(true);
$ojsis = new ojsis($data, $logger);



$ojsis->getDainstMetadata();
$ojsis->updateDainstMetadata();

var_dump($ojsis->return);


?>
</pre>
<hr>
<pre>
<?php 
var_dump($ojsis->debuglog);

?>
</pre>
