const fetch = require("node-fetch");

const getNews = async () => {
  const response = await fetch(
    "https://newsapi.org/v2/top-headlines?country=us&apiKey=7cecf72ce77741969bba4a97e303e0b3"
  );
  const data = await response.json();
  return data.articles;
};

module.exports = { getNews };
