import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './Navbar';
import Pagination from './Pagination';
import { useTheme } from './ThemeContext'; // Import useTheme

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
}

function Home() {
  const { isDarkMode } = useTheme(); // Get theme state
  const [data, setData] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
  const [filteredData, setFilteredData] = useState<Coin[]>([]);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
      .then(response => response.json())
      .then((data: Coin[]) => {
        setData(data);
        setFilteredData(data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleSearch = () => {
    if (searchTerm) {
      const filtered = data.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <NavBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
      <div 
        className="container" 
        style={{
          backgroundColor: isDarkMode ? '#121212' : '#f0f2f5',
          color: isDarkMode ? '#fff' : '#000',
          minHeight: '100vh', // Ensure the full page is covered
          padding: '2rem'
        }}
      >
        <h1>Crypto Data</h1>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>Market Cap</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((coin, index) => (
              <tr key={coin.id}>
                <td>{index + 1 + indexOfFirstItem}</td>
                <td><img src={coin.image} width="30" height="30" alt={`${coin.name} logo`} /></td>
                <td><Link to={`/coin/${coin.id}`} style={{ color: isDarkMode ? '#fff' : '#000' }}>{coin.name}</Link></td>
                <td>{coin.current_price}</td>
                <td>{coin.market_cap}</td>
                <td>{coin.total_volume}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}

export default Home;
