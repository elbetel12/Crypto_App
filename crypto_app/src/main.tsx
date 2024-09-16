import ReactDOM from 'react-dom';
import App from './Components/App/App';
import { ThemeProvider } from './ThemeContext'; // Make sure this import is correct

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
