const express = require('express');

const inventoryController = require('../controllers/inventoryController');
const almacenController = require('../controllers/almacenController');
const infoadController = require('../controllers/infoadController');
const movimientosController = require('../controllers/movimientosController');
const seriesController = require('../controllers/seriesController');


const router = express.Router();

// Rutas para negocios (inventario)
router.post('/', inventoryController.createOne);
router.get('/',inventoryController.readAll);
router.get('/:id', inventoryController.readOne);
router.put("/:id", inventoryController.updateOne);
router.delete('/:id',inventoryController.deleteOne);

// Rutas para almacen
router.post('/:id/almacen', almacenController.createOne);
router.get('/:id/almacen', almacenController.readAll);
router.get('/:id/almacen/:idAlmacen', almacenController.readOne);
router.put('/:id/almacen/:idAlmacen', almacenController.updateOne);
router.delete('/:id/almacen/:idAlmacen', almacenController.updateOne);

// Rutas para infoAd
router.post('/:id/almacen/:idAlmacen/infoad', infoadController.createOne);
router.get('/:id/almacen/:idAlmacen/infoad', infoadController.readAll);
router.get('/:id/almacen/:idAlmacen/infoad/:idInfoad', infoadController.readOne);
router.put('/:id/almacen/:idAlmacen/infoad/:idInfoad', infoadController.updateOne);
router.delete('/:id/almacen/:idAlmacen/infoad/idInfoad', infoadController.deleteOne);

// Rutas para Movimientos
router.post('/:id/almacen/:idAlmacen/movimientos', movimientosController.createOne);
router.get('/:id/almacen/:idAlmacen/movimientos', movimientosController.readAll);
router.get('/:id/almacen/:idAlmacen/movimientos/:idMovimiento', movimientosController.readOne);
router.put('/:id/almacen/:idAlmacen/movimientos/:idMovimiento', movimientosController.updateOne);
router.delete('/:id/almacen/:idAlmacen/movimientos/idMovimiento', movimientosController.deleteOne);

// Rutas para Series
router.post('/:id/almacen/:idAlmacen/series', seriesController.createOne);
router.get('/:id/almacen/:idAlmacen/series', seriesController.readAll);
router.get('/:id/almacen/:idAlmacen/series/:idSeries', seriesController.readOne);
router.put('/:id/almacen/:idAlmacen/series/:idSeries', seriesController.updateOne);
router.delete('/:id/almacen/:idAlmacen/series/idSeries', seriesController.deleteOne);


module.exports = router;