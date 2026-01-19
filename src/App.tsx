import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Language } from './i18n';
import Home from './pages/Home';
import WhatIsWhagons from './pages/WhatIsWhagons';

function App() {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  useEffect(() => {
    // Set dark mode permanently
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Home language={language} toggleLanguage={toggleLanguage} />} 
        />
        <Route 
          path="/what-is-whagons" 
          element={<WhatIsWhagons language={language} toggleLanguage={toggleLanguage} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
