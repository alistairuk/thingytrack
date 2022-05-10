<?PHP

/* Configuration values */

define('API_KEY', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define('DEVICE_ID', 'nrf-xxxxxxxxxxxxxxx');

/* Prevent the output from being cached */

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

/* Request the last location from the NRFCloud API */

$opts = array('http' =>
	array(
		'method'  => 'GET',
		'header'  => 'Authorization: Bearer ' . API_KEY
	)
);

$cxContext  = stream_context_create($opts);

$thePage = file_get_contents( 'https://api.nrfcloud.com/v1/location/history?pageLimit=1&deviceId=' . DEVICE_ID, False, $cxContext );

/* Decode the result returned by the API */

$theData = json_decode($thePage);
$theRecord = $theData->items[0];

/* Build and return a JSON object with the required data */

$uncertainty = is_numeric($theRecord->uncertainty) ? $theRecord->uncertainty : 1;

$theResult = array(	'lat' => $theRecord->lat,
					'lon' => $theRecord->lon,
					'uncertainty' => $uncertainty );

echo json_encode($theResult);

?>
