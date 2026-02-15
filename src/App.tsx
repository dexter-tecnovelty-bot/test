import { Navigate, Route, Routes } from 'react-router-dom';

const HomePage = () => (
  <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
    <section className="text-center">
      <h1 className="text-3xl font-bold text-slate-900">Vite + React 18 + TypeScript</h1>
      <p className="mt-4 text-base text-slate-600">Project bootstrap complete.</p>
    </section>
  </main>
);

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
