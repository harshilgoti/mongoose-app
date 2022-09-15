const express = require("express");
const app = express();
const http = require("http");
const { port } = require("./config");

const { expressLoader, mongooseLoader } = require("./loader");
let secureServer = http.createServer(app);

mongooseLoader();

expressLoader(app);

secureServer.listen(port, (err) => {

  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`
      ################################################
      🛡️  Server listening on port: ${port} 🛡️ 
      ################################################
    `);
});
