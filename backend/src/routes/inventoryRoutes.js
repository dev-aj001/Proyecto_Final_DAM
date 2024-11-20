const express = require('express');

const inventoryController = require('../controllers/inventoryController');


const router = express.Router();

router.post('/', inventoryController.createOneInventory);
router.get('/',inventoryController.getallInvetory);
router.get('/negocio/:id', inventoryController.getOneInvetory);
router.delete('/inventory/:id',inventoryController.deleteOneInvetory);
router.put("/updateOneInventary/:id", inventoryController.updateInventory);

module.exports = router;