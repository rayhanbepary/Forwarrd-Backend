const validator = require('validator');

const validate = (collector) => {
    let error = {};

    // Name
    if (!collector.name) {
        error.name = 'Please Enter Your Name'
    }

    // Collector Address
    if (!collector.address) {
        error.address = 'Please Enter Your Address'
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate