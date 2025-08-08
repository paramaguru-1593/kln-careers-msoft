import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MarketSoftLandingPage from './pages/MarketSoftLandingPage';
import ExternalCampaignLandingPage from './pages/ExternalCampaignLandingPage';
import InternalCampaignLandingPage from './pages/InternalCampaignLandingPage';

function App() {
  return (
    <Router>
      <div className="">
        <Routes>
          {/* Define routes here */}
          <Route path="/" element={<MarketSoftLandingPage />} />
          <Route path="/external-campaign" element={<ExternalCampaignLandingPage />} />
          <Route path="/internal-campaign" element={<InternalCampaignLandingPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
