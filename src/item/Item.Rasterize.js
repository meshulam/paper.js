import { CanvasProvider } from '../canvas/CanvasProvider';
import { Size } from '../basic/Size';
import { Matrix } from '../basic/Matrix';
import { Base } from '../core/Base';
import { Raster } from './Raster'
import { Item } from './Item';

export function injectRasterize(ItemCls) {
    return ItemCls.inject(Rasterize);
}

export const Rasterize = {
    /**
     * Rasterizes the item into a newly created Raster object. The item itself
     * is not removed after rasterization.
     *
     * @param {Number} [resolution=view.resolution] the resolution of the raster
     *     in pixels per inch (DPI). If not specified, the value of
     *     `view.resolution` is used.
     * @param {Boolean} [insert=true] specifies whether the raster should be
     *     inserted into the scene graph. When set to `true`, it is inserted
     *     above the original
     * @return {Raster} the newly created raster item
     *
     * @example {@paperscript}
     * // Rasterizing an item:
     * var circle = new Path.Circle({
     *     center: [50, 50],
     *     radius: 5,
     *     fillColor: 'red'
     * });
     *
     * // Create a rasterized version of the path:
     * var raster = circle.rasterize();
     *
     * // Move it 100pt to the right:
     * raster.position.x += 100;
     *
     * // Scale the path and the raster by 300%, so we can compare them:
     * circle.scale(5);
     * raster.scale(5);
     */
    rasterize: function(resolution, insert) {
        // TODO: Switch to options object for more descriptive call signature.
        var bounds = this.getStrokeBounds(),
            scale = (resolution || this.getView().getResolution()) / 72,
            // Floor top-left corner and ceil bottom-right corner, to never
            // blur or cut pixels.
            topLeft = bounds.getTopLeft().floor(),
            bottomRight = bounds.getBottomRight().ceil(),
            size = new Size(bottomRight.subtract(topLeft)),
            raster = new Raster(Item.NO_INSERT);
        if (!size.isZero()) {
            var canvas = CanvasProvider.getCanvas(size.multiply(scale)),
                ctx = canvas.getContext('2d'),
                matrix = new Matrix().scale(scale).translate(topLeft.negate());
            ctx.save();
            matrix.applyToContext(ctx);
            // See Project#draw() for an explanation of new Base()
            this.draw(ctx, new Base({ matrices: [matrix] }));
            ctx.restore();
            // NOTE: We don't need to release the canvas since it belongs to the
            // raster now!
            raster.setCanvas(canvas);
        }
        raster.transform(new Matrix().translate(topLeft.add(size.divide(2)))
                // Take resolution into account and scale back to original size.
                .scale(1 / scale));
        if (insert === undefined || insert)
            raster.insertAbove(this);
        return raster;
    },

}
