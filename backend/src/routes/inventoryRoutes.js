const express = require('express');

const inventoryController = require('../controllers/inventoryController');



const router = express.Router();

router.get('/',inventoryController.getallInvetory);
router.get('/negocio/:id', inventoryController.getOneInvetory);
router.delete('/inventory/:id',inventoryController.deleteOneInvetory);

module.exports = router;