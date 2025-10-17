import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { formatRupiah } from '../../utils/format';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTransaksi: 0,
    totalPendapatan: 0,
    barangTerlaris: { nama_barang: 'Belum ada', total_terjual: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Transaksi</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTransaksi}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Pendapatan</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatRupiah(stats.totalPendapatan)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Barang Terlaris</h3>
          <p className="text-xl font-bold text-orange-600">{stats.barangTerlaris.nama_barang}</p>
          <p className="text-sm text-gray-500">Terjual: {stats.barangTerlaris.total_terjual} unit</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;