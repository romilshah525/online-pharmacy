const Medicine = require('../models/medicine');

exports.getHome = (req, res) => {
    res.render('pharmacy/index');
};

exports.getMedicineList = (req, res) => {
    Medicine.find()
    .then( medicine => {
        res.render('pharmacy/med-list',{
                medicines: medicine,
                length: medicine.length
            });
    })
    .catch( err => {    
        console.log(err);
        res.redirect('/');
    });
};

exports.getCart = (req, res) => {
    req.user
    .populate('cart.items.medicineId')
    .execPopulate()
    .then(user => { 
        const medicines = user.cart.items;
        console.log("Cart Loaded Successfully!");
        res.render('pharmacy/cart', {
            length: medicines.length,
            medicines: medicines
        });
    })
    .catch(err => console.log(err));
};

exports.postAddToCart = (req, res) => {
    const medId = req.body.medId;
    Medicine.findById(medId)
    .then( medicine => {
        return req.user.addToCart(medicine);
    })
    .then(result => {
        res.redirect('/cart');
    });
};

exports.postDeleteFromCart = (req, res) => {
    const medId = req.params.medicineId;
    req.user
    .removeFromCart(medId)
    .then( result => {
        res.redirect('/cart');
    });
}