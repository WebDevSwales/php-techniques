<?php

	$executionStartTime = microtime(true) / 1000;

    $url='http://api.weatherapi.com/v1/current.json?key=6c98f55208b1408ea0d155919202911' . '&q=' . $_REQUEST['town'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "weatherInfo";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['current'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>