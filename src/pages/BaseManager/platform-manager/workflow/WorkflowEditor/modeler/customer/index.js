// custom/index.js
import CustomContextPadProvider from './CustomContextPad.js'
import CustomRenderer from './CustomRenderer'
import CustomClickhandle from './CustomClickhandle'
export default {
    __init__: ['contextPadProvider','clickHandler'], //'customRenderer'
    // customRenderer: ['type', CustomRenderer],
    contextPadProvider: ['type', CustomContextPadProvider],
    clickHandler: ['type', CustomClickhandle]
}