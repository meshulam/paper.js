import Numerical from '../util/Numerical';
import { Point } from '../basic/Point';
import { Line } from '../basic/Line';

export function classify(v) {
    // See: Loop and Blinn, 2005, Resolution Independent Curve Rendering
    // using Programmable Graphics Hardware, GPU Gems 3 chapter 25
    //
    // Possible types:
    //   'line'       (d1 == d2 == d3 == 0)
    //   'quadratic'  (d1 == d2 == 0)
    //   'serpentine' (d > 0)
    //   'cusp'       (d == 0)
    //   'loop'       (d < 0)
    //   'arch'       (serpentine, cusp or loop with roots outside 0..1)
    //
    // NOTE: Roots for serpentine, cusp and loop curves are only
    // considered if they are within 0..1. If the roots are outside,
    // then we degrade the type of curve down to an 'arch'.

    var x0 = v[0], y0 = v[1],
        x1 = v[2], y1 = v[3],
        x2 = v[4], y2 = v[5],
        x3 = v[6], y3 = v[7],
        // Calculate coefficients of I(s, t), of which the roots are
        // inflection points.
        a1 = x0 * (y3 - y2) + y0 * (x2 - x3) + x3 * y2 - y3 * x2,
        a2 = x1 * (y0 - y3) + y1 * (x3 - x0) + x0 * y3 - y0 * x3,
        a3 = x2 * (y1 - y0) + y2 * (x0 - x1) + x1 * y0 - y1 * x0,
        d3 = 3 * a3,
        d2 = d3 - a2,
        d1 = d2 - a2 + a1,
        // Normalize the vector (d1, d2, d3) to keep error consistent.
        l = Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3),
        s = l !== 0 ? 1 / l : 0,
        isZero = Numerical.isZero,
        serpentine = 'serpentine'; // short-cut
    d1 *= s;
    d2 *= s;
    d3 *= s;

    function type(type, t1, t2) {
        var hasRoots = t1 !== undefined,
            t1Ok = hasRoots && t1 > 0 && t1 < 1,
            t2Ok = hasRoots && t2 > 0 && t2 < 1;
        // Degrade to arch for serpentine, cusp or loop if no solutions
        // within 0..1 are found. loop requires 2 solutions to be valid.
        if (hasRoots && (!(t1Ok || t2Ok)
                || type === 'loop' && !(t1Ok && t2Ok))) {
            type = 'arch';
            t1Ok = t2Ok = false;
        }
        return {
            type: type,
            roots: t1Ok || t2Ok
                    ? t1Ok && t2Ok
                        ? t1 < t2 ? [t1, t2] : [t2, t1] // 2 solutions
                        : [t1Ok ? t1 : t2] // 1 solution
                    : null
        };
    }

    if (isZero(d1)) {
        return isZero(d2)
                ? type(isZero(d3) ? 'line' : 'quadratic') // 5. / 4.
                : type(serpentine, d3 / (3 * d2));        // 3b.
    }
    var d = 3 * d2 * d2 - 4 * d1 * d3;
    if (isZero(d)) {
        return type('cusp', d2 / (2 * d1));               // 3a.
    }
    var f1 = d > 0 ? Math.sqrt(d / 3) : Math.sqrt(-d),
        f2 = 2 * d1;
    return type(d > 0 ? serpentine : 'loop',              // 1. / 2.
            (d2 + f1) / f2,
            (d2 - f1) / f2);
};

export function getValues(segment1, segment2, matrix, straight) {
    var p1 = segment1._point,
        h1 = segment1._handleOut,
        h2 = segment2._handleIn,
        p2 = segment2._point,
        x1 = p1.x, y1 = p1.y,
        x2 = p2.x, y2 = p2.y,
        values = straight
            ? [ x1, y1, x1, y1, x2, y2, x2, y2 ]
            : [
                x1, y1,
                x1 + h1._x, y1 + h1._y,
                x2 + h2._x, y2 + h2._y,
                x2, y2
            ];
    if (matrix)
        matrix._transformCoordinates(values, values, 4);
    return values;
};

export function subdivide(v, t) {
    var x0 = v[0], y0 = v[1],
        x1 = v[2], y1 = v[3],
        x2 = v[4], y2 = v[5],
        x3 = v[6], y3 = v[7];
    if (t === undefined)
        t = 0.5;
    // Triangle computation, with loops unrolled.
    var u = 1 - t,
        // Interpolate from 4 to 3 points
        x4 = u * x0 + t * x1, y4 = u * y0 + t * y1,
        x5 = u * x1 + t * x2, y5 = u * y1 + t * y2,
        x6 = u * x2 + t * x3, y6 = u * y2 + t * y3,
        // Interpolate from 3 to 2 points
        x7 = u * x4 + t * x5, y7 = u * y4 + t * y5,
        x8 = u * x5 + t * x6, y8 = u * y5 + t * y6,
        // Interpolate from 2 points to 1 point
        x9 = u * x7 + t * x8, y9 = u * y7 + t * y8;
    // We now have all the values we need to build the sub-curves:
    return [
        [x0, y0, x4, y4, x7, y7, x9, y9], // left
        [x9, y9, x8, y8, x6, y6, x3, y3] // right
    ];
};


export function isStraight(v, epsilon) {
        var x0 = v[0], y0 = v[1],
            x3 = v[6], y3 = v[7];
        return isStraightInternal(
            new Point(x0, y0),
            new Point(v[2] - x0, v[3] - y0),
            new Point(v[4] - x3, v[5] - y3),
            new Point(x3, y3),
            epsilon
        );
    };

export function isStraightInternal(p1, h1, h2, p2, epsilon) {
    if (h1.isZero() && h2.isZero()) {
        // No handles.
        return true;
    } else {
        var v = p2.subtract(p1);
        if (v.isZero()) {
            // Zero-length line, with some handles defined.
            return false;
        } else if (v.isCollinear(h1) && v.isCollinear(h2)) {
            // Collinear handles: In addition to v.isCollinear(h) checks, we
            // need to measure the distance to the line, in order to be able
            // to use the same epsilon as in Curve#getTimeOf(), see #1066.
            var l = new Line(p1, p2);
            epsilon = epsilon || Numerical.GEOMETRIC_EPSILON;

            if (l.getDistance(p1.add(h1)) < epsilon &&
                l.getDistance(p2.add(h2)) < epsilon) {
                // Project handles onto line to see if they are in range:
                var div = v.dot(v),
                    s1 = v.dot(h1) / div,
                    s2 = v.dot(h2) / div;
                return s1 >= 0 && s1 <= 1 && s2 <= 0 && s2 >= -1;
            }
        }
    }
    return false;
}

export function getLength(v, a, b, ds) {
    if (a === undefined)
        a = 0;
    if (b === undefined)
        b = 1;
    if (isStraight(v)) {
        // Sub-divide the linear curve at a and b, so we can simply
        // calculate the Pythagorean Theorem to get the range's length.
        var c = v;
        if (b < 1) {
            c = subdivide(c, b)[0]; // left
            a /= b; // Scale parameter to new sub-curve.
        }
        if (a > 0) {
            c = subdivide(c, a)[1]; // right
        }
        // The length of straight curves can be calculated more easily.
        var dx = c[6] - c[0], // x3 - x0
            dy = c[7] - c[1]; // y3 - y0
        return Math.sqrt(dx * dx + dy * dy);
    }
    return Numerical.integrate(ds || getLengthIntegrand(v), a, b,
            getIterations(a, b));
};

export function getTimeAt(v, offset, start) {
    if (start === undefined)
        start = offset < 0 ? 1 : 0;
    if (offset === 0)
        return start;
    // See if we're going forward or backward, and handle cases
    // differently
    var abs = Math.abs,
        epsilon = /*#=*/Numerical.EPSILON,
        forward = offset > 0,
        a = forward ? start : 0,
        b = forward ? 1 : start,
        // Use integrand to calculate both range length and part
        // lengths in f(t) below.
        ds = getLengthIntegrand(v),
        // Get length of total range
        rangeLength = getLength(v, a, b, ds),
        diff = abs(offset) - rangeLength;
    if (abs(diff) < epsilon) {
        // Matched the end:
        return forward ? b : a;
    } else if (diff > epsilon) {
        // We're out of bounds.
        return null;
    }
    // Use offset / rangeLength for an initial guess for t, to
    // bring us closer:
    var guess = offset / rangeLength,
        length = 0;
    // Iteratively calculate curve range lengths, and add them up,
    // using integration precision depending on the size of the
    // range. This is much faster and also more precise than not
    // modifying start and calculating total length each time.
    function f(t) {
        // When start > t, the integration returns a negative value.
        length += Numerical.integrate(ds, start, t,
                getIterations(start, t));
        start = t;
        return length - offset;
    }
    // Start with out initial guess for x.
    // NOTE: guess is a negative value when looking backwards.
    return Numerical.findRoot(f, ds, start + guess, a, b, 32,
            /*#=*/Numerical.EPSILON);
};


/**
 * Returns the t values for the "peaks" of the curve. The peaks are
 * calculated by finding the roots of the dot product of the first and
 * second derivative.
 *
 * Peaks are locations sharing some qualities of curvature extrema but
 * are cheaper to compute. They fulfill their purpose here quite well.
 * See:
 * http://math.stackexchange.com/questions/1954845/bezier-curvature-extrema
 *
 * @param {Number[]} v the curve values array
 * @returns {Number[]} the roots of all found peaks
 */
export function getPeaks(v) {
    var x0 = v[0], y0 = v[1],
        x1 = v[2], y1 = v[3],
        x2 = v[4], y2 = v[5],
        x3 = v[6], y3 = v[7],
        ax =     -x0 + 3 * x1 - 3 * x2 + x3,
        bx =  3 * x0 - 6 * x1 + 3 * x2,
        cx = -3 * x0 + 3 * x1,
        ay =     -y0 + 3 * y1 - 3 * y2 + y3,
        by =  3 * y0 - 6 * y1 + 3 * y2,
        cy = -3 * y0 + 3 * y1,
        tMin = /*#=*/Numerical.CURVETIME_EPSILON,
        tMax = 1 - tMin,
        roots = [];
    Numerical.solveCubic(
            9 * (ax * ax + ay * ay),
            9 * (ax * bx + by * ay),
            2 * (bx * bx + by * by) + 3 * (cx * ax + cy * ay),
            (cx * bx + by * cy),
            // Exclude 0 and 1 as we don't count them as peaks.
            roots, tMin, tMax);
    return roots.sort();
}

function getLengthIntegrand(v) {
    // Calculate the coefficients of a Bezier derivative.
    var x0 = v[0], y0 = v[1],
        x1 = v[2], y1 = v[3],
        x2 = v[4], y2 = v[5],
        x3 = v[6], y3 = v[7],

        ax = 9 * (x1 - x2) + 3 * (x3 - x0),
        bx = 6 * (x0 + x2) - 12 * x1,
        cx = 3 * (x1 - x0),

        ay = 9 * (y1 - y2) + 3 * (y3 - y0),
        by = 6 * (y0 + y2) - 12 * y1,
        cy = 3 * (y1 - y0);

    return function(t) {
        // Calculate quadratic equations of derivatives for x and y
        var dx = (ax * t + bx) * t + cx,
            dy = (ay * t + by) * t + cy;
        return Math.sqrt(dx * dx + dy * dy);
    };
};

// Amount of integral evaluations for the interval 0 <= a < b <= 1
function getIterations(a, b) {
    // Guess required precision based and size of range...
    // TODO: There should be much better educated guesses for
    // this. Also, what does this depend on? Required precision?
    return Math.max(2, Math.min(16, Math.ceil(Math.abs(b - a) * 32)));
}

export function evaluateCurve(v, t, type, normalized) {
    // Do not produce results if parameter is out of range or invalid.
    if (t == null || t < 0 || t > 1)
        return null;
    var x0 = v[0], y0 = v[1],
        x1 = v[2], y1 = v[3],
        x2 = v[4], y2 = v[5],
        x3 = v[6], y3 = v[7],
        isZero = Numerical.isZero;
    // If the curve handles are almost zero, reset the control points to the
    // anchors.
    if (isZero(x1 - x0) && isZero(y1 - y0)) {
        x1 = x0;
        y1 = y0;
    }
    if (isZero(x2 - x3) && isZero(y2 - y3)) {
        x2 = x3;
        y2 = y3;
    }
    // Calculate the polynomial coefficients.
    var cx = 3 * (x1 - x0),
        bx = 3 * (x2 - x1) - cx,
        ax = x3 - x0 - cx - bx,
        cy = 3 * (y1 - y0),
        by = 3 * (y2 - y1) - cy,
        ay = y3 - y0 - cy - by,
        x, y;
    if (type === 0) {
        // type === 0: getPoint()
        // Calculate the curve point at parameter value t
        // Use special handling at t === 0 / 1, to avoid imprecisions.
        // See #960
        x = t === 0 ? x0 : t === 1 ? x3
                : ((ax * t + bx) * t + cx) * t + x0;
        y = t === 0 ? y0 : t === 1 ? y3
                : ((ay * t + by) * t + cy) * t + y0;
    } else {
        // type === 1: getTangent()
        // type === 2: getNormal()
        // type === 3: getCurvature()
        var tMin = /*#=*/Numerical.CURVETIME_EPSILON,
            tMax = 1 - tMin;
        // 1: tangent, 1st derivative
        // 2: normal, 1st derivative
        // 3: curvature, 1st derivative & 2nd derivative
        // Prevent tangents and normals of length 0:
        // http://stackoverflow.com/questions/10506868/
        if (t < tMin) {
            x = cx;
            y = cy;
        } else if (t > tMax) {
            x = 3 * (x3 - x2);
            y = 3 * (y3 - y2);
        } else {
            x = (3 * ax * t + 2 * bx) * t + cx;
            y = (3 * ay * t + 2 * by) * t + cy;
        }
        if (normalized) {
            // When the tangent at t is zero and we're at the beginning
            // or the end, we can use the vector between the handles,
            // but only when normalizing as its weighted length is 0.
            if (x === 0 && y === 0 && (t < tMin || t > tMax)) {
                x = x2 - x1;
                y = y2 - y1;
            }
            // Now normalize x & y
            var len = Math.sqrt(x * x + y * y);
            if (len) {
                x /= len;
                y /= len;
            }
        }
        if (type === 3) {
            // Calculate 2nd derivative, and curvature from there:
            // http://cagd.cs.byu.edu/~557/text/ch2.pdf page#31
            // k = |dx * d2y - dy * d2x| / (( dx^2 + dy^2 )^(3/2))
            var x2 = 6 * ax * t + 2 * bx,
                y2 = 6 * ay * t + 2 * by,
                d = Math.pow(x * x + y * y, 3 / 2);
            // For JS optimizations we always return a Point, although
            // curvature is just a numeric value, stored in x:
            x = d !== 0 ? (x * y2 - y * x2) / d : 0;
            y = 0;
        }
    }
    // The normal is simply the rotated tangent:
    return type === 2 ? new Point(y, -x) : new Point(x, y);
};
