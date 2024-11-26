const express = require('express');


const seriesController = require('../controllers/seriesController');


const router = express.Router();


// Rutas para Series
router.post('/:id/almacen/:idAlmacen', seriesController.createOne);
router.get('/', seriesController.readAll);
router.get('/:id/almacen/:id_almacen/series/:id_serie', seriesController.readOne);
router.put('/:id/almacen/:idAlmacen/series/:idSeries', seriesController.updateOne);
router.delete('/:id/almacen/:idAlmacen/series/idSeries', seriesController.deleteOne);




module.exports = router;