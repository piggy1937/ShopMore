const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/api", {
      target: "http://localhost:8080/",
      changeOrigin: true, // needed for virtual hosted sites
      ws: true, // proxy websockets
      pathRewrite: {
        "^/api": ""
      }
    }),
    // proxy("/upload", {
    //     target: "http://localhost:8080/",
    //     changeOrigin: true, // needed for virtual hosted sites
    //     ws: true, // proxy websockets
    //     pathRewrite: {
    //       "^/upload": "/upload"
    //     }
    //   })
  );
};