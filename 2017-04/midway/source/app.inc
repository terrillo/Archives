<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('America/Chicago');

$m = new MongoClient("mongodb://midway:Toca1991@ds161580.mlab.com:61580/midway");
$midway = $m->midway;

$m2 = new MongoClient("mongodb://ipkit:Toca1991@ds161630.mlab.com:61630/ipkit");
$ipKIT = $m2->ipkit->log;
