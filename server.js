const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

global.DEBUG = true; // Set global DEBUG variable

// Helper function to create log directory path
const getLogFilePath = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const dirPath = path.join(__dirname, "logs", year.toString(), month);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return path.join(dirPath, `${day}.log`);
};

// Log function to log to console and file
const logEvent = (message) => {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  if (global.DEBUG) {
    console.log(logMessage); // Use console.log for debugging
  }

  const logFilePath = getLogFilePath();
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) throw err;
  });
};

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

myEmitter.on("routeAccessed", (route) => logEvent(`Route accessed: ${route}`));
myEmitter.on("errorOccurred", (error) => logEvent(`Error: ${error}`));

const server = http.createServer((req, res) => {
  try {
    let filePath = path.join(
      __dirname,
      "views",
      (req.url === "/" ? "index" : req.url.slice(1)) + ".html"
    );
    let contentType = "text/html";

    fs.readFile(filePath, (err, content) => {
      if (err) {
        handleError(err, res);
      } else {
        myEmitter.emit("routeAccessed", req.url);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = server;
