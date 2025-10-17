import React, { useState, useEffect } from 'react';
import { formatRupiah } from '../../utils/format';
import { barangAPI } from '../../services/api';

const Barang = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBarang, setEditingBarang] = useState(null);
  const [formData, setFormData] = useState({
    nama_barang: '',
    harga: '',
    stok: ''
  });

  //READ - menampilkan data barang
  useEffect(() => {
    loadBarang();
  }, []);

  const loadBarang = async () => {
    setLoading(true);
    try {
      const response = await barangAPI.getAll();
      setBarang(response.data);
    } catch (error) {
      console.error('Error loading barang:', error);
      alert('Error loading barang');
    } finally {
      setLoading(false);
    }
  };

  //create & update - form handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBarang) {
        await barangAPI.update(editingBarang.id_barang, formData);
        alert('Barang berhasil diupdate');
      } else {
        await barangAPI.create(formData);
        alert('Barang berhasil ditambahkan');
      }
      resetForm();
      loadBarang();
    } catch (error) {
      alert(error.response?.data?.error || 'Error menyimpan barang');
    }
  };

  const handleEdit = (item) => {
    setEditingBarang(item);
    setFormData({
      nama_barang: item.nama_barang,
      harga: item.harga,
      stok: item.stok
    });
    setShowForm(true);
  };

  //delete - hapus barang
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      try {
        await barangAPI.delete(id);
        alert('Barang berhasil dihapus');
        loadBarang();
      } catch (error) {
        alert('Error menghapus barang');
      }
    }
  };

  const resetForm = () => {
    setFormData({ nama_barang: '', harga: '', stok: '' });
    setEditingBarang(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Barang</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Tambah Barang
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingBarang ? 'Edit Barang' : 'Tambah Barang'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
              <input
                type="text"
                required
                value={formData.nama_barang}
                onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga</label>
              <input
                type="number"
                required
                min="0"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stok</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stok}
                onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editingBarang ? 'Update' : 'Simpan'}
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
                Nama Barang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {barang.map((item) => (
              <tr key={item.id_barang}>
                <td className="px-6 py-4 whitespace-nowrap">{item.nama_barang}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                {formatRupiah(item.harga)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.stok}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id_barang)}
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

export default Barang;