import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useTheme } from '../ThemeContext'; 
import './Navbar.css';
interface NavBarProps {
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  onSearch?: () => void;
  showSearch?: boolean; // Add this prop to control the visibility of search
}

const NavBar: React.FC<NavBarProps> = ({ searchTerm, setSearchTerm, onSearch ,showSearch = true}) => {
  const { isDarkMode, toggleTheme } = useTheme(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev); // Toggle menu open state
  };

  return (
    <nav className='navbar' style={{ backgroundColor: isDarkMode ? '#444' : '#ddd',color: isDarkMode ? '#000' : '#fff' }}>
      <a href="/" className="navbar-brand">CoinMarketCap</a>
      <button className="menu-toggle" onClick={toggleMenu} style={{ marginLeft: '10px' ,backgroundColor: isDarkMode ? '#444' : '#ddd' }}>
        {isMenuOpen ? '✖' : '☰'} {/* Change icon based on menu state */}
      </button>
      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}  style={{ backgroundColor: isDarkMode ? '#444' : '#ddd',color: isDarkMode ? '#000' : '#fff' }}>
        <a href="/" >Home</a>
        <a href="/news" >News</a>
        <div className="dropdown">
          <button className="dropbtn" style={{ backgroundColor: isDarkMode ? '#777' : '#ccc' }}>Cryptocurrencies</button>
          <div className="dropdown-content" style={{ backgroundColor: isDarkMode ? '#444' : '#ddd',color: isDarkMode ? '#000' : '#fff' }}>
            <a href="/coin/bitcoin">Bitcoin</a>
            <a href="/coin/ethereum">Ethereum</a>
          </div>
        </div>
      </div>
      {showSearch && (
        <form
          className="search-form"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            onSearch && onSearch(); // Ensure onSearch is defined before calling
          }}
          style={{ display: 'flex', alignItems: 'center' }} // Flex display for alignment
        >
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm && setSearchTerm(e.target.value)
            }
            style={{
              padding: '5px',
              borderRadius: '4px',
              border: isDarkMode ? '1px solid #fff' : '1px solid #000'
            }} // Input styling for theme
          />
          
        </form>
      )}
      {/* Theme toggle button with emoji */}
      <button onClick={toggleTheme} style={{ marginLeft: '10px' }}>
        {isDarkMode ? '☀️' : '🌙'} {/* Button to toggle theme */}
      </button>
    </nav>
  );
};

export default NavBar;
