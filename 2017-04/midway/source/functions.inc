<?php

function remove_when_contains($array, $string) {
  $return = [];
  foreach ($array as $key) {
    if (strpos($key, $string) === FALSE) {
      $return[] = $key;
    }
  }
  return($return);
}

function get_domain_names($value) {

  if (is_array($value)) {
    $return = [];
    foreach ($value as $key) {
      $parse = parse_url($key);
      $return[] = know_host($parse['host']);
    }
  } else {
    $parse = parse_url($value);
    $return = know_host($parse['host']);
  }

  return($return);
}

function know_host($string) {
  if ($string == 't.co') $string = 'twitter.com';
  if (strpos($string, 'www.google') !== FALSE) $string = 'www.google.com';
  if (strpos($string, 'facebook.com') !== FALSE) $string = 'facebook.com';
  return $string;
}

?>
