import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Barang from './components/Barang/Barang';
import Pembeli from './components/Pembeli/Pembeli';
import Transaksi from './components/Transaksi/Transaksi';
import Laporan from './components/Transaksi/Laporan';
import Navigation from './components/Layout/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/barang" element={<Barang />} />
            <Route path="/pembeli" element={<Pembeli />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/laporan" element={<Laporan />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;