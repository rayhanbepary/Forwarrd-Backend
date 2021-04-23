const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    bkash: {
        type: String,
        trim: true,
        required: true
    },
    orgName: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    resetLink: {
        data: String,
        default: ''
    },
    balance: Number,
    deposit: Number,
    withdraw: Number,
    agreement: {
        type: Boolean,
        trim: true,
        required: true
    },
    depositList: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Deposit'
        }]
    },
    withdrawList: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Withdraw'
        }]
    }

}, {timestamps: true})

const User = mongoose.model('User', userSchema);
module.exports = User;