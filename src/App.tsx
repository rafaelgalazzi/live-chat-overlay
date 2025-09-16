import { Routes, Route, HashRouter } from 'react-router-dom';
import { Dashboard } from './screens/Dashboard';
import { OverlayChat } from './screens/OverlayChat';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/overlay" element={<OverlayChat />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
