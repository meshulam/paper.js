import { Point } from './Point';

/**
 * Returns the horizontal and vertical padding that a transformed round
 * stroke adds to the bounding box, by calculating the dimensions of a
 * rotated ellipse.
 */
export function getStrokePadding(radius, matrix) {
    if (!matrix)
        return [radius, radius];
    // If a matrix is provided, we need to rotate the stroke circle
    // and calculate the bounding box of the resulting rotated elipse:
    // Get rotated hor and ver vectors, and determine rotation angle
    // and elipse values from them:
    var hor = new Point(radius, 0).transform(matrix),
        ver = new Point(0, radius).transform(matrix),
        phi = hor.getAngleInRadians(),
        a = hor.getLength(),
        b = ver.getLength();
    // Formula for rotated ellipses:
    // x = cx + a*cos(t)*cos(phi) - b*sin(t)*sin(phi)
    // y = cy + b*sin(t)*cos(phi) + a*cos(t)*sin(phi)
    // Derivates (by Wolfram Alpha):
    // derivative of x = cx + a*cos(t)*cos(phi) - b*sin(t)*sin(phi)
    // dx/dt = a sin(t) cos(phi) + b cos(t) sin(phi) = 0
    // derivative of y = cy + b*sin(t)*cos(phi) + a*cos(t)*sin(phi)
    // dy/dt = b cos(t) cos(phi) - a sin(t) sin(phi) = 0
    // This can be simplified to:
    // tan(t) = -b * tan(phi) / a // x
    // tan(t) =  b * cot(phi) / a // y
    // Solving for t gives:
    // t = pi * n - arctan(b * tan(phi) / a) // x
    // t = pi * n + arctan(b * cot(phi) / a)
    //   = pi * n + arctan(b / tan(phi) / a) // y
    var sin = Math.sin(phi),
        cos = Math.cos(phi),
        tan = Math.tan(phi),
        tx = Math.atan2(b * tan, a),
        ty = Math.atan2(b, tan * a);
    // Due to symetry, we don't need to cycle through pi * n solutions:
    return [Math.abs(a * Math.cos(tx) * cos + b * Math.sin(tx) * sin),
            Math.abs(b * Math.sin(ty) * cos + a * Math.cos(ty) * sin)];
};
