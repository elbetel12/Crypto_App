import { useState, useEffect } from 'react';
import NavBar from './Navbar/Navbar';
import Pagination from './Pagination/Pagination';
import { useTheme } from './ThemeContext'; 

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_1h: number;  // Add 1-hour change
  price_change_percentage_24h: number; // Add 24-hour change
  price_change_percentage_7d: number;   // Add 7-day change
}

function Home() {
  const { isDarkMode } = useTheme(); // Get theme state
  const [data, setData] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
  const [filteredData, setFilteredData] = useState<Coin[]>([]);
  const [sortCriteria, setSortCriteria] = useState<string>(''); // State to store selected sorting criteria
  const [sortOrder, setSortOrder] = useState<string>('asc'); // State for ascending/descending sorting

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

  const handleSort = (criteria: string) => {
    setSortCriteria(criteria);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order

    const sortedData = [...filteredData].sort((a, b) => {
      let comparison = 0;

      if (criteria === 'price') {
        comparison = a.current_price - b.current_price;
      } else if (criteria === 'marketCap') {
        comparison = a.market_cap - b.market_cap;
      } else if (criteria === 'volume') {
        comparison = a.total_volume - b.total_volume;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredData(sortedData);
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
      <NavBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onSearch={handleSearch} 
        showSearch={true}
      />      

      <div 
        className="container" 
        style={{
          backgroundColor: isDarkMode ? '#121212' : '#f0f2f5',
          color: isDarkMode ? '#fff' : '#000',
          minHeight: '100vh', 
          padding: '2rem'
        }}
      >
        <h1>Crypto Data</h1>
        
        {/* Sorting Controls */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="sort">Sort By: </label>
          <select
            id="sort"
            value={sortCriteria}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="price">Price</option>
            <option value="marketCap">Market Cap</option>
            <option value="volume">Volume</option>
          </select>
          <button onClick={() => handleSort(sortCriteria)}>
            Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

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
              <tr 
                key={coin.id} 
                onClick={() => window.location.href = `/coin/${coin.id}`} 
                style={{ 
                  cursor: 'pointer', 
                  backgroundColor: isDarkMode ? '#2e2e2e' : '#fff',
                  transition: 'background-color 0.3s ease' // Smooth transition
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#444' : '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2e2e2e' : '#fff'}
              >
                <td>{index + 1 + indexOfFirstItem}</td>
                <td><img src={coin.image} width="30" height="30" alt={`${coin.name} logo`} /></td>
                <td>{coin.name}</td>
                <td>{`$${coin.current_price.toLocaleString()}`}</td> 
                <td>{`$${coin.market_cap.toLocaleString()}`}</td>
                <td>{`$${coin.total_volume.toLocaleString()}`}</td>
              
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
