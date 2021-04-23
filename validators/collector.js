const validator = require('validator');

const validate = (collector) => {
    let error = {};

    // Name
    if (!collector.name) {
        error.name = 'Please Enter Your Name'
    }

    // Email
    if (!collector.email) {
        error.email = 'Please Enter Your Email'
    } else if (!validator.isEmail(collector.email)) {
        error.email = 'Please Enter a Valid Email'
    }

    // Phone Number
    if (!collector.phone) {
        error.phone = 'Please Enter Your Phone Number'
    }

    // Address
    if (!collector.address) {
        error.address = 'Please Enter Your Address'
    }

    // Collector Role
    if (!collector.role) {
        error.role = 'Please Select Your Role'
    }

    // Password
    if (!collector.password) {
        error.password = 'Please Enter Your Password'
    } else if (collector.password.length < 6) {
        error.password = 'Password Must Be at least 6 characters'
    }

    // Confirmation Password
    if (!collector.confirmPassword) {
        error.confirmPassword = 'Please Enter Confirmation Password'
    } else if (collector.password !== collector.confirmPassword) {
        error.confirmPassword = 'Password Doesn\'t Match'
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate