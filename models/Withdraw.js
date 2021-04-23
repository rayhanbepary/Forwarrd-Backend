const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const withdrawSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    orgName: {
        type: String,
        trim: true,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    bkash: {
        type: String,
        trim: true,
        required: true
    },
    transactionId: {
        type: String,
        trim: true
    },
    status: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

const Withdraw = mongoose.model('Withdraw', withdrawSchema)

module.exports = Withdraw