<?php
$settings = array(
	'ojs_path' => 	'/var/www/ojs',
	'tmp_path' => 	'/var/www/pimport/tmp',
	'rep_path' => 	'/var/www/chiron/data',
	'password' => 	'###'
);

if (isset($_GET['js']) and ($_GET['js'] == 1)) {
?>
window.settings = {
	"rep_url": 		"http://195.37.232.186/chiron/data/",
	"server_url": 	"http://195.37.232.186/pimport/server/"
}
<?php } ?>