document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.querySelector(".news-cards");

  const fetchNews = async () => {
    try {
      const response = await fetch(
        "https://newsapi.org/v2/top-headlines?country=us&apiKey=7cecf72ce77741969bba4a97e303e0b3"
      );
      const data = await response.json();
      const articles = data.articles;

      articles.forEach((article) => {
        const newsCard = document.createElement("div");
        newsCard.classList.add("news-card");

        const headline = document.createElement("h3");
        const link = document.createElement("a");
        link.href = article.url;
        link.textContent = article.title;
        link.target = "_blank";
        headline.appendChild(link);

        newsCard.appendChild(headline);

        if (article.urlToImage) {
          const image = document.createElement("img");
          image.src = article.urlToImage;
          image.alt = article.title;
          newsCard.appendChild(image);
        }

        const author = document.createElement("p");
        author.textContent = `Author: ${article.author || "Unknown"}`;
        newsCard.appendChild(author);

        const description = document.createElement("p");
        description.textContent =
          article.description || "No description available.";
        newsCard.appendChild(description);

        const publishedAt = document.createElement("p");
        publishedAt.textContent = `Published At: ${new Date(
          article.publishedAt
        ).toLocaleDateString()}`;
        newsCard.appendChild(publishedAt);

        newsContainer.appendChild(newsCard);
      });
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  fetchNews();
});
