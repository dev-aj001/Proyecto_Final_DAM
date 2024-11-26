const express = require('express');


const movimientosController = require('../controllers/movimientosController');


const router = express.Router();


// Rutas para Movimientos
router.post('/:id/almacen/:idAlmacen', movimientosController.createOne);
router.get('/', movimientosController.readAll);
router.get('/:id/almacen/:id_almacen/movimientos/:id_movto', movimientosController.readOne);
router.put('/:id/almacen/:id_almacen/movimientos/:id_movto', movimientosController.updateOne);
router.delete('/:id/almacen/:id_almacen/movimientos/:id_movto', movimientosController.deleteOne);

module.exports = router;