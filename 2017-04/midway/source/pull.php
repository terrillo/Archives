<?php
#CB b9e7ab47-31c0-4e62-bc03-77e65746183c

require_once 'app.inc';
require_once 'functions.inc';

$respone = [];

if (!isset($_GET['api_key'])) {
  $respone['error'] = array(
    'message' => 'No "api key" found',
    'target' => 'api_key',
  );
  echo json_encode($respone);
  return false;
}

if (!isset($_GET['method'])) {
  $respone['error'] = array(
    'message' => 'No "method" found',
    'target' => 'method',
  );
  echo json_encode($respone);
  return false;
}

if (!isset($_GET['type'])) {
  $respone['error'] = array(
    'message' => 'No "type" found',
    'target' => 'type',
  );
  echo json_encode($respone);
  return false;
}

$this_client = array(
  'domain' => 'www.cliniciansbrief.com'
);

$api_key = $_GET['api_key'];
$method = $_GET['method'];
$type = $_GET['type'];

if ($method == 'referrers') {
  $field = 'document_referrer';
}

if ($method == 'pages') {
  $field = 'document_title';
}

if (!isset($field)) {
  $respone['error'] = array(
    'message' => 'Wrong method type',
    'target' => 'method',
  );
  echo json_encode($respone);
  return false;
}

if ($method == 'referrers' || $method == 'pages') {
  $find = array('api_key' => $api_key, $field => array('$exists' => true));
  if (isset($_GET['range'])) {
    $find = array('api_key' => $api_key, 'day' => array('$eq' => $_GET['range']));
  }
  $query = $midway->events->find($find)
      ->fields(array($field => true));

  $respone['Count'] = $query->count();

  $urls = array();
  foreach ($query as $q) {
    $urls[] = $q[$field];
  }

  if ($method == 'referrers') {
    $urls = remove_when_contains($urls, $this_client['domain']); # Remove HOST Domain
    $urls = get_domain_names($urls); # Get Domain Names
  }

  $urls = array_count_values($urls);
  asort($urls);
  $urls = array_reverse($urls);

  if (isset($_GET['limit'])) {
    $urls = array_slice($urls, 0, $_GET['limit']);
  }

  $respone['Data'] = $urls;

}

// # Referrers
// if ($method == 'referrers') {
//   $query = $midway->events->find(array('api_key' => $api_key))
//     ->fields(array('document_url' => true));
//
//   $query = iterator_to_array($query);
//   $urls = array();
//   foreach ($query as $q) {
//     $urls[] = $q['document_url'];
//   }
//
//   $urls = remove_when_contains($urls, $this_client['domain']); # Remove Domain
//   $urls = get_domain_names($urls); # Get Domain Names
//   $respone['Count'] = count($urls);
//
//   if ($type == 'list') {
//     $query = array_count_values($query);
//     asort($query);
//     $query = array_reverse($query);
//     if (isset($_GET['limit'])) {
//       $query = array_slice($query, 0, $_GET['limit']);
//     }
//     $respone['Data'] = $query;
//   }
// }
//
// # Pages
// if ($method == 'pages') {
//   $query = $midway->events->find(array('api_key' => $api_key))
//     ->fields(array('document_url' => true))
//     ->limit(2000);
//
//   $respone['Count'] = $midway->events->find(array('api_key' => $api_key, 'value' => '$pageview'))->count();
//
//   $query = iterator_to_array($query);
//   $urls = array();
//   foreach ($query as $q) {
//     $urls[] = $q['document_url'];
//   }
//
//   $urls = array_count_values($urls);
//   asort($urls);
//   $urls = array_reverse($urls);
//   if (isset($_GET['limit'])) {
//     $urls = array_slice($urls, 0, $_GET['limit']);
//   }
//   $respone['Data'] = $urls;
// }

echo json_encode($respone);
