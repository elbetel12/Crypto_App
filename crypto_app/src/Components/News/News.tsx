import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css'; // Importing the CSS file for styles

// Defining the structure of a single news article
interface Article {
  id: string; // Unique identifier for the article
  title: string; // Title of the article
  url: string; // URL to read the full article
  published_on: number; // Timestamp of when the article was published
  source: string; // Source of the article
}

// Defining the expected response structure from the API
interface NewsResponse {
  Data: Article[]; // Array of articles
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]); // State to hold articles
  const [error, setError] = useState<string | null>(null); // State to hold error messages
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status

  const API_URL = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=4633e94a53c014d87e3c55aa387c6fde6145f6a85f4822cb7d1c5f1df2b5a244'; // API endpoint for fetching news

  // useEffect to fetch news articles when the component mounts
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get<NewsResponse>(API_URL);
        setArticles(response.data.Data); // Storing fetched articles in state
      } catch (err) {
        setError('Failed to fetch news articles'); // Setting error message if fetch fails
        console.error(err); // Logging the error to the console
      } finally {
        setLoading(false); // Setting loading to false regardless of success or failure
      }
    };

    fetchNews(); // Invoking the fetchNews function
  }, []); // Empty dependency array to run the effect only on component mount

  return (
    <div className="news-container"> {/* Main container for the news */}
      <h1>Latest News Articles</h1> {/* Title of the news section */}
      {loading && <p>Loading...</p>} {/* Show loading message while loading */}
      {error && <p className="error">{error}</p>} {/* Show error message if there’s an error */}
      <div className="articles"> {/* Container for articles */}
        {articles.map((article) => ( // Iterating over articles to create a card for each
          <div key={article.id} className="article-card"> {/* Article card */}
            <h2>{article.title}</h2> {/* Article title */}
            <p className="date">{new Date(article.published_on * 1000).toLocaleDateString()}</p> {/* Article publication date */}
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a> {/* Link to full article */}
            <p className="source">Source: {article.source}</p> {/* Source of the article */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default News; // Exporting the News component for use in other files
