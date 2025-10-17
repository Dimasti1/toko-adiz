const db = require('../config/database');

const barangController = {
  getAllBarang: async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT * FROM barang ORDER BY id_barang DESC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBarangById: async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT * FROM barang WHERE id_barang = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Barang tidak ditemukan' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createBarang: async (req, res) => {
    const { nama_barang, harga, stok } = req.body;
    
    try {
      // Validasi stok tidak negatif
      if (stok < 0) {
        return res.status(400).json({ error: 'Stok tidak boleh negatif' });
      }

      const [result] = await db.promise().query(
        'INSERT INTO barang (nama_barang, harga, stok) VALUES (UPPER(?), ?, ?)',
        [nama_barang, harga, stok]
      );
      
      res.json({ message: 'Barang berhasil ditambahkan', id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateBarang: async (req, res) => {
    const { id } = req.params;
    const { nama_barang, harga, stok } = req.body;
    
    try {
      if (stok < 0) {
        return res.status(400).json({ error: 'Stok tidak boleh negatif' });
      }

      await db.promise().query(
        'UPDATE barang SET nama_barang = UPPER(?), harga = ?, stok = ? WHERE id_barang = ?',
        [nama_barang, harga, stok, id]
      );
      
      res.json({ message: 'Barang berhasil diupdate' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteBarang: async (req, res) => {
    try {
      await db.promise().query('DELETE FROM barang WHERE id_barang = ?', [req.params.id]);
      res.json({ message: 'Barang berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = barangController;