<?php // change theese and remove the .default in file name
$settings = array(
	'ojs_path'		=> 	'/var/www/ojs',
	'tmp_path'		=> 	'/var/www/pimport/tmp',
	'log_path'		=> 	'/var/www/pimport/reports',
	'rep_path'		=> 	'/var/www/chiron/data',
	'ojs_url'		=> 	'http://DOMAIN/ojs/',
	'ojs_user'		=>  'admin',
	'password'		=> 	'alpha'
);
	
if (isset($_GET['js']) and ($_GET['js'] == 1)) {
?>
window.settings = {
	"rep_url": 		"http://DOMAIN/chiron/data/",
	"server_url": 	"http://DOMAIN/pimport/server/",
	"ojs_url": 		"http://DOMAIN/ojs/",
	"log_url":		"http://DOMAIN/pimport/reports/"
}
<?php } ?>