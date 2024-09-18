import ReactDOM from 'react-dom';
import App from './Components/App/App';
import { ThemeProvider } from './Components/ThemeContext'; 

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
