import Modeler from 'bpmn-js/lib/Modeler';
import {assign, isArray} from 'min-dash';
import inherits from 'inherits';
export default function CustomModeler(options) {
    Modeler.call(this, options);

    this.customElements = [];
}
inherits(CustomModeler, Modeler);