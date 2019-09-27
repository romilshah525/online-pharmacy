const nodemailer = require('nodemailer');
const Medicine = require('../models/medicine');
const User = require('../models/user');

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
        res.redirect('/medicine-list');
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

exports.placeOrder = (req, res) => {
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'shahromil525@gmail.com',
    //         pass: 'rldegzyqjsqirwpf'
    //     }   
    // });
    // let mailOptions = {
    //     from: 'shahromil525@gmail.com',
    //     to: req.user.email,
    //     subject: 'Order PLaced on ABC Pharmacy!',
    //     text: 'Hey there, your order has been placed!\nThankyou for using ABC Pharmacy'
    // };
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //         console.log(error);
    //     }
    //     else {
    //         console.log(`Email sent: ${info.messageId}`);
    //         console.log(`Email sent: ${info.response}`);
    //     }
    // });
    res.redirect('/clear-cart');
}

exports.clearCart = (req, res) => {
    req.user.clearCart()
    .then((cart) => {
        console.log(`Success: ${cart.cart.items}`);
    })
    .catch((resp) => {
        console.log(`Failure: ${resp}`);
    });
    res.redirect('/cart');
}