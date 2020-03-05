/* config-overrides.js */
const path = require('path');
const { injectBabelPlugin } = require('react-app-rewired');
const { getLessVars } = require('antd-theme-generator');
// const rewireLessModules = require('react-app-rewire-less')
const rewireLessModules = require('react-app-rewire-less-modules')
//const rewireCssModules = require('react-app-rewire-css-modules');
function resolve (dir) {
    return path.join(__dirname, '.', dir)
}
module.exports = function override(config, env) {
    //do stuff with the webpack config...

    // config =>{
    //     config.output.publicPath ='/' 
    // }
    //按需加载
    config = injectBabelPlugin(
        ['import', { libraryName: 'antd', style: true }],
        config
    );
 
     
    

    //配置别名
    config.resolve.alias = {
        '@': resolve('src')
    }
    
    //  config.devtool = false; // 关掉 sourceMap 
    //启用ES7的修改器语法（babel 7）
    config = injectBabelPlugin(['@babel/plugin-proposal-decorators', { "legacy": true }], config)
    // //css模块化
    // config = rewireCssModules(config, env);
    //配置antd主题
    config = rewireLessModules.withLoaderOptions({
        modifyVars: getLessVars(path.join(__dirname, './src/styles/vars.less')),
        javascriptEnabled: true
    })(config, env);
  
    return config;
}
