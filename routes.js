const fs = require("fs").promises;
const path = require("path");
const myEmitter = require("./logEvents");
const handleError = require("./errorHandler");

const fetchFile = async (filePath, res, data = null) => {
  try {
    let content = await fs.readFile(filePath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
  } catch (error) {
    handleError(error, res);
  }
};

const routes = {
  indexPage: (filePath, res) => fetchFile(filePath, res),
  newsPage: (filePath, res) => fetchFile(filePath, res),
  sportsPage: (filePath, res) => fetchFile(filePath, res),
  weatherPage: (filePath, res) => fetchFile(filePath, res),
  jokesPage: (filePath, res) => fetchFile(filePath, res),
};

module.exports = routes;
