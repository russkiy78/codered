/**
 * Created by russkiy on 08.05.15.
 */
"use strict";

function Codered() {

    /* init const */
    this.debug = false;

    this.keyLen = 1000;
    this.circles = 1;
    this.maxq = 10;
    this.minr = 1000;

    this.maxplus = 10;
    this.minplus = 5;


  //  this.maxminus = 2;
  //  this.minminus = 0;

    /*debug values*/
    this.debugval = {
        privatekeys: new Array(this.circles)

    };


    /* private key */
    this.initprivatekey = new Array(this.keyLen + 1);
    this.privatekey = {
        q: new Array(this.circles),
        r: new Array(this.circles),
        invert: new Array(this.circles)
    };
    /* open key */
    this.openkey = new Uint32Array(this.keyLen);
    this.evensorted = new Array()

}

Codered.prototype.writedebug = function (text) {
    console.log(text);
};

Codered.prototype.createKey = function () {

    if (this.keyLen % 2) {
        if (this.debug) {
            this.writedebug("keyLen must be even digit");
        }
        return false;
    }

    up:   do {

        if (this.debug) {
            this.writedebug("gen");
        }
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

        if (this.debug)  this.debugval.privatekeys[0] = this.initprivatekey.slice();

        for (var i = 0; i < this.circles; i++) {

            if (this.debug) this.writedebug("maxplus q " + Math.max.apply(null, this.openkey) * this.maxplus);

            this.privatekey.q[i] = this.nextPrime(Math.max.apply(null, this.openkey) * this.maxplus , Math.floor(Math.random() * this.maxq));
            this.privatekey.r[i] = Math.floor(Math.random() * (Math.floor(this.privatekey.q[i]) - this.minr)) + this.minr
            this.privatekey.invert[i] = this.getInvert(this.privatekey.r[i], this.privatekey.q[i]);


            for (var j = 0; j < this.keyLen; j++) {
                this.openkey[j] = this.openkey[j] * this.privatekey.r[i] % this.privatekey.q[i];
                if (this.openkey[j] == 0) {
                    if (this.debug) this.writedebug("zero finded");
                    continue up;
                }
            }
            if (this.debug)   this.debugval.privatekeys[i + 1] = this.openkey.slice();

        }
    } while (0);


    // create sorted array
    for (var i = 0; i < this.keyLen; i += 2) {
        this.evensorted.push(this.openkey[i]);
    }
    this.evensorted = this.evensorted.sort(function(a, b) {  return a - b;  });

    return true;

};

Codered.prototype.encode = function (bit) {

    if (this.debug) var privatesum=0;

    if (this.openkey.length == this.keyLen && (bit == 1 || bit == 0)) {

        var randplus = Math.floor(Math.random() * (this.maxplus - this.minplus)) + this.minplus;

        if (this.debug) this.writedebug("randplus " + randplus);

        //plus
        var oddcount = Math.floor(Math.random() * randplus);

        oddcount = (bit == 1 ? (oddcount % 2 ? oddcount : oddcount + (Math.floor(Math.random() * 2) && oddcount > 0 ? -1 : 1)) :
            (oddcount % 2 ? oddcount + (Math.floor(Math.random() * 2) && oddcount > 0 ? -1 : 1) : oddcount ));

        if (this.debug) this.writedebug("oddcount " + oddcount);

        var evencount = randplus - oddcount;

        if (this.debug)  this.writedebug("evencount " + evencount);

        var sum = 0;
        /**/
        for (var i = 0; i < randplus; i++) {
            var randposition = Math.floor(Math.random() * (this.keyLen - 1));

            if (this.debug)  this.writedebug("randposition " + randposition);

            if (evencount > 0) {
                var pp = this.openkey[(randposition % 2 ? randposition - 1 : randposition)];
                sum += pp;
                evencount--;
                if (this.debug) {
                    if (this.debugval.privatekeys.length) {
                        var deb = '';
                        if (this.debug)  this.writedebug("even plus  " + pp);
                        for (var k = 0; k < this.circles; k++) {
                            deb += "even plus " + k + " : " + this.debugval.privatekeys[k][(randposition % 2 ? randposition - 1 : randposition)] + "<br>";
                        }
                        this.writedebug(deb);
                    }
                }
            } else {
                var pp = this.openkey[(randposition % 2 ? randposition : (randposition == 0 ? 1 : randposition - 1  ))];
                sum += pp;
                oddcount--;
                if (this.debug) {
                    if (this.debugval.privatekeys.length) {
                        var deb = '';
                        if (this.debug)  this.writedebug("odd plus  " + pp);
                        for (var k = 0; k < this.circles; k++) {
                            deb += "odd plus " + k + " : " + this.debugval.privatekeys[k][(randposition % 2 ? randposition : (randposition == 0 ? 1 : randposition - 1  ))] + "<br>";
                        }
                        this.writedebug(deb);
                    }
                }
            }
            if (this.debug)  this.writedebug("plus sum " + sum);

        }

        var minus = this.findMaxInSortedArray(this.evensorted, sum);
        var minuscounter=0;
        do {
            minuscounter++;
            sum-=minus;
            if (this.debug)  this.writedebug("minus " + minus);
            minus = this.findMaxInSortedArray(this.evensorted, sum);
        } while (minus);

        if (this.debug)  this.writedebug("minuscounter " + minuscounter);
/*
        //minus
        var randminus = Math.floor(Math.random() * (this.maxminus - this.minminus)) + this.minminus;
        if (this.debug) {
            this.writedebug("randminus " + randminus);
        }
        for (var i = 0; i < randminus; i++) {
            var randposition = Math.floor(Math.random() * (this.keyLen - 1));
            var pp = this.openkey[(randposition % 2 ? randposition - 1 : randposition)];
            if (sum - pp > 0) {
                sum -= pp;
                if (this.debug) {
                    if (this.debugval.privatekeys.length) {
                        var deb = '';
                        for (var k = 0; k < this.circles; k++) {
                            deb += "even minus " + k + " : " + this.debugval.privatekeys[k][(randposition % 2 ? randposition - 1 : randposition)] + "<br>";
                        }
                        this.writedebug(deb);
                    }
                }
            } else {
                if (this.debug) {
                    this.writedebug("minus - ignore");
                }
            }

        }
*/
        //end
        if (this.debug)  this.writedebug("sum " + sum);
        return sum;
    }
};

Codered.prototype.decode = function (data) {

    var tdata = data;

    for (var i = 0; i < Math.floor(this.maxplus/3); i++) {
        if (tdata+this.evensorted[this.evensorted.length-1]>=this.privatekey.q[this.privatekey.q.length-1]) {
            if (this.debug) this.writedebug("<b>stop!</b> " +i);
            break;
        }
         if (this.debug) this.writedebug("decode plus " +i);
        tdata+=this.evensorted[this.evensorted.length-1];
    }
    if (this.debug) this.writedebug("tdata " + tdata);

    for (var i = this.circles - 1; i >= 0; i--) {
        if (this.debug) this.writedebug("decode step "+i+" " + tdata + " * " +  this.privatekey.invert[i] + "("+(tdata * this.privatekey.invert[i])+")" + " % "+this.privatekey.q[i] + " = "+
            (tdata * this.privatekey.invert[i] % this.privatekey.q[i]));
        tdata = tdata * this.privatekey.invert[i] % this.privatekey.q[i];

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

Codered.prototype.findMaxInSortedArray = function (arr, sum) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (arr[i] > sum) {
            if (i == 0) {
                return false;
            } else {
                return arr[i - 1];
            }
        }
    }
    return arr[len - 1];
    ;
};