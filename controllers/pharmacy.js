const Medicine = require('../models/medicine');

exports.getHome = (req, res) => {
    res.render('pharmacy/dashboard',{
        pageTitle: 'Pharmacy', 
        mainContent: 'Welcome to abc pharmacy'
    });
};

exports.getCartById = (req, res) => {
    res.render('pharmacy/cart',{
        pageTitle: 'My Cart', 
        mainContent: 'Welcome to your cart',
        cartId: req.params.id
    });
};

exports.getCheckOut = (req, res) => {
    res.render('pharmacy/checkOut',{
        pageTitle: 'Checkout', 
        mainContent: 'Welcome to checkout Page'
    });
};

exports.getMedicineList =  (req, res) => {
    Medicine.find({}, (err, medicine) => {
        res.render('admin/Medicine',{
                pageTitle: 'Medicine List',
                mainContent: 'Welcome to your Medicine List',
                medicines: medicine,
                length: medicine.length,
                admin: false
            });
    });
};

exports.getOrders = (req, res) => {
    res.render('pharmacy/orders',{
        pageTitle: 'Order Details', 
        mainContent: 'Welcome to your Order Details'
    });
};