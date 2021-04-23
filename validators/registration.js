const validator = require('validator');

const validate = (user) => {
    let error = {};

    // Name
    if (!user.name) {
        error.name = 'Please Enter Your Name'
    }

    // Phone Number
    if (!user.phone) {
        error.phone = 'Please Enter Your Phone Number'
    }

    // Bkash Number
    if (!user.bkash) {
        error.bkash = 'Please Enter Your Bkash Number'
    }

    // Organization Name
    if (!user.orgName) {
        error.orgName = 'Please Enter Your Organization Name'
    }

    // Organization Address
    if (!user.address) {
        error.address = 'Please Enter Your Organization Address'
    }

    // Agreement
    if (!user.agreement) {
        error.agreement = 'Please Check on Terms and Privacy Policy'
    }

    // Password
    if (!user.password) {
        error.password = 'Please Enter Your Password'
    } else if (user.password.length < 6) {
        error.password = 'Password Must Be at least 6 characters'
    }

    // Confirmation Password
    if (!user.confirmPassword) {
        error.confirmPassword = 'Please Enter Confirmation Password'
    } else if (user.password !== user.confirmPassword) {
        error.confirmPassword = 'Password Doesn\'t Match'
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate