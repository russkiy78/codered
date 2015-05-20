/**
 * Created by russkiy on 08.05.15.
 */

var code = new Codered();

 code.createKey();
console.log(code);

console.log("start 1");
var val=code.encode(1);
console.log("val "+val);
console.log("decode "+code.decode(val));

console.log("start 0");
var val=code.encode(0);
console.log("val "+val);
console.log("decode "+code.decode(val));





//console.log(code.nextPrime(10,4));