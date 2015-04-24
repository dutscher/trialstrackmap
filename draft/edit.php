<?php

    $jsonFile = 'dist/times.json';

    $postdata = file_get_contents('php://input');
    $updates = json_decode($postdata,true);

    $jsonString = file_get_contents($jsonFile);
    $timesDB = json_decode($jsonString,true);

    function getFoundKey($timesDB, $trackId){
        $foundKey = -1;
        foreach($timesDB['times'] as $key => $track) {
            if ($trackId == $track['id']) {
                $foundKey = $key;
            }
        }
        return $foundKey;
    }

    foreach($updates['times'] as $update){
        $trackId = $update['id'];
        $key = getFoundKey($timesDB, $trackId);

        // new
        if($key == -1){
            array_push($timesDB['times'],$update);
            // exists
        } else if($key >= 0) {
            // update
            $timesDB['times'][$key] = $update;
        }
    }

    $newJsonString = json_encode($timesDB);

    file_put_contents($jsonFile, $newJsonString);

    header('Content-Type: application/json');
    echo '{"OK":"update solved"}';

?>