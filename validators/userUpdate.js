const validator = require('validator');

const validate = (user) => {
    let error = {};

    // Name
    if (!user.name) {
        error.name = 'Please Enter Your Name'
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

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate