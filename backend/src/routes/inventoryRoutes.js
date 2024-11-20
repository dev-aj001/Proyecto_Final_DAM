const express = require('express');

const inventoryController = require('../controllers/inventoryController');


const router = express.Router();

router.post('/', inventoryController.createOneInventory);
router.get('/',inventoryController.getallInvetory);
router.get('/:id', inventoryController.getOneInvetory);
router.delete('/:id',inventoryController.deleteOneInvetory);
router.put("/:id", inventoryController.updateInventory);

module.exports = router;