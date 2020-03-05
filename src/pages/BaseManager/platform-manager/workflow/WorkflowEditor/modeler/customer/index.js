// custom/index.js
import CustomContextPadProvider from './CustomContextPad.js'
import CustomRenderer from './CustomRenderer'
export default {
    __init__: ['contextPadProvider'], //'customRenderer'
    // customRenderer: ['type', CustomRenderer],
    contextPadProvider: ['type', CustomContextPadProvider]
}