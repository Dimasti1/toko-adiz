const db = require('../config/database');

const pembeliController = {
  getAllPembeli: async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT * FROM pembeli ORDER BY id_pembeli DESC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //pencarian
  searchPembeli: async (req, res) => {
    const { nama } = req.query;
    try {
      const [rows] = await db.promise().query(
        'SELECT * FROM pembeli WHERE nama_pembeli LIKE ? ORDER BY id_pembeli DESC',
        [`%${nama}%`]
      );
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPembeliById: async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT * FROM pembeli WHERE id_pembeli = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Pembeli tidak ditemukan' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //create - tambah pembeli
  createPembeli: async (req, res) => {
    const { nama_pembeli, alamat } = req.body;
    
    try {
      const [result] = await db.promise().query(
        'INSERT INTO pembeli (nama_pembeli, alamat) VALUES (?, ?)',
        [nama_pembeli, alamat]
      );
      
      res.json({ message: 'Pembeli berhasil ditambahkan', id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updatePembeli: async (req, res) => {
    const { id } = req.params;
    const { nama_pembeli, alamat } = req.body;
    
    try {
      await db.promise().query(
        'UPDATE pembeli SET nama_pembeli = ?, alamat = ? WHERE id_pembeli = ?',
        [nama_pembeli, alamat, id]
      );
      
      res.json({ message: 'Pembeli berhasil diupdate' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletePembeli: async (req, res) => {
    try {
      await db.promise().query('DELETE FROM pembeli WHERE id_pembeli = ?', [req.params.id]);
      res.json({ message: 'Pembeli berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = pembeliController;