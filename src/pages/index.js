// pages/index.js
import React, { useState } from 'react';
import Select from 'react-select';
import LearningPath from '../components/LearningPath';
import '../../styles/global.css';

const options = [{ value: 'GraphQL', label: 'GraphQL' }];

const IndexPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [pathGenerated, setPathGenerated] = useState(false);

  const generateLearningPath = () => {
    // Implement your logic for generating the learning path
    // For now, let's just log the selected option
    setPathGenerated(true);
    console.log(selectedOption);
  };

  return (
    <div className="container">
      <div className="header">
      <img src="/hashnode-logo.png" alt="Hashnode Logo" className="logo" />
      <h1>hashnode academy</h1>
      </div>
      
      <div className="input-container">
      <div className="header"><span style={{marginRight:"10px"}}>I want to learn</span>
        <Select
          options={options}
          value={selectedOption}
          onChange={(value) => setSelectedOption(value)}
        /></div>
        
        {selectedOption&&<button onClick={generateLearningPath}>Generate my learning path!</button>}
      </div>
      {pathGenerated && <LearningPath />}
    </div>
  );
};

export default IndexPage;
