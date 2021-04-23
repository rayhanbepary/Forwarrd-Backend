const validator = require('validator');

const validate = (deposit) => {
    let error = {};

    // Name
    if (!deposit.name) {
        error.name = 'Please Enter Client Name'
    }

    // Client
    if (!deposit.client) {
        error.client = 'Please Enter Client Phone Number'
    }

    // Client Organization Name
    if (!deposit.orgName) {
        error.orgName = 'Please Enter Client Organization Name'
    }

    // Amount
    if (!deposit.amount) {
        error.amount = 'Please Enter Amount'
    }

    // Quantity
    if (!deposit.quantity) {
        error.quantity = 'Please Enter Quantity'
    }

    // Waste Type
    if (!deposit.type) {
        error.type = 'Please Select Waste Type'
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate