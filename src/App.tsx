import { Routes, Route } from 'react-router-dom';
import PortfolioRoute from './routes/PortfolioRoute';
import AxiomeRoute from './routes/AxiomeRoute';
import ProcessRoute from './routes/ProcessRoute';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PortfolioRoute />} />
        <Route path="/axiome" element={<AxiomeRoute />} />
        <Route path="/axiome/process" element={<ProcessRoute />} />
      </Routes>
      {/* Custom Cursor stays global */}
      <CustomCursor />
    </>
  );
}

export default App;
