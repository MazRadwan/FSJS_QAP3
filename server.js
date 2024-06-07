// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const routes = require("./routes");
const myEmitter = require("./logEvents");

global.DEBUG = true;

const handleError = (err, res) => {
  let message;
  switch (err.code) {
    case "ENOENT":
      message = "File not found";
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 Not Found</h1>", "utf-8");
      break;
    case "EACCES":
      message = "Permission denied";
      res.writeHead(403, { "Content-Type": "text/html" });
      res.end("<h1>403 Forbidden</h1>", "utf-8");
      break;
    case "ENOSPC":
      message = "No space left on device";
      res.writeHead(507, { "Content-Type": "text/html" });
      res.end("<h1>507 Insufficient Storage</h1>", "utf-8");
      break;
    case "EROFS":
      message = "Read-only file system";
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end("<h1>500 Internal Server Error</h1>", "utf-8");
      break;
    default:
      message = "Server error";
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end("<h1>500 Internal Server Error</h1>", "utf-8");
  }
  myEmitter.emit("errorOccurred", `${message}: ${err.message}`);
};

const server = http.createServer((req, res) => {
  if (DEBUG) console.log("Request Url:", req.url);
  let filePath = path.join(__dirname, "views");
  let routeHandler;

  switch (req.url) {
    case "/":
      filePath = path.join(filePath, "index.html");
      routeHandler = routes.indexPage;
      break;
    case "/about":
      filePath = path.join(filePath, "about.html");
      routeHandler = routes.aboutPage;
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 Not Found</h1>", "utf-8");
      myEmitter.emit("errorOccurred", "404 Not Found");
      return;
  }

  routeHandler(filePath, res);
  myEmitter.emit("routeAccessed", req.url);
});

module.exports = server;
