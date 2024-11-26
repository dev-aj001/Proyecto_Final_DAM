const express = require('express');

const almacenController = require('../controllers/almacenController');

const router = express.Router();

// Rutas para almacen
router.post('/:id/almacen', almacenController.createOne);
router.get('/:id/almacen', almacenController.readAllbyId);
router.get('/:id/almacen/:id_almacen', almacenController.readOne);
router.get('/almacenes', almacenController.readAll);
router.put('/:id/almacen/:id_almacen', almacenController.updateOne);
router.delete('/:id/almacen/:id_almacen', almacenController.deleteOne);

module.exports = router;