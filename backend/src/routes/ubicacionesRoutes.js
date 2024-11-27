const express = require('express');
const ubicacionesController = require('../controllers/ubicacionesController');

const router = express.Router();

// Rutas para Ubicaciones dentro de Series
// Crear una nueva ubicación dentro de una serie
router.post('/:id/almacen/:id_almacen/series/:id_serie/ubicacion', ubicacionesController.createOne);

// Leer todas las ubicaciones dentro de todas las series
router.get('/', ubicacionesController.readAll);


// Leer una ubicación específica dentro de una serie
router.get('/:id/almacen/:id_almacen/series/:id_serie/ubicaciones/:id_ubicacion', ubicacionesController.readOne);

// Actualizar una ubicación específica dentro de una serie
router.put('/:id/almacen/:id_almacen/series/:id_serie/ubicaciones/:id_ubicacion', ubicacionesController.updateOne);

// Eliminar una ubicación específica dentro de una serie
router.delete('/:id/almacen/:id_almacen/series/:id_serie/ubicaciones/:id_ubicacion', ubicacionesController.deleteOne);

module.exports = router;