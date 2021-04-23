const express = require('express');
const router = express.Router();
const { createDeposit, getAllDeposits, getDepositsOfDiffUser, updateDeposit, getUserDeposits, getCollectorDeposits } = require('../controllers/deposit');
const authenticate = require('../authenticate');


// Create Deposit
router.post('/create/deposit', authenticate, createDeposit);

// Get All Deposits
router.get('/admin/allDeposits', authenticate, getAllDeposits);

// Get All Deposits Of Diff User
router.get('/diff/user/allDeposits', authenticate, getDepositsOfDiffUser);

// Get Deposits Of Users
router.get('/:client/deposits', authenticate, getUserDeposits);

// Get Deposits Of Collectors
router.get('/:author/collections', authenticate, getCollectorDeposits);

// Update Deposit
router.put('/:depositId/update/deposit', authenticate, updateDeposit);

module.exports = router;