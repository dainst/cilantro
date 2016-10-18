<?php
/**
 *
* OJS Importer - Remote Server
*
* @version 12
*
* @year 2016
*
* @author Philipp Franck
*
* @desc
* This is a very simple PHP script to create simple remote Servers in PHP
*
*
*
*/

// settings
$allowedIps		= array();
$debugmode 		= false;


// set up errors
if ($debugmode) {
	error_reporting(E_ALL);
	ini_set('display_errors', 'on');
}  else {
	ini_set ("display_errors", "0");
	error_reporting(false);
}


/**
 * go
 *
*/
try {
	
	
	// get logger
	require_once('logger.class.php');
	$logger = new logger($debugmode);

	// enabling CORS (would be a shameful webservice without)
	if (isset($_SERVER['HTTP_ORIGIN'])) {
		header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
		header('Access-Control-Allow-Credentials: true');
		header('Access-Control-Max-Age: 86400');    // cache for 1 day
	}
	
	// Access-Control headers are received during OPTIONS request
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
			header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
		}
		if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
			header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
		}
		exit(0);
	}
	
	// low budget security check
	$ip	= $_SERVER['REMOTE_ADDR'];
	if (!in_array($ip, $allowedIps) and count($allowedIps)) {
		throw new Exception("Not allowed, Mr. $ip!");
	}

	// also get angular's post data (there is something shitty going on between angular and php)
	$_ANGULAR_POST = json_decode(file_get_contents("php://input"));
	
	if (!isset($_ANGULAR_POST->task)) {
		throw new Exception('No task defined' . print_r($_ANGULAR_POST));
	}
	$task = $_ANGULAR_POST->task;
	$data = $_ANGULAR_POST->data;

	// go
	require_once('ojsis.php');

	$ojsis = new ojsis($data, $logger);
	$ojsis->debug = $debugmode;
	$ojsis->$task();
	
	$return = $ojsis->return;
	
	$ojsis->finish();

} catch (Exception $a) {
	ob_clean();
	$ojsis->finish();

	$debug = (isset($ojsis) and isset($ojsis->debug) and $debugmode) ? $ojsis->debuglog : '';
	
	$return = array(
		'success'	=> false,
		'message'	=> $a->getMessage(),
		'warnings'	=> $logger->warnings
	);
	if ($debugmode) {
		$return['debug'] = $logger->log;
	}	
	
	header('Content-Type: application/json');
	echo json_encode($return);
	die();
}

$logger->log('OK');


// return  success
$return['task'] = $task;
$return['success'] = true;
$return['warnings'] = $logger->warnings;
if ($debugmode) {
	$return['debug'] = $logger->log;
}

header('Content-Type: application/json');
echo json_encode($return);
?>