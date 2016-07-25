<?php
$settings = array(
	'ojs_path'		=> 	'/var/www/ojs',
	'tmp_path'		=> 	'/var/www/pimport/tmp',
	'log_path'		=> 	'/var/www/pimport/reports',
	'rep_path'		=> 	'/var/www/chiron/data',
	'password'		=> 	'alpha',
	'mysql_db'		=>	'ojs',
	'mysql_prefix'	=>	'',
	'mysql_password'=>	'pEaS!S%8@Z#%+3GM',
	'mysql_user'	=>	'mysqluser',
	'ojs_url'		=> 	'http://195.37.232.186/ojs/'
);
	
if (isset($_GET['js']) and ($_GET['js'] == 1)) {
?>
window.settings = {
	"rep_url": 		"http://195.37.232.186/chiron/data/",
	"server_url": 	"http://195.37.232.186/pimport/server/",
	"ojs_url": 		"http://195.37.232.186/ojs/",
	"log_url":		"http://195.37.232.186/pimport/reports/"
}
<?php } ?>