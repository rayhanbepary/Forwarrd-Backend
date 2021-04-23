const validator = require('validator');

const validate = (user) => {
    let error = {};

    // Phone Number
    if (!user.phone) {
        error.phone = 'Please Enter Your Phone Number'
    }

    // Password
    if (!user.password) {
        error.password = 'Please Enter Your Password'
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate