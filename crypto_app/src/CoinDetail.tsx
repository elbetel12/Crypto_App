import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CoinDetail.css' ;
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    backgroundColor: string;
    tension: number;  // New property for smoother lines
  }[];
}

function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [timeFrame, setTimeFrame] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
          params: {
            vs_currency: 'usd',
            ids: id,
          },
        });
        setCoin(response.data[0]);
      } catch (err) {
        console.error('Error fetching coin data:', err);
      }
    };

    const fetchChartData = async () => {
        setIsLoading(true);
        try {
          let interval = 'daily'; // Default interval
      
          if (timeFrame === 7) {
            interval = 'hourly';  // Use hourly data for shorter timeframes
          } else if (timeFrame === 1825) {
            interval = 'monthly'; // Use monthly data for long timeframes like 5 years
          }
      
          const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
            params: {
              vs_currency: 'usd',
              days: timeFrame,
              interval: interval, // Specify interval here
            },
          });
      
          const data = response.data.prices;
      
          setChartData({
            labels: data.map((item: [number, number]) => new Date(item[0]).toLocaleDateString()),
            datasets: [
              {
                label: 'Price',
                data: data.map((item: [number, number]) => item[1]),
                fill: true,
                borderColor: '#1e88e5',
                backgroundColor: 'rgba(30, 136, 229, 0.2)',
                tension: 0.4,
              },
            ],
          });
        } catch (err) {
          console.error('Error fetching chart data:', err);
        } finally {
          setIsLoading(false);
        }
      };
      

    fetchCoinData();
    fetchChartData();
  }, [id, timeFrame]);

  const handleTimeFrameChange = (days: number) => {
    setTimeFrame(days);
  };

  if (!coin || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="coin-detail-container">
      <h1>{coin.name}</h1>
      <img src={coin.image} alt={`${coin.name} logo`} width="100" height="100" />
      <p><strong>Symbol:</strong> {coin.symbol}</p>
      <p><strong>Current Price:</strong> ${coin.current_price}</p>
      <p><strong>Market Cap:</strong> ${coin.market_cap}</p>
      <p><strong>Total Volume:</strong> ${coin.total_volume}</p>
      <p><strong>24h High:</strong> ${coin.high_24h}</p>
      <p><strong>24h Low:</strong> ${coin.low_24h}</p>

      <div className="time-frame-buttons">
        <button onClick={() => handleTimeFrameChange(7)}>Week</button>
        <button onClick={() => handleTimeFrameChange(30)}>Month</button>
        <button onClick={() => handleTimeFrameChange(1825)}>Year (5 Years)</button>
      </div>

      <div className="chart">
        <h2 className="chart-title">Price Chart</h2>
        <Line
          key={timeFrame}
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#333',
                  font: {
                    size: 14
                  }
                },
              },
              tooltip: {
                backgroundColor: '#333',
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
                boxPadding: 5,
              },
              title: { display: false },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#555', font: { size: 12 } },
              },
              y: {
                grid: { color: '#ccc' },
                ticks: { color: '#555', font: { size: 12 } },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default CoinDetail;
