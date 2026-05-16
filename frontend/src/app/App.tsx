import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ScanResults } from './components/ScanResults';
import { Export } from './components/Export';

export default function App() {
  return (
    <BrowserRouter>
      <div className="size-full flex bg-white">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan-results" element={<ScanResults />} />
            <Route path="/export" element={<Export />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}