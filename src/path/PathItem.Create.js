import { PathItem } from './PathItem';
import { CompoundPath } from './CompoundPath';
import { Path } from './Path';
import { Base } from '../core/Base';

PathItem.inject({
    statics: /** @lends PathItem */{
        /**
         * Creates a path item from the given SVG path-data, determining if the
         * data describes a plain path or a compound-path with multiple
         * sub-paths.
         *
         * @name PathItem.create
         * @function
         * @param {String} pathData the SVG path-data to parse
         * @return {Path|CompoundPath} the newly created path item
         */
        /**
         * Creates a path item from the given segments array, determining if the
         * array describes a plain path or a compound-path with multiple
         * sub-paths.
         *
         * @name PathItem.create
         * @function
         * @param {Number[][]} segments the segments array to parse
         * @return {Path|CompoundPath} the newly created path item
         */
        /**
         * Creates a path item from the given object, determining if the
         * contained information describes a plain path or a compound-path with
         * multiple sub-paths.
         *
         * @name PathItem.create
         * @function
         * @param {Object} object an object containing the properties describing
         *     the item to be created
         * @return {Path|CompoundPath} the newly created path item
         */
        create: function(arg) {
            var data,
                segments,
                compound;
            if (Base.isPlainObject(arg)) {
                segments = arg.segments;
                data = arg.pathData;
            } else if (Array.isArray(arg)) {
                segments = arg;
            } else if (typeof arg === 'string') {
                data = arg;
            }
            if (segments) {
                var first = segments[0];
                compound = first && Array.isArray(first[0]);
            } else if (data) {
                // If there are multiple moveTo commands or a closePath command
                // followed by other commands, we have a CompoundPath.
                compound = (data.match(/m/gi) || []).length > 1
                        || /z\s*\S+/i.test(data);
            }
            var ctor = compound ? CompoundPath : Path;
            return new ctor(arg);
        }
    },
});
