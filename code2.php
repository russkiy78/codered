<?php
/**
 * Created by JetBrains PhpStorm.
 * User: russkiy
 * Date: 13.01.15
 * Time: 13:28
 * To change this template use File | Settings | File Templates.
 */

function array_zip_merge() {
    $output = array();
    // The loop incrementer takes each array out of the loop as it gets emptied by array_shift().
    for ($args = func_get_args(); count($args); $args = array_filter($args)) {
        // &$arg allows array_shift() to change the original.
        foreach ($args as &$arg) {
            $output[] = array_shift($arg);
        }
    }
    return $output;
}

define('VECTOR_LEN', 200);
define('VECTOR_MAX_ELEMENT', 1000);
define('VECTOR_MIN_ELEMENT', 1);


define('KEY_MAX_LEN_EVEN', 6);
define('KEY_MAX_LEN_ODD', 6);

$send_str="s";

$send='';

for ($i = 0; $i < strlen($send_str); $i++) {
    $send.=str_pad(base_convert(ord(substr($send_str,$i,1)) , 10, 2), 8, "0", STR_PAD_LEFT);
}
echo   "\n bit  = ". $send ;
echo   "\n bit send = ".strlen($send);


//exit;
// main idea is using growing consistency!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// in this case the sum of the first half of digits will always less then second one


$vector = array();
$vector_even = array();
$vector_odd= array();
$sum = 0;

for ($i = 0; $i < VECTOR_LEN; $i++) {
    if ($i % 2 == 0) {
        do {
            $rand = rand(VECTOR_MIN_ELEMENT, VECTOR_MAX_ELEMENT);

        } while ($rand % 2 == 0);
        $vector[$i] = $rand;
        array_push($vector_odd,$rand);
        $sum += $rand;
    } else {
        do {
            $rand = rand(VECTOR_MIN_ELEMENT, VECTOR_MAX_ELEMENT);
        } while ($rand % 2 > 0);
        $vector[$i] = $rand;
        array_push($vector_even,$rand);
        $sum += $rand;
    }
}
sort($vector_even);
sort($vector_odd);

$vector = array_zip_merge($vector_odd, $vector_even);

echo "\nsecret vector\n";


array_walk($vector, function ($i,$key) {echo $i." "; if ($key % 2) { echo "\n"; }; } );

echo "\n sum = " . $sum . "\n";

$q = intval(gmp_strval(gmp_nextprime($sum)));
do {
    $r = rand(1, $q);
} while($r % 2 > 0);

echo "\n q = {$q} \n";
echo "\n r = {$r} \n";

$res=0;
$counter=0;
while ($res <> 1) {
    $counter++;
    $res=($r*$counter) % $q;
}

$rev=$counter;
echo "\n rev=".$rev."\n";

/*
 * Чётное ± Чётное = Чётное
 * Чётное ± Нечётное = Нечётное
 * Нечётное ± Нечётное = Чётное
  * */

// generate open key!

$open=array();

for ($i = 0; $i < VECTOR_LEN; $i++) {
    $open[$i] =($r*$vector[$i]) % $q;
}

echo "\nopen vector\n";
//print_r($open);
array_walk($open, function ($i,$key) {echo $i." "; if ($key % 2) { echo "\n"; }; } );

exit;

$encode =array();

for ($i = 0; $i < strlen($send); $i++) {
    $t_char=intval(substr($send,$i,1));
    // circle
    $t_sum=0;
    if ($t_char) {
        // odd
        $odd_rand=rand(1,KEY_MAX_LEN_ODD);
        $odd_rand=($odd_rand %2 ==0 ? $odd_rand-1  : $odd_rand);
        $even_rand=rand(1,KEY_MAX_LEN_EVEN);
        //  echo "\nodd: odd $odd_rand even  $even_rand ";


        for ($j = 0; $j < $odd_rand; $j++) {
            $t_rand=rand(0,(count($open)-1)/2);
            $t_sum+=$open[$t_rand*2];
            //    echo "\nodd: odd: ".($t_rand*2)." ";
        }

        for ($j = 0; $j < $even_rand; $j++) {
            $t_rand=rand(0,(count($open)-1)/2);
            $t_sum+=$open[$t_rand*2+1];
            //     echo "\nodd: even: ".($t_rand*2+1)." ";
        }

        //  echo "\n odd sum= {$t_sum}";

        array_push($encode,$t_sum);

    } else {
        //even
        $odd_rand=rand(1,KEY_MAX_LEN_ODD);
        $odd_rand=($odd_rand %2 ==0 ? $odd_rand  : $odd_rand-1);
        $even_rand=rand(1,KEY_MAX_LEN_EVEN);
        // echo "\neven: odd $odd_rand even  $even_rand ";

        for ($j = 0; $j < $odd_rand; $j++) {
            $t_rand=rand(0,(count($open)-1)/2);
            $t_sum+=$open[$t_rand*2];
            // echo "\neven: odd: ".($t_rand*2)." ";
        }

        for ($j = 0; $j < $even_rand; $j++) {
            $t_rand=rand(0,(count($open)-1)/2);
            $t_sum+=$open[$t_rand*2+1];
            //   echo "\neven: even: ".($t_rand*2+1)." ";
        }

        //  echo "\n even sum= {$t_sum}";

        array_push($encode,$t_sum);

    }

}
echo "\nencode vector\n";
print_r($encode);

$bitcount_encode=0;
for ($i = 0; $i < count($encode); $i++) {
    $bitcount_encode+=strlen(base_convert( $encode[$i] , 10, 2));
}
echo   "\n bit send=".strlen($send);
echo "\nencode vector len= {$bitcount_encode} \n";
echo   "\n bit  encode/send = ".$bitcount_encode/strlen($send);


//decode
$decoded=array();
$received='';

for ($i = 0; $i < count($encode); $i++) {
    $decoded[$i]=$encode[$i]*$rev % $q;
    $received.=($decoded[$i] % 2 ==0 ? 0 : 1);
}

echo "\n";
echo "\n send     $send \n";
echo "\n receive  $received \n";

$receive_str='';

for ($i = 0; $i < strlen($received); $i=$i+8) {
    $receive_str.=chr(base_convert(substr($received,$i,8),2,10));

}

echo "\n receive string -=$receive_str=- \n";


