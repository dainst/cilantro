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
$includePath	= '..';



// helping functions
/**
 * 	Returns a file size limit in bytes based on the PHP upload_max_filesize and post_max_size
 *
 * stolen from drupal / http://stackoverflow.com/questions/13076480/php-get-actual-maximum-upload-size#25370978
 * @return int
 */

function file_upload_max_size() {
	static $max_size = -1;

	if ($max_size < 0) {
		// Start with post_max_size.
		$max_size = parse_size(ini_get('post_max_size'));

		// If upload_max_size is less, then reduce. Except if upload_max_size is
		// zero, which indicates no limit.
		$upload_max = parse_size(ini_get('upload_max_filesize'));
		if ($upload_max > 0 && $upload_max < $max_size) {
			$max_size = $upload_max;
		}
	}
	return $max_size;
}

function parse_size($size) {
	$unit = preg_replace('/[^bkmgtpezy]/i', '', $size); // Remove the non-unit characters from the size.
	$size = preg_replace('/[^0-9\.]/', '', $size); // Remove the non-numeric characters from the size.
	if ($unit) {
		// Find the position of the unit in the ordered string which is the power of magnitude to multiply a kilobyte by.
		return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
	}
	else {
		return round($size);
	}
}


/**
 * go
 *
*/
try {

	// settings
	$allowedIps		= array();
	$errorReporting = true;
	$includePath = (!isset($includePath)) ? dirname(dirname($_SERVER['SCRIPT_FILENAME'])) . '/' : $includePath;
	if (file_exists($includePath . '/' . "settings.php")) {
		include_once($includePath . '/' . "settings.php");
	} else {
		throw new Exception("No settings File!" . $includePath);
	}

	// set up error reporting
	if ($errorReporting) {
		error_reporting(E_ALL);
		ini_set('display_errors', 'on');
	}  else {
		ini_set ("display_errors", "0");
		error_reporting(false);
	}

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

	// check if request is too big
	$maxUploadSize = file_upload_max_size();
	if ($_SERVER['CONTENT_LENGTH'] > $maxUploadSize) {
		throw new Exception("Request exceeds maximum byte limit of $maxUploadSize with {$_SERVER['CONTENT_LENGTH']} bytes!");
	}

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

	$ojsis = new ojsis($data, $logger, $settings);
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