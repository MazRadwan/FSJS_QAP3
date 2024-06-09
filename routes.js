const fs = require("fs").promises;
const path = require("path");
const myEmitter = require("./logEvents");
const handleError = require("./errorHandler");
const { getNews } = require("./newsService");

const fetchFile = async (filePath, res, data = null) => {
  try {
    let content = await fs.readFile(filePath, "utf-8");
    if (data) {
      const newsList = data
        .map(
          (article) => `
        <div class="news-article">
          <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
          <p><strong>Author:</strong> ${article.author || "Unknown"}</p>
          ${
            article.urlToImage
              ? `<img src="${article.urlToImage}" alt="${article.title}" />`
              : ""
          }
          <p><strong>Published At:</strong> ${new Date(
            article.publishedAt
          ).toLocaleDateString()}</p>
          <p>${article.content || "No content available."}</p>
        </div>
      `
        )
        .join("");
      content = content.replace("{{news}}", newsList);
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
  } catch (error) {
    handleError(error, res);
  }
};

const routes = {
  indexPage: (path, res) => fetchFile(path, res),
  newsPage: async (path, res) => {
    try {
      const newsData = await getNews();
      fetchFile(path, res, newsData);
    } catch (error) {
      handleError(error, res);
    }
  },
  sportsPage: (path, res) => fetchFile(path, res),
  weatherPage: (path, res) => fetchFile(path, res),
  jokesPage: (path, res) => fetchFile(path, res),
};

module.exports = routes;
