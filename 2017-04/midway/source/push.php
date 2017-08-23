<?php

require_once 'app.inc';

# Check
if (!isset($_POST['api_key'])) return false;

# Request
$request = $_POST;

# IP
if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
  $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
  $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
  $ip = $_SERVER['REMOTE_ADDR'];
}
$ip_data = array();
$ip_data['ip'] = $ip;
$ip_count = $ipKIT->find(array('ip' => $ip))->count();
if ($ip_count == 0) {
  echo 'NEW';
  $ip_info = file_get_contents('http://api.db-ip.com/v2/ef47847f7549742817a00053d141c73706a279ac');
  $ip_info_status = json_decode($ip_info, true);
  if ($ip_info_status['queriesLeft'] > 0) {
    $ip_info = file_get_contents('http://api.db-ip.com/v2/ef47847f7549742817a00053d141c73706a279ac/'.$ip);
    $ip_info_data = json_decode($ip_info, true);
    $ip_data['country'] = @$ip_info_data['countryName'];
    $ip_data['state'] = @$ip_info_data['stateProv'];
    $ip_data['city'] = @$ip_info_data['city'];
    $ipKIT->insert($ip_data);
  }
} else {
  echo 'OLD';
  $ip_data_block = array_values($ip_data);
  $ip_data['country'] = @$ip_data_block[1];
  $ip_data['state'] = @$ip_data_block[2];
  $ip_data['city'] = @$ip_data_block[3];
}

# Merge Data
$request = array_merge($request, $ip_data);
$request['stamp'] = new MongoDate();
$request['day'] = date('Ymd');
$request['hour'] = date('G');

# Insert Data
$midway->events->insert($request);
