const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    expDate: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    medType: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Medicine', medSchema);