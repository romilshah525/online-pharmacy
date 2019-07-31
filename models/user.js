const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    // gender: { type: String, required: true },
    // dob: { type: Date, required: true },
    // age: { type: Number, required: true },
    // address: { type: String, required: true },
    // contact: { type: Number, required: true },
    email: { type: String, required: true },
    // password: { type: String, required: true },
    cart: {
        items: [
            {
                medicineId: { type: Schema.Types.ObjectId, required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});

module.exports = mongoose.model('User', userSchema);