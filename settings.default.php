<?php // change theese and remove the .default in file name
$settings = array(
	'ojs_path'		=> 	'/var/www/ojs',
	'tmp_path'		=> 	'/var/www/pimport/tmp',
	'log_path'		=> 	'/var/www/pimport/reports',
	'rep_path'		=> 	'/var/www/chiron/data',
	'ojs_url'		=> 	'http://DOMAIN/ojs/',
	'urn_base'		=>  'urn:nbn:de:0048-journals-%d-%d',
		
	'password'		=> 	'alpha',
		
	'mysql_db'		=>	'ojs',
	'mysql_prefix'	=>	'',
	'mysql_password'=>	'',
	'mysql_user'	=>	'mysqluser',
	
	'psql_db'		=>	'ojspg',
	'psql_prefix'	=>	'',
	'psql_password'	=>	'',
	'psql_user'		=>	'',
	'psql_port'		=>	'5432',
	'psql_host'		=>	'localhost',
		
	'use_psql'		=>	true,

	'ojs_user'		=>  'admin'
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