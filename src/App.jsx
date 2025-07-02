import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MarketSoftLandingPage from './pages/MarketSoftLandingPage';

function App() {
  return (
    <Router>
      <div className="">
        <Routes>
          {/* Define routes here */}
          <Route path="/" element={<MarketSoftLandingPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
