import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthScreen } from './screens/AuthScreen';
import { Dashboard } from './screens/Dashboard';
import { OverlayChat } from './screens/OverlayChat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overlay" element={<OverlayChat />} />
      </Routes>
    </Router>
  );
}

export default App;
