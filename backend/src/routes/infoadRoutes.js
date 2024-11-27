const express = require('express');


const infoadController = require('../controllers/infoadController');


const router = express.Router();


// Rutas para Series
router.post('/:id/almacen/:idAlmacen', infoadController.createOne);
router.get('/', infoadController.readAll);
router.get('/:id/almacen/:idAlmacen/series/:id_infoAd', infoadController.readOne);
router.put('/:id/almacen/:idAlmacen/series/:id_infoAd', infoadController.updateOne);
router.delete('/:id/almacen/:id_almacen/series/:id_infoAd', infoadController.deleteOne);




module.exports = router;