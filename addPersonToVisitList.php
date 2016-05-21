<?php
$file = 'people.txt';
$current = file_get_contents($file);
$current .= $_POST['name']." ".$_POST['surname']." ".date('Y m d')."\n";
file_put_contents($file, $current);
echo $_POST['name'];
?>