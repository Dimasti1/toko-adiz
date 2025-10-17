import React, { useState, useEffect } from 'react';
import { transaksiAPI } from '../../services/api';
import { format, subDays, parseISO } from 'date-fns';
import { formatRupiah, formatNumber } from '../../utils/format';
import { exportToPDF, exportSimplePDF } from '../../services/pdfExport';

const Laporan = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [filteredTransaksi, setFilteredTransaksi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    loadTransaksi();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transaksi, filters]);

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

  //filter
  const applyFilters = () => {
    if (transaksi.length === 0) return;

    const filtered = transaksi.filter(item => {
      const transaksiDateStr = item.tanggal;
      const startDateStr = filters.startDate;
      const endDateStr = filters.endDate;
      
      return transaksiDateStr >= startDateStr && transaksiDateStr <= endDateStr;
    });
    
    filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    setFilteredTransaksi(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    return filteredTransaksi.reduce((total, item) => {
      const itemTotal = parseFloat(item.total_harga) || 0;
      return total + itemTotal;
    }, 0);
  };

  const handleExportPDF = async () => {
    if (filteredTransaksi.length === 0) {
      alert('Tidak ada data untuk diexport');
      return;
    }

    setExporting(true);
    
    try {
      console.log('Starting PDF export process...');
      
      // Validasi data sebelum export
      const validData = filteredTransaksi.map(item => ({
        ...item,
        id_transaksi: item.id_transaksi || 0,
        tanggal: item.tanggal || new Date().toISOString().split('T')[0],
        nama_pembeli: item.nama_pembeli || 'Tidak ada nama',
        nama_barang: item.nama_barang || 'Tidak ada barang',
        jumlah: item.jumlah || 0,
        total_harga: item.total_harga || 0
      }));

      console.log('Validated data for export:', validData);

      // Tunggu sebentar untuk memastikan state updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Gunakan export yang sesuai berdasarkan jumlah data
      let success = false;
      if (validData.length > 20) {
        success = await exportSimplePDF(validData, filters, calculateTotal());
      } else {
        success = await exportToPDF(validData, filters, calculateTotal());
      }
      
      if (success) {
        console.log('PDF export successful');
      } else {
        throw new Error('Export gagal tanpa error detail');
      }
      
    } catch (error) {
      console.error('Detailed PDF export error:', error);
      alert(`Terjadi error saat mengexport PDF: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const printLaporan = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Laporan Transaksi</h1>
        <div className="space-x-2">
          <button
            onClick={handleExportPDF}
            disabled={exporting || filteredTransaksi.length === 0}
            className={`px-4 py-2 rounded-md no-print flex items-center ${
              exporting || filteredTransaksi.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Membuat PDF...
              </>
            ) : (
              'Export PDF'
            )}
          </button>
          {/* <button
            onClick={printLaporan}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 no-print"
          >
            Cetak
          </button> */}
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 no-print">
        <h2 className="text-lg font-semibold mb-4">Filter Laporan</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
            >
              Terapkan Filter
            </button>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded w-full">
              <strong>{filteredTransaksi.length}</strong> transaksi ditemukan
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Periode Laporan</h3>
            <p className="text-xl font-medium">
              {format(parseISO(filters.startDate), 'dd/MM/yyyy')} - {format(parseISO(filters.endDate), 'dd/MM/yyyy')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Jumlah Transaksi</h3>
            <p className="text-2xl font-bold text-blue-600">
              {filteredTransaksi.length}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Total Pendapatan</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatRupiah(calculateTotal())}
            </p>
          </div>
        </div>
      </div>

      {/* Laporan Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden print:shadow-none">
        {filteredTransaksi.length > 0 ? (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Transaksi
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransaksi.map((item, index) => (
                  <tr key={item.id_transaksi} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(parseISO(item.tanggal), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      TRX-{item.id_transaksi.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.nama_pembeli}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.nama_barang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {formatNumber(item.jumlah)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatRupiah(item.total_harga)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Footer dengan total */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Pendapatan:</span>
                <span className="font-bold text-green-600 text-lg">
                  {formatRupiah(calculateTotal())}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Memuat data...</span>
              </div>
            ) : (
              <div>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m0 0V9m0 8h6m-6 0H7m12 0v-2m0 0V9m0 8h2M7 17v-2m0 0V9m0 8H5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada transaksi</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tidak ada data transaksi untuk periode {format(parseISO(filters.startDate), 'dd/MM/yyyy')} - {format(parseISO(filters.endDate), 'dd/MM/yyyy')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Export Info */}
      {filteredTransaksi.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg no-print">
          <p className="text-sm text-blue-700">
            <strong>Info Export:</strong> PDF akan berisi {filteredTransaksi.length} transaksi. 
            {filteredTransaksi.length > 50 && ' Data banyak akan menggunakan format sederhana.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Laporan;