<?php

// $inputFilePath = __DIR__ . DIRECTORY_SEPARATOR . 'input.sample.txt';
$inputFilePath = __DIR__ . DIRECTORY_SEPARATOR . 'input.txt';

$lines = file($inputFilePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

$points = 0; // result for part 1
$ownCards = []; // results for part 2

foreach ($lines as $line) {    
    // $line = 'Card  12: 85 46 97 69 87 33 47 92 80 54 | 66 78  7  6  9 87 73 29 81 93  4 97 24 14 13 31 52 74 79 28 18 83 51 10 61';

    list($cardNum, $cardContents) = array_filter(explode(':', $line));
    list(, $cardNum) = preg_split("/[\s]+/", $cardNum); // 'Card  12' → '12'
    $cardNum = intval($cardNum);
    list($winning, $card) = explode('|', $cardContents);

    $winning = array_map('intval', array_filter(explode(' ', $winning)));
    $card = array_map('intval', array_filter(explode(' ', $card)));

    $winningNumbers = array_filter($card, function($v) {
        global $winning;
        return in_array($v, $winning, true);
    });

    if (isset($ownCards[$cardNum])) {
        $ownCards[$cardNum] += 1;
    } else {
        $ownCards[$cardNum] = 1;
    }

    if (count($winningNumbers)) {

        $points += 1 << (count($winningNumbers) - 1); // part 1

        // Part 2:
        $multiplier = $ownCards[$cardNum];

        $wonCopies = range($cardNum + 1, $cardNum + count($winningNumbers));
        // print_r( $cardNum . ': ' . implode(', ', $wonCopies) . PHP_EOL );

        foreach ($wonCopies as $copy) {
            if (isset($ownCards[$copy])) {
                $ownCards[$copy] += $multiplier;
            } else {
                $ownCards[$copy] = $multiplier;
            }
        }

    }
}

printf("Part1: %d\n", $points);

printf(
    "Part2: %d\n", 
    array_sum(array_values($ownCards))
);
