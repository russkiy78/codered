/**
 * Created by russkiy on 08.05.15.
 */
"use strict";

function Codered() {

    /* init const */
    this.keyLen = 100;
    this.circles = 2;
    this.maxq = 10;
    this.minr = 100;

    this.maxplus = 12;
    this.minplus = 10;

    this.maxminus = 3;
    this.minminus = 2;


    /* private key */
    this.initprivatekey = [];
    this.privatekey = {
        q: new Array(this.circles),
        r: new Array(this.circles),
        invert: new Array(this.circles)
    };
    /* open key */
    this.openkey = new Uint32Array(this.keyLen);

}

Codered.prototype.createKey = function () {

    /* private key */
    this.initprivatekey = [];
    this.privatekey = {
        q: new Array(this.circles),
        r: new Array(this.circles),
        invert: new Array(this.circles)
    };
    /* open key */
    this.openkey = new Uint32Array(this.keyLen);

    var cryptoObj = window.crypto || window.msCrypto;

    // create two array - with even and odd digits
    var matrix_even = new Uint16Array(Math.floor(this.keyLen / 2));
    cryptoObj.getRandomValues(matrix_even); //  чет
    Array.prototype.forEach.call(matrix_even, function (item, i, arr) {
        arr[i] = (item % 2 ? item + (Math.floor(Math.random() * 2) ? -1 : 1) : item);
    });


    var matrix_odd = new Uint16Array(Math.floor(this.keyLen / 2));
    cryptoObj.getRandomValues(matrix_odd); // нечет
    Array.prototype.forEach.call(matrix_odd, function (item, i, arr) {
        arr[i] = (item % 2 ? item : item + (Math.floor(Math.random() * 2) ? -1 : 1));
    });

    // merge arrays
    for (var i = 0; i < this.keyLen; i++) {
        this.initprivatekey.push(( i % 2 ? matrix_odd[(i == 1 ? 0 : Math.floor(i / 2))] : matrix_even[(i == 0 ? 0 : i / 2)] ));
    }

    //create open keys
    this.openkey = this.initprivatekey.slice();

    for (var i = 0; i < this.circles; i++) {

        this.privatekey.q[i] = this.nextPrime((Math.max.apply(null, this.openkey) * this.maxplus) - (Math.min.apply(null, this.openkey) * this.maxminus), Math.floor(Math.random() * this.maxq));
        this.privatekey.r[i] = Math.floor(Math.random() * (this.privatekey.q[i] - this.minr)) + this.minr
        this.privatekey.invert[i] = this.getInvert(this.privatekey.r[i], this.privatekey.q[i]);
        for (var j = 0; j < this.keyLen; j++) {
            this.openkey[j] = this.openkey[j] * this.privatekey.r[i] % this.privatekey.q[i];
        }
    }
};

Codered.prototype.encode = function (bit) {
    if (this.openkey.length == this.keyLen && (bit == 1 || bit == 0)) {


        var randplus = Math.floor(Math.random() * (this.maxplus - this.minplus)) + this.minplus;
     //   console.log("randplus " + randplus);


        //plus
        var oddcount = Math.floor(Math.random() * randplus);

        oddcount = (bit == 1 ? (oddcount % 2 ? oddcount : oddcount + (Math.floor(Math.random() * 2) && oddcount>0 ? -1 : 1)) :
            (oddcount % 2 ? oddcount + (Math.floor(Math.random() * 2) && oddcount>0 ? -1 : 1) : oddcount ));
        var evencount = randplus - oddcount;


     //   console.log("evencount " + evencount);
    //    console.log("oddcount " + oddcount);

        var sum = 0;


        for (var i = 0; i < randplus; i++) {
            var randposition = Math.floor(Math.random() * (this.keyLen - 1));
            if (evencount > 0) {
                var pp = this.openkey[(randposition % 2 ? randposition - 1 : randposition)];
                sum += pp;
             //   console.log("even plus " + pp + " pos "+(randposition % 2 ? randposition - 1 : randposition)+" private " + this.initprivatekey[(randposition % 2 ? randposition - 1 : randposition)]);
                evencount--;
            } else {
                var pp = this.openkey[(randposition % 2 ? randposition : (randposition == 0 ? 1 : randposition - 1  ))];
                sum += pp;
             //   console.log("odd plus " + pp + " pos "+(randposition % 2 ? randposition : (randposition == 0 ? 1 : randposition - 1  ))+" private " + this.initprivatekey[(randposition % 2 ? randposition : (randposition == 0 ? 1 : randposition - 1  ))]);
                oddcount--;
            }
        }


        //minus
        var randminus = Math.floor(Math.random() * (this.maxminus - this.minminus)) + this.minminus;
     //   console.log("randminus " + randminus);

        for (var i = 0; i < randminus; i++) {
            var randposition = Math.floor(Math.random() * (this.keyLen - 1));
            var pp = this.openkey[(randposition % 2 ? randposition - 1 : randposition)];
            sum += pp;
         //   console.log("even minus " + pp + " pos "+(randposition % 2 ? randposition - 1 : randposition)+" private " + this.initprivatekey[(randposition % 2 ? randposition - 1 : randposition)]);


        }
        return sum;
    }
};

Codered.prototype.decode = function (data) {
    var tdata = data;
    for (var i = this.circles-1; i>=0; i--) {
        tdata = tdata * this.privatekey.invert[i] % this.privatekey.q[i];
      //  console.log("tdata"+i+" " + tdata);
    }
    return (tdata % 2 ? 1 : 0);
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