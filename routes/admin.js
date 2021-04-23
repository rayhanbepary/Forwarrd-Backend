const express = require('express');
const router = express.Router();
const { createAdmin, getAllAdmin, updateAdmin, removeAdmin } = require('../controllers/admin')
const authenticate = require('../authenticate');


// Create Admin 
router.post('/create/admin', authenticate, createAdmin);

// Get All Admin
router.get('/all/admins', authenticate, getAllAdmin);

// Update Admin
router.put('/:adminId', authenticate, updateAdmin);

// Remove Admin
router.delete('/:adminId', authenticate, removeAdmin);

module.exports = router;