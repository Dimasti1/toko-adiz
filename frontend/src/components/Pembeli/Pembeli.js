import React, { useState, useEffect } from 'react';
import { pembeliAPI } from '../../services/api';

const Pembeli = () => {
  const [pembeli, setPembeli] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPembeli, setEditingPembeli] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nama_pembeli: '',
    alamat: ''
  });

  useEffect(() => {
    loadPembeli();
  }, []);

  const loadPembeli = async () => {
    setLoading(true);
    try {
      const response = await pembeliAPI.getAll();
      setPembeli(response.data);
    } catch (error) {
      console.error('Error loading pembeli:', error);
      alert('Error loading pembeli');
    } finally {
      setLoading(false);
    }
  };

  // pencarian pembeli
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadPembeli();
      return;
    }

    setLoading(true);
    try {
      const response = await pembeliAPI.search(searchTerm);
      setPembeli(response.data);
    } catch (error) {
      console.error('Error searching pembeli:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPembeli) {
        await pembeliAPI.update(editingPembeli.id_pembeli, formData);
        alert('Pembeli berhasil diupdate');
      } else {
        await pembeliAPI.create(formData);
        alert('Pembeli berhasil ditambahkan');
      }
      resetForm();
      loadPembeli();
    } catch (error) {
      alert(error.response?.data?.error || 'Error menyimpan pembeli');
    }
  };

  const handleEdit = (item) => {
    setEditingPembeli(item);
    setFormData({
      nama_pembeli: item.nama_pembeli,
      alamat: item.alamat
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pembeli ini?')) {
      try {
        await pembeliAPI.delete(id);
        alert('Pembeli berhasil dihapus');
        loadPembeli();
      } catch (error) {
        alert('Error menghapus pembeli');
      }
    }
  };

  const resetForm = () => {
    setFormData({ nama_pembeli: '', alamat: '' });
    setEditingPembeli(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Pembeli</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Tambah Pembeli
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Cari nama pembeli..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Cari
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              loadPembeli();
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingPembeli ? 'Edit Pembeli' : 'Tambah Pembeli'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Pembeli</label>
              <input
                type="text"
                required
                value={formData.nama_pembeli}
                onChange={(e) => setFormData({ ...formData, nama_pembeli: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alamat</label>
              <textarea
                required
                rows="3"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editingPembeli ? 'Update' : 'Simpan'}
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
                Nama Pembeli
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alamat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pembeli.map((item) => (
              <tr key={item.id_pembeli}>
                <td className="px-6 py-4 whitespace-nowrap">{item.nama_pembeli}</td>
                <td className="px-6 py-4">{item.alamat}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id_pembeli)}
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
        {pembeli.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data pembeli
          </div>
        )}
      </div>
    </div>
  );
};

export default Pembeli;