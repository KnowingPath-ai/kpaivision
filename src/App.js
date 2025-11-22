import React, { useState } from 'react';
import './App.css';
import VisionAnalyzer from './components/VisionAnalyzer';
import About from './components/About';

function App() {
  const [currentPage, setCurrentPage] = useState('analyzer');

  return (
    <div className="App">
      {currentPage === 'analyzer' ? (
        <VisionAnalyzer onShowAbout={() => setCurrentPage('about')} />
      ) : (
        <About onBack={() => setCurrentPage('analyzer')} />
      )}
    </div>
  );
}

export default App;