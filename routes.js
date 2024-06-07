const fs = require("fs").promises;
const path = require("path");
const myEmitter = require("./logEvents");

const fetchFile = async (filePath, res) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
    myEmitter.emit("routeAccessed", filePath);
  } catch (error) {
    myEmitter.emit("errorOccurred", error.message);
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end("<h1>500 Internal Server Error</h1>");
  }
};

const routes = {
  indexPage: (path, res) => fetchFile(path, res),
  aboutPage: (path, res) => fetchFile(path, res),
};

module.exports = routes;
