// pages/index.js
import React, { useState } from 'react';
import '../../styles/global.css';
import LearningPath from '@/components/LearningPath';

const IndexPage = () => {
  const [searchText, setSearchText] = useState('');
  const [pathGenerated, setPathGenerated] = useState(false);

  const generateLearningPath = () => {
    // Implement your logic for generating the learning path
    // For now, let's just log the selected option
    setPathGenerated(true);
    console.log(searchText);
  };

  return (
    <div className="container">
      <div className="navbar">
        <div style={{display:"flex"}}>
        <img src="/hashnode-logo.png" alt="Hashnode Logo" />
        <h2>hashnode academy</h2>
        </div>
        <div>
          <a style={{"marginRight":"30px"}}>Blog</a>
          <a>Features</a>
        </div>
        
      </div>
      <div className="header">
        <h1>Your Go-To Tech Learning Hub<br/>Tranforming how you conquer knowledge</h1>
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

      {pathGenerated && <LearningPath />}
    </div>
  );
};

export default IndexPage;
