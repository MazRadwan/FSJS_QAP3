const http = require("http");
const path = require("path");
const fs = require("fs");
const routes = require("./routes");
const myEmitter = require("./logEvents");
const handleError = require("./errorHandler");
const sportsService = require("./sportsService");
const newsService = require("./newsService");

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

  if (req.url.startsWith("/api/news")) {
    console.log("Fetching News Data...");

    newsService
      .getNews()
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      })
      .catch((err) => {
        console.error("Error fetching news data:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch news data" }));
      });
    return;
  }

  // API routes for sports data
  if (req.url.startsWith("/api/sports/mlb")) {
    console.log("Fetching MLB Data..."); // Log when fetching data

    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

    sportsService.fetchMLBData(currentDate, (data) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    });
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
