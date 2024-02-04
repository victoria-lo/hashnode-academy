// pages/index.js
import React, { useState } from 'react';
import '../../styles/global.css';
import LearningPath from '@/components/LearningPath';
import ClipLoader from "react-spinners/ClipLoader";

const IndexPage = () => {
  const [searchText, setSearchText] = useState('');
  const [pathGenerated, setPathGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  const generateLearningPath = () => {

    setLoading(true);

    // Call the backend API
    fetch(`http://localhost:5000/learning-path?tags=${searchText}`)
      .then(response => response.json())
      .then(data => {
        // Extract and sort articles from the learning path
        const learningPath = data.learning_path;
        let sortedArticles = [];
        ["Beginner", "Novice", "Intermediate", "Advanced", "Expert"].forEach(difficulty => {
          if (learningPath[difficulty] !== "Unavailable") {
            const { title, url, author } = learningPath[difficulty].node;
            sortedArticles.push({ title, url, author: author.name });
          }
        });
        // Update the state with the sorted articles
        setArticles(sortedArticles);
      })
      .catch(error => {
        console.error('Error fetching learning path:', error);
      }).finally(() => {
        setLoading(false);
        setPathGenerated(true);
      });
  };

  return (
    <div className="container">
      <div className="navbar">
        <div style={{ display: "flex" }}>
          <img src="/hashnode-logo.png" alt="Hashnode Logo" />
          <h2>hashnode academy</h2>
        </div>
        <div>
          <a style={{ "marginRight": "30px" }}>Blog</a>
          <a>Features</a>
        </div>

      </div>
      <div className="header">
        <h1>Your Go-To Tech Learning Hub<br />Transforming how you conquer knowledge</h1>
      </div>

      <div className="input-container">
        <div>
          <input
            type="text"
            placeholder="What do you want to learn?"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <button onClick={generateLearningPath}>Generate my learning path!</button>
      </div>
      <div className="loader">
        {loading && <><ClipLoader color="#2962ff" size={150} /><p>Fetching articles from hashnode & generating learning path...</p></>}
      </div>


      {pathGenerated && !loading && <LearningPath articles={articles} />}
    </div>
  );
};

export default IndexPage;
