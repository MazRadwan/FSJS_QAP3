const http = require("http");
const path = require("path");
const fs = require("fs");
const routes = require("./routes");
const myEmitter = require("./logEvents");
const handleError = require("./errorHandler");

global.DEBUG = true;

// Helper function to serve static files
const serveStaticFile = (filePath, res) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      handleError(err, res);
      return;
    }

    const extname = path.extname(filePath);
    let contentType = "text/html";

    switch (extname) {
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".png":
        contentType = "image/png";
        break;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content, "utf-8");
  });
};

const server = http.createServer((req, res) => {
  if (DEBUG) console.log("Request Url:", req.url);
  let filePath = path.join(__dirname, "views");
  let routeHandler;

  // Serve static files from root, /assets, /styles, /scripts
  if (req.url === "/index.js") {
    serveStaticFile(path.join(__dirname, req.url), res);
    return;
  } else if (req.url.startsWith("/assets")) {
    serveStaticFile(path.join(__dirname, req.url), res);
    return;
  } else if (req.url.startsWith("/styles")) {
    serveStaticFile(path.join(__dirname, req.url), res);
    return;
  } else if (req.url.startsWith("/scripts")) {
    serveStaticFile(path.join(__dirname, req.url), res);
    return;
  }

  switch (req.url) {
    case "/":
      filePath = path.join(filePath, "index.html");
      routeHandler = routes.indexPage;
      break;
    case "/news":
      filePath = path.join(filePath, "news.html");
      routeHandler = routes.newsPage;
      break;
    case "/sports":
      filePath = path.join(filePath, "sports.html");
      routeHandler = routes.sportsPage;
      break;
    case "/weather":
      filePath = path.join(filePath, "weather.html");
      routeHandler = routes.weatherPage;
      break;
    case "/jokes":
      filePath = path.join(filePath, "jokes.html");
      routeHandler = routes.jokesPage;
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

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = server;
