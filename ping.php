<?php

array_shift($argv);

$fp = fsockopen("udp://0.0.0.0", 4000, $errno, $errstr);
var_dump(json_encode($argv));
fwrite($fp, json_encode($argv));
fclose($fp);


// select userid, avatarattachmentid, latitude, longitude from user inner join userlogin using (userid) inner join userloginlocation using (locationid) where timestamp > 1310091439 - (3600) and locationid != 1 and avatarattachmentid != 0;
