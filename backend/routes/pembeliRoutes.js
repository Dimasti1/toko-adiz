const express = require('express');
const router = express.Router();
const pembeliController = require('../controllers/pembeliController');

router.get('/', pembeliController.getAllPembeli);
router.get('/search', pembeliController.searchPembeli);
router.get('/:id', pembeliController.getPembeliById);
router.post('/', pembeliController.createPembeli);
router.put('/:id', pembeliController.updatePembeli);
router.delete('/:id', pembeliController.deletePembeli);

module.exports = router;