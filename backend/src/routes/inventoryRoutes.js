const express = require('express');

const inventoryController = require('../controllers/inventoryController');



const router = express.Router();


router.delete('/inventory/:IdNegocio',inventoryController.deleteOneInvetory);

module.exports = router;