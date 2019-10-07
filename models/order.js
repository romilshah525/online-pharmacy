const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    amount: { type: Number, required: true },
    medicines: [{
        medicine: { type: Object, required: true },
        quantity: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Order', orderSchema);

// const orderSchema = new Schema({
//     userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
//     amount: { type: Number, required: true },
//     medicines: [{
//         cartId: { type: Schema.Types.ObjectId, required: true, ref: 'Cart' },
//     }]
// });