const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("7cecf72ce77741969bba4a97e303e0b3"); // Replace 'YOUR_API_KEY' with your actual API key

const getNews = async () => {
  try {
    const response = await newsapi.v2.topHeadlines({
      country: "ca",
      category: "general",
      pageSize: 10,
    });
    console.log(response); // Log the entire response to inspect it
    return response.articles.map((article) => ({
      title: article.title || "No title available",
      author: article.author || "Unknown author",
      urlToImage: article.urlToImage || "path/to/default-image.jpg",
      publishedAt: article.publishedAt || "Unknown date",
      content: article.content || "No content available",
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

module.exports = { getNews };
