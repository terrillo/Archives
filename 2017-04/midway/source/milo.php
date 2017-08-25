<?php

$m = new MongoClient("mongodb://milo:Toca1991@ds111851.mlab.com:11851/milo");
$midway = $m->milo;

# Check
if (isset($_POST['type'])) {
  $_POST['date'] = date('Ymd');
  $m->milo->insert($_POST);
}
