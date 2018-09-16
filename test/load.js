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

import "qunitjs/qunit/qunit.css";
import "qunitjs/qunit/qunit";

import "../src/index.js";

// import "prepro/lib/browser.js";

/*#*/ require('./helpers.js');
// We need to load resemble.js after helpers.js, since for Node, helpers makes
// sure window, document and Image are made global first.
// /*#*/ require('resemblejs/resemble.js');  // , { namespace: 'resemble' }
/*#*/ require('./tests/load.js');
