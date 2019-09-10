const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // name: { type: String, required: true },
    // gender: { type: String, required: true },
    // dob: { type: Date, required: true },
    // age: { type: Number, required: true },
    // address: { type: String, required: true },
    // contact: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pwd: { type: String, required: true },
    cart: {
        items: [
                {
                    medicineId: { type: Schema.Types.ObjectId, ref:'Medicine', required: true },
                    quantity: { type: Number, required: true }
                }
            ]
    }
});
 
userSchema.methods.addToCart = function ( medicine ) { //don't use arrow function, as arrow function doesn't allow 'this' keyword
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

module.exports = mongoose.model('User', userSchema);