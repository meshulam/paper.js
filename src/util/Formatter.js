/*
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2016, Juerg Lehni & Jonathan Puckey
 * http://scratchdisk.com/ & http://jonathanpuckey.com/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

/**
 * @name Formatter
 * @class
 * @private
 */
class Formatter {
    /**
     * @param {Number} [precision=5] the amount of fractional digits
     */
    constructor(precision) {
        this.precision = Number.isSafeInteger(precision) ? precision : 5;
        this.multiplier = Math.pow(10, this.precision);
    }

    /**
     * Utility function for rendering numbers as strings at a precision of
     * up to the amount of fractional digits.
     *
     * @param {Number} num the number to be converted to a string
     */
    number(value) {
        // It would be nice to use Number#toFixed() instead, but it pads with 0,
        // unnecessarily consuming space.
        // If precision is >= 16, don't do anything at all, since that appears
        // to be the limit of the precision (it actually varies).
        return this.precision < 16
                ? Math.round(value * this.multiplier) / this.multiplier : value;
    }

    pair(val1, val2, separator) {
        return this.number(val1) + (separator || ',') + this.number(val2);
    }

    point(val, separator) {
        return this.number(val.x) + (separator || ',') + this.number(val.y);
    }

    size(val, separator) {
        return this.number(val.width) + (separator || ',')
                + this.number(val.height);
    }

    rectangle(val, separator) {
        return this.point(val, separator) + (separator || ',')
                + this.size(val, separator);
    }
}

Formatter.instance = new Formatter();

export default Formatter;
