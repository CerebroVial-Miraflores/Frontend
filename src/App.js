import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainHeader from './pages/Common/MainHeader';
import ForecastPredictionPanel from './pages/AnalyticsAndReports/ForecastPredictionPanel';
import IntersectionDetails from './pages/IntersectionDetails/IntersectionDetails';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <MainHeader />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<IntersectionDetails />} />
          <Route path="/forecast" element={<ForecastPredictionPanel />} />
        </Routes>
      </main>
    </div>
    </BrowserRouter>
  );
}

export default App;
