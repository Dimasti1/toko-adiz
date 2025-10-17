const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/barang', require('./routes/barangRoutes'));
app.use('/api/pembeli', require('./routes/pembeliRoutes'));
app.use('/api/transaksi', require('./routes/transaksiRoutes'));

// Dashboard routes
app.get('/api/dashboard', async (req, res) => {
  const db = require('./config/database');
  
  try {
    // Total transaksi 
    const [totalTransaksi] = await db.promise().query('SELECT COUNT(*) as total FROM transaksi');
    
    // Total pendapatan
    const [totalPendapatan] = await db.promise().query('SELECT SUM(total_harga) as total FROM transaksi');
    
    // Barang terlaris
    const [barangTerlaris] = await db.promise().query(`
      SELECT b.nama_barang, SUM(t.jumlah) as total_terjual 
      FROM transaksi t 
      JOIN barang b ON t.id_barang = b.id_barang 
      GROUP BY t.id_barang 
      ORDER BY total_terjual DESC 
      LIMIT 1
    `);

    res.json({
      totalTransaksi: totalTransaksi[0].total,
      totalPendapatan: totalPendapatan[0].total || 0,
      barangTerlaris: barangTerlaris[0] || { nama_barang: 'Belum ada', total_terjual: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});