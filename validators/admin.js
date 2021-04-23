const validator = require('validator');

const validate = (admin) => {
    let error = {};

    // Name
    if (!admin.name) {
        error.name = 'Please Enter Your Name'
    }

    // Email
    if (!admin.email) {
        error.email = 'Please Enter Your Email'
    } else if (!validator.isEmail(admin.email)) {
        error.email = 'Please Enter a Valid Email'
    }

    // Phone Number
    if (!admin.phone) {
        error.phone = 'Please Enter Your Phone Number'
    }

    // Address
    if (!admin.address) {
        error.address = 'Please Enter Your Address'
    }

    // Admin Role
    if (!admin.role) {
        error.role = 'Please Select Your Role'
    }

    // Password
    if (!admin.password) {
        error.password = 'Please Enter Your Password'
    } else if (admin.password.length < 6) {
        error.password = 'Password Must Be at least 6 characters'
    }

    // Confirmation Password
    if (!admin.confirmPassword) {
        error.confirmPassword = 'Please Enter Confirmation Password'
    } else if (admin.password !== admin.confirmPassword) {
        error.confirmPassword = 'Password Doesn\'t Match'
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate