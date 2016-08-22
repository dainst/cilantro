<pre>
<?php

ini_set ("display_errors", "1");
error_reporting(E_ALL);

$data = array();
require_once('ojsis.php');
$ojsis = new ojsis($data, true);
unset ($ojsis->return['uploadId']);
$ojsis->getDainstMetadata($data);
var_dump($ojsis->return);
?>
</pre>
<hr>
<pre>
<?php 
var_dump($ojsis->debug);

?>
</pre>
