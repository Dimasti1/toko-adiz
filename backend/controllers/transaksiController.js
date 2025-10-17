const db = require('../config/database');

const transaksiController = {
  getAllTransaksi: async (req, res) => {
    try {
      const [rows] = await db.promise().query(`
        SELECT t.*, p.nama_pembeli, b.nama_barang, b.harga as harga_satuan 
        FROM transaksi t 
        JOIN pembeli p ON t.id_pembeli = p.id_pembeli 
        JOIN barang b ON t.id_barang = b.id_barang 
        ORDER BY t.tanggal DESC, t.id_transaksi DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  filterTransaksi: async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const [rows] = await db.promise().query(`
        SELECT t.*, p.nama_pembeli, b.nama_barang, b.harga as harga_satuan 
        FROM transaksi t 
        JOIN pembeli p ON t.id_pembeli = p.id_pembeli 
        JOIN barang b ON t.id_barang = b.id_barang 
        WHERE t.tanggal BETWEEN ? AND ?
        ORDER BY t.tanggal DESC
      `, [startDate, endDate]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTransaksiById: async (req, res) => {
    try {
      const [rows] = await db.promise().query(`
        SELECT t.*, p.nama_pembeli, b.nama_barang, b.harga as harga_satuan, b.stok
        FROM transaksi t 
        JOIN pembeli p ON t.id_pembeli = p.id_pembeli 
        JOIN barang b ON t.id_barang = b.id_barang 
        WHERE t.id_transaksi = ?
      `, [req.params.id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //create - buat transaksi dengan validasi stok
  createTransaksi: async (req, res) => {
    const { id_pembeli, id_barang, jumlah, tanggal } = req.body;
    
    try {
      // Cek stok tersedia
      const [barang] = await db.promise().query('SELECT stok, harga FROM barang WHERE id_barang = ?', [id_barang]);
      
      if (barang.length === 0) {
        return res.status(404).json({ error: 'Barang tidak ditemukan' });
      }
      
      if (barang[0].stok < jumlah) {
        return res.status(400).json({ error: 'Stok tidak mencukupi' });
      }

      if (jumlah <= 0) {
        return res.status(400).json({ error: 'Jumlah harus lebih dari 0' });
      }

      // Insert transaksi
      const [result] = await db.promise().query(
        'INSERT INTO transaksi (id_pembeli, id_barang, jumlah, harga, tanggal) VALUES (?, ?, ?, ?, ?)',
        [id_pembeli, id_barang, jumlah, barang[0].harga, tanggal]
      );

      // Update stok barang
      await db.promise().query(
        'UPDATE barang SET stok = stok - ? WHERE id_barang = ?',
        [jumlah, id_barang]
      );

      res.json({ 
        message: 'Transaksi berhasil dibuat', 
        id: result.insertId,
        total_harga: barang[0].harga * jumlah
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateTransaksi: async (req, res) => {
    const { id } = req.params;
    const { id_pembeli, id_barang, jumlah, tanggal } = req.body;
    
    try {
      // Logic update transaksi (lebih kompleks, perlu handle perubahan jumlah dan barang)
      // Diimplementasikan sesuai kebutuhan
      res.json({ message: 'Fitur update transaksi dalam pengembangan' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteTransaksi: async (req, res) => {
    try {
      // Dapatkan data transaksi sebelum dihapus untuk mengembalikan stok
      const [transaksi] = await db.promise().query(
        'SELECT id_barang, jumlah FROM transaksi WHERE id_transaksi = ?',
        [req.params.id]
      );

      if (transaksi.length > 0) {
        // Kembalikan stok
        await db.promise().query(
          'UPDATE barang SET stok = stok + ? WHERE id_barang = ?',
          [transaksi[0].jumlah, transaksi[0].id_barang]
        );
      }

      await db.promise().query('DELETE FROM transaksi WHERE id_transaksi = ?', [req.params.id]);
      res.json({ message: 'Transaksi berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  cetakTransaksi: async (req, res) => {
    try {
      const [transaksi] = await db.promise().query(`
        SELECT t.*, p.nama_pembeli, p.alamat, b.nama_barang 
        FROM transaksi t 
        JOIN pembeli p ON t.id_pembeli = p.id_pembeli 
        JOIN barang b ON t.id_barang = b.id_barang 
        WHERE t.id_transaksi = ?
      `, [req.params.id]);

      if (transaksi.length === 0) {
        return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
      }

      // Format data untuk cetak (bisa dikembangkan untuk PDF)
      res.json(transaksi[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = transaksiController;