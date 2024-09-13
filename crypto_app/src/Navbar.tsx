import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useTheme } from './ThemeContext'; // Import useTheme

interface NavBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ searchTerm, setSearchTerm, onSearch }) => {
  const { isDarkMode, toggleTheme } = useTheme(); // Get theme state
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev); // Toggle menu open state
  };

  return (
    <nav className='navbar' style={{ backgroundColor: isDarkMode ? '#444' : '#ddd', color: isDarkMode ? '#fff' : '#000' }}>
      <a href="/" className="navbar-brand">CoinMarketCap</a>
      <button className="menu-toggle" onClick={toggleMenu} style={{ marginLeft: '10px' }}>
        {isMenuOpen ? '✖' : '☰'} {/* Change icon based on menu state */}
      </button>
      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
        <a href="/" style={{ color: isDarkMode ? '#fff' : '#000' }}>Home</a>
        <a href="/news" style={{ color: isDarkMode ? '#fff' : '#000' }}>News</a>
        <div className="dropdown">
          <button className="dropbtn" style={{ backgroundColor: isDarkMode ? '#666' : '#ccc' }}>Cryptocurrencies</button>
          <div className="dropdown-content">
            <a href="/coin/bitcoin">Bitcoin</a>
            <a href="/coin/ethereum">Ethereum</a>
          </div>
        </div>
      </div>
      <form
        className="search-form"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          onSearch();
        }}
        style={{ display: 'flex', alignItems: 'center' }} // Added flex display for better alignment
      >
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          style={{
            padding: '5px',
            borderRadius: '4px',
            border: isDarkMode ? '1px solid #fff' : '1px solid #000'
          }} // Adjusted input styling for theme
        />
        <button type="submit" className='submit' style={{ marginLeft: '10px' }}>
          Submit
        </button>
      </form>
      {/* Theme toggle button with emoji */}
      <button onClick={toggleTheme} style={{ marginLeft: '10px' }}>
        {isDarkMode ? '☀️' : '🌙'} {/* Button to toggle theme */}
      </button>
    </nav>
  );
};

export default NavBar;
