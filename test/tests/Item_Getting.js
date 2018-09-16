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

import { test, equals } from '../helpers';

QUnit.module('Getting and Matching Items');

test('Item#getItems()', function() {
    var group = new Group([new Path({ selected: true })]);
    equals(function() {
        return group.getItems({
            type: 'path'
        }).length;
    }, 1);

    equals(function() {
        return group.getItems({
            selected: true
        }).length;
    }, 1);
});

test('Item#matches()', function() {
    var path = new Path();
    equals(function() {
        return path.matches({
            visible: false
        });
    }, false);

    equals(function() {
        return path.matches({
            visible: true
        });
    }, true);
});

test('Project#getItems()', function() {
    var layer = new Layer();
    var parent = new Layer([layer]);

    var matches = parent.getItems({
        class: Layer
    });
    equals(function() {
        return matches.length == 1 && matches[0] == layer;
    }, true);

    var matches = parent.getItems({
        class: Item
    });
    equals(function() {
        return matches.length == 1 && matches[0] == layer;
    }, true);

    var path = new Path();
    parent.addChild(path);
    var matches = parent.getItems({
        class: Path
    });
    equals(function() {
        return matches.length == 1 && matches[0] == path;
    }, true);

    var group = new Group();
    parent.addChild(group);
    var matches = parent.getItems({
        className: 'Group'
    });
    equals(function() {
        return matches.length == 1 && matches[0] === group;
    }, true);

    var matches = parent.getItems({
        type: 'group'
    });
    equals(function() {
        return matches.length == 1 && matches[0] === group;
    }, true);
});

test('Project#getItems() with compare function', function() {
    var firstPath = new Path();
    var path = new Path({
        opacity: 0.5
    });
    var parent = new Layer([firstPath, path]);

    var items = parent.getItems({
        opacity: function(value) {
            return value < 1;
        }
    });
    equals(function() {
        return items.length == 1 && items[0] == path;
    }, true);
});

test('Project#getItems() with specific property value', function() {
    var path = new Path();
    var decoyPath = new Path({
        opacity: 0.5
    });
    var parent = new Layer([path, decoyPath]);

    var items = parent.getItems({
        opacity: 1,
        type: 'path'
    });
    equals(function() {
        return items.length == 1 && items[0] == path;
    }, true);
});

test('Project#getItems() with color', function() {
    var path = new Path({
        fillColor: 'red'
    });

    var decoyPath = new Path({
        fillColor: 'black'
    });
    var parent = new Layer([path, decoyPath]);

    var items = parent.getItems({
        fillColor: 'red',
        type: 'path'
    });
    equals(function() {
        return items.length == 1 && items[0] == path;
    }, true);
});

test('Project#getItems() with regex function', function() {
    var stopPath = new Path({
        name: 'stop'
    });

    var pausePath = new Path({
        name: 'pause'
    });

    var startPath = new Path({
        name: 'starting'
    });
    var layer = new Layer([stopPath, pausePath, startPath]);

    var items = layer.getItems({
        name: /^start/g
    });

    equals(function() {
        return items.length == 1 && items[0] == startPath;
    }, true);

    equals(function() {
        var items = layer.getItems({
            name: /^st/g
        });
        return items.length == 2;
    }, true);
});

test('Project#getItems() empty: true', function() {
    var empty1 = new Path();
    var empty2 = new Path();
    var layer = new Layer([ empty1, empty2]);


    equals(function() {
        return layer.children.length;
    }, 2);

    equals(function() {
        return layer.getItems({
            empty: true
        }).length;
    }, 2);
});

test('Project#getItems() overlapping', function() {
    var path = new Path.Circle({
        radius: 100,
        center: [200, 200],
        fillColor: 'red'
    });
    var project = new Layer([path]);

    equals(function() {
        var matches = project.getItems({
            class: Path,
            overlapping: [0, 0, 400, 400]
        });
        return matches.length == 1 && matches[0] == path;
    }, true);

    equals(function() {
        var matches = project.getItems({
            class: Path,
            overlapping: [200, 0, 400, 400]
        });
        return matches.length == 1 && matches[0] == path;
    }, true);

    equals(function() {
        var matches = project.getItems({
            class: Path,
            overlapping: [400, 0, 400, 400]
        });
        return matches.length == 0;
    }, true);
});

test('Project#getItems() inside', function() {
    var path = new Path.Circle({
        radius: 100,
        center: [200, 200],
        fillColor: 'red'
    });
    var project = new Layer([path]);

    equals(function() {
        var matches = project.getItems({
            class: Path,
            inside: [0, 0, 400, 400]
        });
        return matches.length == 1 && matches[0] == path;
    }, true);

    equals(function() {
        var matches = project.getItems({
            class: Path,
            inside: [200, 0, 400, 400]
        });
        return matches.length == 0;
    }, true);
});
