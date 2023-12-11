<?php

// $contents = file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . 'input.sample.txt');
$contents = file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . 'input.txt');

$contents = array_filter(explode("\n", $contents));

$points = 0;

foreach ($contents as $line) {    
    // $line = 'Card  12: 85 46 97 69 87 33 47 92 80 54 | 66 78  7  6  9 87 73 29 81 93  4 97 24 14 13 31 52 74 79 28 18 83 51 10 61';

    list($cardNum, $cardContents) = explode(':', $line);
    list(, $cardNum) = explode(' ', $cardNum);
    $cardNum = intval($cardNum);
    list($winning, $card) = explode('|', $cardContents);

    $winning = array_map('intval', array_filter(explode(' ', $winning)));
    $card = array_map('intval', array_filter(explode(' ', $card)));

    $cardWinning = array_filter($card, function($v) {
        global $winning;
        return in_array($v, $winning, true);
    });

    if (count($cardWinning)) {
        $points += 1 << (count($cardWinning) - 1);
    }
}

print($points);