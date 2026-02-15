import { Navigate, Route, Routes } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
import HomePage from './pages/HomePage';

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
