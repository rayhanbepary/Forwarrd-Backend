const express = require('express');
const router = express.Router();
const { createCounter, getAllCounter, updateCounter } = require('../controllers/counter')
const authenticate = require('../authenticate');


// Create Counter 
router.post('/create', authenticate, createCounter);

// Get All Counter
router.get('/get', getAllCounter);

// Update Counter
router.put('/:counterId', authenticate, updateCounter);


module.exports = router;