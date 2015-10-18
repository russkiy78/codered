/**
 * Created by russkiy on 13.10.15.
 */
"use strict";

function Codered() {
    this.init(true);
};

Codered.prototype.init = function (clearconst) {

    /* init const */
    if (clearconst) {
        this.keyLen = 20;
        this.minFirst=1024;
        this.maxInitStep = 2;
        this.maxq = 2;
        this.minr = 2;
    }


    /* private key */

    this.privatekey = {
       // vector: new Uint32Array(this.keyLen),
        vector : new Array(),
        v_q : new Number(),
        v_r :  new Number(),
        q: new Array(2),
        r: new Array(2),
        invert: new Array(2)
    };

    /* open key */
    this.openkey = [
        new Array(),
        new Array()
    ];

};

Codered.prototype.createKey = function () {

    this.init(false);


  //  var cryptoObj = window.crypto || window.msCrypto;
  //  var array = new Uint32Array(10);
  //  cryptoObj.getRandomValues(array);
  //  console.log(array);
    var sum = 0;
    for (var i = 0; i < this.keyLen; i++) {

        var rand = this.getRandomInt(sum + 1, sum + this.maxInitStep);
       // this.privatekey.vector.push(rand);
        this.privatekey.vector[i]=rand;

        console.log( rand.toString(2).padZero(32).substring(0,16)+" "+rand.toString(2).padZero(32).substring(16,32)+" = "+rand+ " i="+i);
        //initopen
        //var splitrand = this.getRandomInt(1, rand);
        //this.openkey[0].push(splitrand);
        //this.openkey[1].push(rand - splitrand);
        sum += rand;
    }
    this.privatekey.v_q = this.nextPrime(this.privatekey.vector.reduce(function (a, b) {
        return a + b;
    }), Math.floor(Math.random() * this.maxq));
    this.privatekey.v_r = Math.floor(Math.random() * (Math.floor(this.privatekey.v_q) - this.minr)) + this.minr;
    console.log("q="+this.privatekey.v_q+"r="+this.privatekey.v_r);
    console.log("open");

    for (var j = 0; j < this.keyLen; j++) {
        this.privatekey.vector[j] = this.privatekey.vector[j] * this.privatekey.v_r % this.privatekey.v_q;
        console.log( this.privatekey.vector[j].toString(2).padZero(32).substring(0,16)+" "+
            this.privatekey.vector[j].toString(2).padZero(32).substring(16,32)+" = "+
            this.privatekey.vector[j]+ " i="+j);

        this.openkey[0].push(parseInt(this.privatekey.vector[j].toString(2).padZero(32).substring(0,16),2));
        this.openkey[1].push(parseInt(this.privatekey.vector[j].toString(2).padZero(32).substring(16,32),2));
    }
    console.log("open 2 vector");

    for (var i = 0; i < 2; i++) {
        console.log("  vector "+(i+1));
        this.privatekey.q[i] = this.nextPrime(this.openkey[i].reduce(function (a, b) {
            return a + b;
        }), Math.floor(Math.random() * this.maxq));
        this.privatekey.r[i] = Math.floor(Math.random() * (Math.floor(this.privatekey.q[i]) - this.minr)) + this.minr;
        this.privatekey.invert[i] = this.getInvert(this.privatekey.r[i], this.privatekey.q[i]);

        for (var j = 0; j < this.keyLen; j++) {
            this.openkey[i][j] = this.openkey[i][j] * this.privatekey.r[i] % this.privatekey.q[i];
            console.log( this.openkey[i][j].toString(2).padZero(20)+ "  = "+ this.openkey[i][j] + " len=" +
                this.openkey[i][j].toString(2).length+ " j="+j);

        }

    }
    return true;

};

Codered.prototype.encode = function (bits) {

    if (bits.length  <= this.keyLen) {
        var sum1=0;
        var sum2=0;
        for (var i = 0; i < bits.length; i++) {
           sum1+=parseInt(bits[i])*this.openkey[0][i];
           sum2+=parseInt(bits[i])*this.openkey[1][i];
        }
        //console.log("sum12="+sum1.toString(10)+sum2.toString(10));
        console.log("sum1="+sum1);
        console.log("sum2="+sum2);
        sum1=sum1.toString(2);
        sum2=sum2.toString(2);
        if (sum1.length > sum2.length) {
            sum2=sum2.padZero(sum1.length)
        } else {
            sum1=sum1.padZero(sum2.length)
        }

        var sum='';
        var firstarr= this.getRandomInt(0,1);

        console.log("bits="+parseInt(bits,2));
        console.log("sum1="+sum1+" l="+sum1.length);
        console.log("sum2="+sum2+" l="+sum2.length);

        console.log("firstarr="+firstarr);


        for (var i = 0; i < sum1.length; i++) {
            sum+=(firstarr ? sum1[i]+sum2[i] : sum2[i]+sum1[i]);
        }
        console.log("sum="+sum);
        return parseInt(sum,2);
    }
    return false;
};








// stdf
String.prototype.padZero= function(len, c){
    var s= this, c= c || '0';
    while(s.length< len) s= c+ s;
    return s;
}
Codered.prototype.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
Codered.prototype.getInvert = function (a, b) {
    var res = this.Euclide(a, b);
    if (res[2] !== 1) {
        return false;
    }
    if (res[0] < 0) {
        return b + res[0];
    } else {
        return res[0];
    }
};
Codered.prototype.Euclide = function (a, b) {
    if (b == 0) {
        return [1, 0, a]
    }
    else {
        var temp = this.Euclide(b, a % b);
        var x = temp[0];
        var y = temp[1];
        var d = temp[2];
        return [y, x - y * Math.floor(a / b), d]
    }

};
Codered.prototype.isPrime = function (n) {
    for (var i = 2; i < n; i++) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
};
Codered.prototype.nextPrime = function (n, c) {

    var i = n + 1;
    var count;
    if (c === undefined || c < 1) {
        count = 1;
    } else {
        count = c;
    }
    do {
        if (this.isPrime(i)) {
            if (count == 0) {
                return i;
            } else {
                count--;
                i++;
            }
        }
        else {
            i++;
        }
    } while (1);

};