const validator = require('validator');

const validate = (withdraw) => {
    let error = {};

    // Name
    if (!withdraw.name) {
        error.name = 'Please Enter Your Name'
    }

    // Phone Number
    if (!withdraw.phone) {
        error.phone = 'Please Enter Your Phone Number'
    }

    // Organization Name
    if (!withdraw.orgName) {
        error.orgName = 'Please Enter Your Organization Name'
    }

    // Amount
    if (!withdraw.amount) {
        error.amount = 'Please Enter Amount'
    } else if (withdraw.amount > 1000) {
        error.amount = 'You can\'t withdraw more than 1000 at the same time'
    }

    // Bkash Number
    if (!withdraw.bkash) {
        error.bkash = 'Please Enter Your Bkash Number'
    }

    
    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate