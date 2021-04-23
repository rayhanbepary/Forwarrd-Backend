const validator = require('validator');

const validate = (admin) => {
    let error = {};

    // Name
    if (!admin.name) {
        error.name = 'Please Enter Your Name'
    }

    // Admin Address
    if (!admin.address) {
        error.address = 'Please Enter Your Address'
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate