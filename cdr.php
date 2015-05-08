<?php
/**
 * Created by PhpStorm.
 * User: russkiy
 * Date: 04.05.15
 * Time: 13:12
 */

define('VECTOR_LEN', 100);
define('VECTOR_MAX_ELEMENT', 500);
define('VECTOR_MIN_ELEMENT', 2);

define('CYCLES', 20);
define('MAX_PRIME', 100);

define('PLUS_MINUS_COUNT', 10);


//$invert = gmp_invert("10", "17");
//echo gmp_strval($invert) . "\n";



$matrix = array();
$open=array();

$q=array();
$r=array();
$invert=array();

$matrix_odd = array();
$matrix_even = array();

for ($i = 0; $i < VECTOR_LEN / 2; $i++) {
    $random = rand(1, 100);
    while (in_array($random, $matrix_odd) || $random % 2 == 0) $random = rand(VECTOR_MIN_ELEMENT, VECTOR_MAX_ELEMENT);
    $matrix_odd[] = $random;
}


for ($i = 0; $i < VECTOR_LEN / 2; $i++) {
    $random = rand(1, 100);
    while (in_array($random, $matrix_even) || $random % 2 > 0) $random = rand(VECTOR_MIN_ELEMENT, VECTOR_MAX_ELEMENT);
    $matrix_even[] = $random;
}

for ($i = 0; $i < VECTOR_LEN; $i++) {
    $matrix[] = ($i % 2 ? array_shift($matrix_odd) : array_shift($matrix_even));
}


//print_r($matrix);

// find prime
$max=max($matrix);
$trys=rand(1,MAX_PRIME);
$q[0]=$max;
for ($i = 0; $i < $trys; $i++) {
    $q[0] = gmp_intval(gmp_nextprime($q[0]));
}
$r[0] = rand(2, $q[0]);
$invert[0] = gmp_intval(gmp_invert($r[0], $q[0]));

for ($i = 0; $i < VECTOR_LEN; $i++) {
    $open[$i] =($r[0]*$matrix[$i]) % $q[0];
}



for ($i = 1; $i <= CYCLES; $i++) {

    $max=max($open);
    $trys=rand(1,MAX_PRIME);
    $q[$i]=$max;
    for ($j = 0; $j < $trys; $j++) {
        $q[$i] = gmp_intval(gmp_nextprime($q[$i]));
    }
    $r[$i] = rand(2, $q[$i]);
    $invert[$i] = gmp_intval(gmp_invert($r[$i], $q[$i]));

    for ($j = 0; $j < VECTOR_LEN; $j++) {
        $open[$j] =($r[$i]*$open[$j]) % $q[$i];
    }

}
echo "matrix:";
print_r($matrix);
echo "open:";
print_r($open);
echo "q:";
print_r($q);
echo "r:";
print_r($r);
echo "invert:";
print_r($invert);
echo "open:";
print_r($open);

echo "open min:";
echo "\n".min($open);

/*
 * Чётное ± Чётное = Чётное
 * Чётное ± Нечётное = Нечётное
 * Нечётное ± Нечётное = Чётное
  * */

// plus-minus
echo "\n\nplus-minus:";
for ($i = 1; $i <= 100; $i++) {
    $rnd=rand(0, count($open) - 1);
    $num = $open[$rnd];

    for ($j = 0; $j < PLUS_MINUS_COUNT; $j++) {
        $rnd=rand(0, count($open) - 1);
        $num += $open[$rnd];
    }
    for ($j = 0; $j < PLUS_MINUS_COUNT; $j++) {
        $prevnum=$num;
        $rnd=rand(0, count($open) - 1);
        $num -=  $open[$rnd];
        if ($num<0) { $num=$prevnum;  break; }
    }
    echo "\n$num ";
}