const baseURL = "http://172.17.25.120:8055"; // Directus API base URL

async function loadNewsArticles() {
  try {
    const res = await fetch(`${baseURL}/items/news_articles?fields=title,published_date,content,image.directus_files_id.id,image.id&sort=-published_date`);
    const { data } = await res.json();

    const newsList = document.querySelector(".news-list");

    data.forEach(article => {
      const articleElement = document.createElement("article");
      articleElement.classList.add("news-article");
      articleElement.setAttribute("onclick", "toggleNewsImage(this)");

      // Use explicit imageUrl variable for each news article
      const imageUrl = article.image && (article.image.directus_files_id?.id || article.image.id)
        ? `http://172.17.25.120:8055/assets/${article.image.directus_files_id?.id || article.image.id}`
        : "https://via.placeholder.com/600x400?text=No+Image"; // Fallback image

      articleElement.innerHTML = `
        <img class="news-image" src="${imageUrl}" alt="News Photo">
        <div class="news-content">
          <h3>${article.title || "Untitled Article"}</h3>
          <p><strong>Published:</strong> ${article.published_date
            ? new Date(article.published_date).toLocaleString('en-US', { month: 'long', year: 'numeric' })
            : "Unknown Date"}</p>
          <p>${article.content || "No content available."}</p>
        </div>
      `;

      newsList.appendChild(articleElement);
    });
  } catch (error) {
    console.error("Error fetching news articles:", error);
  }
}

loadNewsArticles();