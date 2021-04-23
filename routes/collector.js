const express = require('express');
const router = express.Router();
const { createCollector, getAllCollector, updateCollector, removeCollector } = require('../controllers/collector');
const authenticate = require('../authenticate');


// Create Collector 
router.post('/create/collector', authenticate, createCollector);

// Get All Collector
router.get('/all/collectors', authenticate, getAllCollector);

// Update Collector
router.put('/:collectorId', authenticate, updateCollector);

// Remove Collector
router.delete('/:collectorId', authenticate, removeCollector);


module.exports = router;