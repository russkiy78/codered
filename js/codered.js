/**
 * Created by russkiy on 08.05.15.
 */
"use strict";

function Codered() {

    /* init const */
    this.keyLen = 10;
    this.circles = 5;
    this.maxq = 100;
    this.minr = 10;

    /* private key */
    this.initprivatekey = [];
    this.privatekey = {
        q: new Array (this.circles),
        r: new Array (this.circles),
        invert: new Array (this.circles)
    };
    /* open key */
    this.openkey = new Uint32Array(this.keyLen);
}

Codered.prototype.createKey = function () {

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

        this.privatekey.q[i] = this.nextPrime(Math.max.apply(null, this.openkey) * 2, Math.floor(Math.random() * this.maxq));
        this.privatekey.r[i] = Math.floor(Math.random() * (this.privatekey.q[i] - this.minr)) + this.minr
        this.privatekey.invert[i] = this.getInvert(this.privatekey.r[i], this.privatekey.q[i]);
        for (var j = 0; j < this.keyLen; j++) {
            this.openkey[j] = this.openkey[j] * this.privatekey.r[i] % this.privatekey.q[i];
        }
    }
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