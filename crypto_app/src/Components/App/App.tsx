import React from 'react';
import './App.css';
import Home from '../Home';
import CoinDetail from '../Coindetail/CoinDetail';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import News from '../News/News';

function App() {
  const { isDarkMode } = useTheme();

  return (
    <div 
      style={{
        backgroundColor: isDarkMode ? '#121212' : '#f0f2f5',
        color: isDarkMode ? '#fff' : '#000',
        minHeight: '100vh',
      }}
    >
      <Router>
        
        <Routes>
          <Route path="/" element={<Home />} />  
          <Route path="/coin/:id" element={<CoinDetail />} /> 
          <Route path='/news' element={<News/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;