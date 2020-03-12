import Modeler from 'bpmn-js/lib/Modeler';
import {assign, isArray} from 'min-dash';
import inherits from 'inherits';
import CustomModule from './customer'
export default function CustomModeler(options) {
    Modeler.call(this, options);

    this.customElements = [];
}
inherits(CustomModeler, Modeler);
CustomModeler.prototype._modules = [].concat(
    CustomModeler.prototype._modules, [
        CustomModule
    ]
)
CustomModeler.$inject = ['contectService'];
