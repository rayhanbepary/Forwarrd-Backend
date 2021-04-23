const express = require('express');
const router = express.Router();
const { createWithdraw, getAllWithdraw, getWithdrawsOfDiffUser, updateWithdraw, getUserWithdraws } = require('../controllers/withdraw');
const authenticate = require('../authenticate');


// Create Withdraw
router.post('/create/withdraw', authenticate, createWithdraw);

// Get All Withdraw
router.get('/admin/allWithdraw', authenticate, getAllWithdraw);

//Get All Withdraw Of Diff User
router.get('/diff/user/allWithdraw', authenticate, getWithdrawsOfDiffUser);

// Get Withdraws Of Users
router.get('/:client/withdraws', authenticate, getUserWithdraws);

// Update Withdraw
router.put('/:withdrawId/update/Withdraw', authenticate, updateWithdraw);



module.exports = router;