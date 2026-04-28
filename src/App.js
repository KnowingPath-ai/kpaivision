import React, { useState } from 'react';
import './App.css';
import VisionAnalyzer from './components/VisionAnalyzer';
import About from './components/About';
import SafetyMonitor from './components/SafetyMonitor';
import HowItWorks from './components/HowItWorks';
import { SmolVLMModelProvider } from './context/SmolVLMModelContext';

function App() {
  const [currentPage, setCurrentPage] = useState('analyzer');

  return (
    <SmolVLMModelProvider>
      <div className="App">
        {currentPage === 'analyzer' && (
          <VisionAnalyzer
            onShowAbout={() => setCurrentPage('about')}
            onShowSafety={() => setCurrentPage('safety')}
            onShowHowItWorks={() => setCurrentPage('howItWorks')}
          />
        )}
        {currentPage === 'about' && (
          <About onBack={() => setCurrentPage('analyzer')} />
        )}
        {currentPage === 'safety' && (
          <SafetyMonitor onBack={() => setCurrentPage('analyzer')} />
        )}
        {currentPage === 'howItWorks' && (
          <HowItWorks onBack={() => setCurrentPage('analyzer')} />
        )}
      </div>
    </SmolVLMModelProvider>
  );
}

export default App;
