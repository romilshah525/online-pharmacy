const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String },
    gender: { type: String },
    age: { type: Number },
    address: { type: String },
    prescription: [{ type: String }],
    contact: { type: Number },
    orderCount: { type: Number, default: 0 },
    username: { type: String },
    email: { type: String },
    isAdmin: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpirationDate: Date,
    cart: {
        items: [{
                    medicineId: { type: Schema.Types.ObjectId, ref:'Medicine', required: true },
                    quantity: { type: Number, required: true }
                }]
    }
});

userSchema.methods.addToCart = function ( medicine ) { 
    const cartMedicineIndex = this.cart.items.findIndex( index => {
        return index.medicineId.toString() === medicine._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if(cartMedicineIndex >= 0) {
        newQuantity = this.cart.items[cartMedicineIndex].quantity + 1;
        updatedCartItems[cartMedicineIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            medicineId: medicine._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (medId) {
    const updatedCartItems = this.cart.items.filter( item => {
        return item.medicineId.toString() !== medId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart.items = [];
    return this.save();
}

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);