<?php // change these and remove the .default in file name
$settings = array(
	'ojs_path'		=> 	'/var/www/ojs',
	'tmp_path'		=> 	'/var/www/pimport/tmp',
	'log_path'		=> 	'/var/www/pimport/reports',
	'rep_path'		=> 	'/var/www/chiron/data',
	'importer_url'	=> 	'http://DOMAIN/pimport/',
	'ojs_url'		=> 	'http://DOMAIN/ojs/',
	'ojs_user'		=>  'admin',
	'password'		=> 	'password'
);
// backend specific settings (some of the above will be found here in the future)
$settings['ojs2']	= array(
	'db_type'		=> 	'mysql', //or psql
	'host' 			=>	'localhost',
	'username' 		=>	'mysqluser',
	'password' 		=>	'mysqlpassword',
	'db' 			=>	'mysqldb',
    'port'          =>  '5432' // currently used for psql-databases
);
if (isset($_GET['js']) and ($_GET['js'] == 1)) {
?>
window.settings = {
	"rep_url": 		"http://DOMAIN/chiron/data/",
	"server_url": 	"http://DOMAIN/pimport/server/",
	"ojs_url": 		"http://DOMAIN/ojs/",
	"log_url":		"http://DOMAIN/pimport/reports/"
    /* ,"password":     "password"  // your may include your password here for developing purpose" */
}
<?php } ?>
