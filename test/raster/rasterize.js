function rasterize(item, resolution, insert) {
    // TODO: Switch to options object for more descriptive call signature.
    var bounds = item.getStrokeBounds(),
        scale = (resolution || 72) / 72,
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
        item.draw(ctx, new Base({ matrices: [matrix] }));
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
}
