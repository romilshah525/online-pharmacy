const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medSchema = new Schema({
    name: { type: String, required: true },
    expDate: { type: Date, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Medicine', medSchema);