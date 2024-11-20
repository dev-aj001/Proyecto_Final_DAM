const express = require('express');

const createOneInventory 
    = require('../controllers/createOneInventory');


const router = express.Router();

router.post('/', createOneInventory);

module.exports = router;