const express = require('express');

const inventoryController = require('../controllers/inventoryController');
const infoadController = require('../controllers/infoadController');


const router = express.Router();

// Rutas para negocios (inventario)
router.post('/', inventoryController.createOne);
router.get('/',inventoryController.readAll);
router.get('/:id', inventoryController.readOne);
router.put("/:id", inventoryController.updateOne);
router.delete('/:id',inventoryController.deleteOne);


// Rutas para infoAd
router.post('/:id/almacen/:idAlmacen/infoad', infoadController.createOne);
router.get('/:id/almacen/:idAlmacen/infoad', infoadController.readAll);
router.get('/:id/almacen/:idAlmacen/infoad/:idInfoad', infoadController.readOne);
router.put('/:id/almacen/:idAlmacen/infoad/:idInfoad', infoadController.updateOne);
router.delete('/:id/almacen/:idAlmacen/infoad/idInfoad', infoadController.deleteOne);


module.exports = router;