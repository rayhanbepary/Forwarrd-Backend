const validator = require('validator');

const validate = (resetPassword) => {
    let error = {};

    // New Password
    if (!resetPassword.newPassword) {
        error.newPassword = 'Please Enter Your New Password'
    } else if (resetPassword.newPassword.length < 6) {
        error.newPassword = 'Password Must Be at least 6 characters'
    }

    // Confirmation Password
    if (!resetPassword.confirmPassword) {
        error.confirmPassword = 'Please Enter Confirmation Password'
    } else if (resetPassword.newPassword !== resetPassword.confirmPassword) {
        error.confirmPassword = 'Password Doesn\'t Match'
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate