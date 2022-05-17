const fs = require("fs");
module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  // productionSourceMap: false,
  devServer: {
    open: process.platform === "darwin",

    proxy: {
      "/hub": {
        target: "https://alpha.iaa.international",
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "": "",
        },
        logLevel: "debug",
        headers: {
          cookie:
            "Metrica.Auth=wyJgeks0xm%2BVUMR1U%2BIKb0VeDOg8i7JN44uy7B%2Fofq3sVp4UDELp3zyAcvmq9rd7F2OUE39i8uFEwxQSUktHRaSfzJ5M67wOZt0lc13xg2zqSirxuYSUVh6v3yR6XguWymuFftGivstFBU9Gv%2BvWjv7HZ1GVuCNF1gb9QWydsNe3lY0ZQxSwTAMcWYXqhZ8DIV8k0oc1zcU7BMXLEig8teayRavWJnNBjjoBX9%2BDpO5H6EzJrIBPYYx7BhROl4AxjJDN0Hh1UzMhq1QhFBE6pQ%3D%3D",
        },
        onProxyReq: function (request) {
          request.setHeader("origin", "https://localhost:8080");
        },
      },
      "": {
        target: "https://alpha.iaa.international/",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "": "",
        },
        headers: {
          cookie:
            "Metrica.Auth=wyJgeks0xm%2BVUMR1U%2BIKb0VeDOg8i7JN44uy7B%2Fofq3sVp4UDELp3zyAcvmq9rd7F2OUE39i8uFEwxQSUktHRaSfzJ5M67wOZt0lc13xg2zqSirxuYSUVh6v3yR6XguWymuFftGivstFBU9Gv%2BvWjv7HZ1GVuCNF1gb9QWydsNe3lY0ZQxSwTAMcWYXqhZ8DIV8k0oc1zcU7BMXLEig8teayRavWJnNBjjoBX9%2BDpO5H6EzJrIBPYYx7BhROl4AxjJDN0Hh1UzMhq1QhFBE6pQ%3D%3D",
        },
        onProxyReq: function (request) {
          request.setHeader("origin", "https://localhost:8080");
        },
        logLevel: "debug",
      },
    },
    host: "localhost",
    port: 8080, // CHANGE YOUR PORT HERE!
    https: {
      key: fs.readFileSync("./wild.metrica.cloud.key"),
      cert: fs.readFileSync("./wild.metrica.cloud.crt"),
    },
    hotOnly: false,
  },
};
