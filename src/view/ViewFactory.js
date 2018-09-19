import { View } from './View';
import { CanvasView } from './CanvasView';

export function ViewFactory(project, element) {
    if (document && typeof element === 'string')
        element = document.getElementById(element);
    // Factory to provide the right View subclass for a given element.
    // Produces only CanvasView or View items (for workers) for now:
    var ctor = window ? CanvasView : View;
    return new ctor(project, element);
}
