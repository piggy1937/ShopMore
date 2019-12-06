import React, { createContext } from 'react'

 const ColumnLayoutContext= createContext({
     column:2
  
})
export class ColumnLayoutProvider extends React.Component {
    
    state = {
       column:2
    }

    render() {
        return (
            <ColumnLayoutContext.Provider value={this.state}>
                {this.props.children}
            </ColumnLayoutContext.Provider>
        )
    }
}

// 3. 创建 Consumer
const ColumnLayoutConsumer = ColumnLayoutContext.Consumer
export {ColumnLayoutConsumer,ColumnLayoutContext}

