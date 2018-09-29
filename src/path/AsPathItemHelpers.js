import { Path } from '../path/Path';

export function injectAsPathItemHelpers(ShapeCls) {
  ShapeCls.inject({
    toPath: function (insert) {
        return Path.fromShape(this, insert);
    },
  });

}
