const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref:'User', required: true },
    items:[{
        medicineId: { type: Schema.Types.ObjectId, ref:'Medicine', required: true },
        quantity: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Cart', cartSchema);