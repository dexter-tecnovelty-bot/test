import { Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AuthCallback from './pages/AuthCallback';
import HomePage from './pages/HomePage';

const App = () => (
  <ErrorBoundary>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </ErrorBoundary>
);

export default App;
