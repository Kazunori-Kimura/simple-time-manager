//index.js
var connect = require("connect"),
    path = require("path");

var port = 3000;

console.log("localhost:%d listen...", port);

connect.createServer(
    connect.static(path.join(__dirname, "www"))
).listen(port);