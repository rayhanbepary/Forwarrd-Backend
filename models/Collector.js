const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectorSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
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
    collections: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Deposit'
        }]
    },

}, {timestamps: true})

const Collector = mongoose.model('Collector', collectorSchema);
module.exports = Collector;