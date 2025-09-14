import { Routes, Route, HashRouter } from 'react-router-dom';
import { AuthScreen } from './screens/AuthScreen';
import { Dashboard } from './screens/Dashboard';
import { OverlayChat } from './screens/OverlayChat';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overlay" element={<OverlayChat />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
