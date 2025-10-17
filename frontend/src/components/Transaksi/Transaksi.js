import React, { useState, useEffect } from 'react';
import { transaksiAPI, barangAPI, pembeliAPI } from '../../services/api';
import { format } from 'date-fns';
import { formatRupiah } from '../../utils/format';

const Transaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [barang, setBarang] = useState([]);
  const [pembeli, setPembeli] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id_pembeli: '',
    id_barang: '',
    jumlah: '',
    tanggal: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    loadTransaksi();
    loadBarang();
    loadPembeli();
  }, []);

  const loadTransaksi = async () => {
    setLoading(true);
    try {
      const response = await transaksiAPI.getAll();
      setTransaksi(response.data);
    } catch (error) {
      console.error('Error loading transaksi:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBarang = async () => {
    try {
      const response = await barangAPI.getAll();
      setBarang(response.data);
    } catch (error) {
      console.error('Error loading barang:', error);
    }
  };

  const loadPembeli = async () => {
    try {
      const response = await pembeliAPI.getAll();
      setPembeli(response.data);
    } catch (error) {
      console.error('Error loading pembeli:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transaksiAPI.create(formData);
      alert('Transaksi berhasil dibuat');
      resetForm();
      loadTransaksi();
      loadBarang(); // Reload barang untuk update stok
    } catch (error) {
      alert(error.response?.data?.error || 'Error membuat transaksi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await transaksiAPI.delete(id);
        alert('Transaksi berhasil dihapus');
        loadTransaksi();
        loadBarang(); // Reload barang untuk update stok
      } catch (error) {
        alert('Error menghapus transaksi');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_pembeli: '',
      id_barang: '',
      jumlah: '',
      tanggal: format(new Date(), 'yyyy-MM-dd')
    });
    setShowForm(false);
  };

  const getBarangInfo = (id_barang) => {
    return barang.find(b => b.id_barang === id_barang) || {};
  };

  const getPembeliInfo = (id_pembeli) => {
    return pembeli.find(p => p.id_pembeli === id_pembeli) || {};
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Transaksi</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Transaksi Baru
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Transaksi Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pembeli</label>
              <select
                required
                value={formData.id_pembeli}
                onChange={(e) => setFormData({ ...formData, id_pembeli: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Pilih Pembeli</option>
                {pembeli.map((p) => (
                  <option key={p.id_pembeli} value={p.id_pembeli}>
                    {p.nama_pembeli}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Barang</label>
              
              <select
                required
                value={formData.id_barang}
                onChange={(e) => setFormData({ ...formData, id_barang: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Pilih Barang</option>
                {barang.map((b) => (
                  <option key={b.id_barang} value={b.id_barang} disabled={b.stok <= 0}>
                    {b.nama_barang} - {formatRupiah(b.harga)} (Stok: {b.stok})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah</label>
              <input
                type="number"
                required
                min="1"
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal</label>
              <input
                type="date"
                required
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Simpan Transaksi
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pembeli
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Barang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Harga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transaksi.map((item) => (
              <tr key={item.id_transaksi}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(item.tanggal), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.nama_pembeli}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.nama_barang}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.jumlah}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                {formatRupiah(item.total_harga)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(item.id_transaksi)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaksi;