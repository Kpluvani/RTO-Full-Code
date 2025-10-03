import Layout from './CommonPages/Layout';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './App.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Optional: Set default timezone globally
dayjs.tz.setDefault('Asia/Kolkata');

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
          <Layout />
      </BrowserRouter>
    </Provider>
  )
}

export default App;
