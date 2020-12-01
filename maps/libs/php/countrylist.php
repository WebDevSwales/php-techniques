<?php
    // template for fixing later
    
	$executionStartTime = microtime(true) / 1000;

    $url='http://api.geonames.org/findNearbyPlaceNameJSON?cities=cities1000&lat=' . $_REQUEST['lat'] .'&lng=' . $_REQUEST['lng'] . '&username=Lewis_swales'. '&type=JSON';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "localInfo";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['geonames'][0];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>