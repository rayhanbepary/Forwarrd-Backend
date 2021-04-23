const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, changePassword, forgotPassword, resetPassword, updateUser, removeUser } = require('../controllers/user');
const authenticate = require('../authenticate');

// Registration 
router.post('/register', register);

// Login 
router.post('/login', login);

// Get All Users
router.get('/all/users', authenticate, getAllUsers);

// Update User
router.put('/:userId', authenticate, updateUser);

// Remove User
router.delete('/:userId', authenticate, removeUser);

// Change Password
router.post('/:userId/changePassword', authenticate, changePassword);

// Forget Password
router.post('/forgotPassword', forgotPassword);

// Reset Password
router.post('/resetPassword', resetPassword);


module.exports = router;