const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema ({
    wasteQuantity: Number,
    livesImpact: Number,
    recyclingPercent: Number,
}, {timestamps: true})

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;