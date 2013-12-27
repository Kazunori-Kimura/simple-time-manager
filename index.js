//index.js
var connect = require("connect"),
    path = require("path");
connect.createServer(
    connect.static(path.join(__dirname, "www"))
).listen(3000);