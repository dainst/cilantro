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

	register_shutdown_function(function()  {
		$error = error_get_last();
		//check if it's a core/fatal error, otherwise it's a normal shutdown
		if ($error !== NULL && in_array($error['type'], array(E_ERROR, E_PARSE, E_CORE_ERROR, E_CORE_WARNING, E_COMPILE_ERROR, E_COMPILE_WARNING))) {
				$return = array(
					'success'	=> false,
					'message'	=> "500 / Internal Server Error" . ": {$error['message']} in line {$error['line']} of {$error['file']}"
				);
	
				http_response_code(200);
				header('Content-Type: application/json');
				echo json_encode($return);
			}
	});
	
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
	
	$task = isset($_ANGULAR_POST->task) ? $_ANGULAR_POST->task : (isset($_POST['task']) ? $_POST['task'] : '');
	if (!isset($task)) {
		$log->log($_ANGULAR_POST);
		$log->log($_POST);
		throw new Exception('No task defined');
	}
	$data = isset($_ANGULAR_POST->data) ? $_ANGULAR_POST->data : (object) $_POST['data'];

	// go
	require_once('ojsis.php');

	$ojsis = new ojsis($data, $logger);
	$ojsis->debug = $debugmode;
	$ojsis->call($task);
	
	$return = $ojsis->return;
	
	$ojsis->finish();

} catch (Exception $a) {
	ob_clean();
	if (isset($ojsis)) {
		$ojsis->finish();
	}
	
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