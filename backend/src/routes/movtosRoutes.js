const express = require('express');


const movimientosController = require('../controllers/movimientosController');


const router = express.Router();


// Rutas para Movimientos
router.post('/:id/almacen/:idAlmacen', movimientosController.createOne);
router.get('/', movimientosController.readAll);
router.get('/:id/almacen/:idAlmacen/movimientos/:idMovimiento', movimientosController.readOne);
router.put('/:id/almacen/:idAlmacen/movimientos/:idMovimiento', movimientosController.updateOne);
router.delete('/:id/almacen/:idAlmacen/movimientos/idMovimiento', movimientosController.deleteOne);

module.exports = router;