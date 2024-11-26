const express = require('express');


const infoadController = require('../controllers/infoadController');


const router = express.Router();


// Rutas para Series
router.post('/:id/almacen/:idAlmacen', infoadController.createOne);
router.get('/', infoadController.readAll);
router.get('/:id/almacen/:idAlmacen/series/:idSeries', infoadController.readOne);
router.put('/:id/almacen/:idAlmacen/series/:idSeries', infoadController.updateOne);
router.delete('/:id/almacen/:idAlmacen/series/idSeries', infoadController.deleteOne);




module.exports = router;