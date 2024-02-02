// components/LearningPath.js

import React, { useState } from 'react';
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa6";

const LearningPath = ({articles}) => {
  const [feedback, setFeedback] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedback = (value) => {
    // Allow feedback submission only if it hasn't been submitted yet
    if (!feedbackSubmitted) {
      // Handle the feedback submission here (you can send it to a server, update state, etc.)
      setFeedback(value);
      setFeedbackSubmitted(true);
      alert("Thanks for submitting your feedback!");
    }
  };

  return (
    <div className="learning-path">
    <h2>Learning Path</h2>
    <div style={{position:"relative"}}>
      <ul className="path-container">
        {articles.map((article, index) => (
          <li key={index} className="learning-path-item">
            <a href={article.url} target="_blank" className="learning-path-link">
              <span style={{height:"19px", width:"19px", minHeight:"19px", minWidth:"19px"}}></span>
              <span className="node"></span>
              <span style={{height:"16px", width:"16px", minHeight:"16px", minWidth:"16px"}}></span>
              <div className="article">
                <div className="article-title">{article.title}</div>
                <p className="author-text">{article.author}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <div className="connectors">
      {articles.slice(0, -1).map((index) => (
        <div key={index} className='connector'></div>
      ))}
      </div>
    </div>

    <p style={{color:"#888", fontStyle:"italic"}}>Is the content generated useful?</p>
    <div className="feedback">
    <FaRegThumbsUp className={`thumb-icon${feedbackSubmitted ? ' disabled' : ''}`} onClick={() => handleFeedback('1')}/>
    <FaRegThumbsDown className={`thumb-icon${feedbackSubmitted ? ' disabled' : ''}`} onClick={() => handleFeedback('0')}/> 
    </div>
  </div>
  );
};

export default LearningPath;
