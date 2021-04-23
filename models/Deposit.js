const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepositsSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    client: {
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
    quantity: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId
    }
}, {timestamps: true})

const Deposit = mongoose.model('Deposit', DepositsSchema)

module.exports = Deposit