import { Item } from '../item/Item';
import { Shape } from '../item/Shape';
import { Path } from '../path/Path';

export function injectAsPathItemHelpers() {
  Item.inject({
    // Internal helper function, used at the moment for intersects check only.
    // TODO: Move #getIntersections() to Item, make it handle all type of items
    // through _asPathItem(), and support Group items as well, taking nested
    // matrices into account properly!
    _asPathItem: function () {
      // Creates a temporary rectangular path item with this item's bounds.
      return new Path.Rectangle({
        rectangle: this.getInternalBounds(),
        matrix: this._matrix,
        insert: false,
      });
    },
  });

  Shape.inject({
    toPath: function (insert) {
        return Path.fromShape(this, insert);
    },
  });

}
