const Medicine = require('../models/medicine');

exports.getHome = (req, res) => {
    res.render('pharmacy/dashboard',{
        pageTitle: 'Pharmacy', 
        mainContent: 'Welcome to abc pharmacy',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken()
    });
};

exports.getCart = (req, res ) => {
    req.user
    .populate('cart.items.medicineId')
    .execPopulate()
    .then(user => { 
        const medicines = user.cart.items;
        res.render('pharmacy/cart', {
        pageTitle: 'Medicine List',
        mainContent: 'Welcome to your Cart',
        length: medicines.length,
        medicines: medicines,
        isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
};

exports.postAddToCart = (req, res ) => {
    const medId = req.body.medId;
    Medicine.findById(medId)
    .then( medicine => {
        return req.user.addToCart(medicine);
    })
    .then(result => {
        res.redirect('/medList');
    });
};

exports.postRemoveFromCart = (req, res) => {
    const medId = req.params.medId;
    req.user
    .removeFromCart(medId)
    .then( result => {
        res.redirect('/cart');
    });
}

exports.getCheckOut = (req, res) => {
    res.render('pharmacy/checkOut',{
        pageTitle: 'Checkout', 
        mainContent: 'Welcome to checkout Page',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.getMedicineList =  (req, res) => {
    Medicine.find()
    .then( medicine => {
        res.render('admin/Medicine',{
                pageTitle: 'Medicine List',
                mainContent: 'Welcome to your Medicine List',
                medicines: medicine,
                length: medicine.length,
                admin: false,
                isAuthenticated: req.session.isLoggedIn
            });
    })
    .catch( err => {    
        console.log(err);
        res.redirect('/');
    });
};

exports.getOrders = (req, res) => {
    res.render('pharmacy/orders',{
        pageTitle: 'Order Details', 
        mainContent: 'Welcome to your Order Details',
        isAuthenticated: req.session.isLoggedIn
    });
};

// exports.postCartDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     req.user
//       .removeFromCart(prodId)
//       .then(result => {
//         res.redirect('/cart');
//       })
//       .catch(err => console.log(err));
//   };

// exports.postOrder = (req, res, next) => {
//     req.user
//       .populate('cart.items.productId')
//       .execPopulate()
//       .then(user => {
//         const products = user.cart.items.map(i => {
//           return { quantity: i.quantity, product: { ...i.productId._doc } };
//         });
//         const order = new Order({
//           user: {
//             name: req.user.name,
//             userId: req.user
//           },
//           products: products
//         });
//         return order.save();
//       })
//       .then(result => {
//         return req.user.clearCart();
//       })
//       .then(() => {
//         res.redirect('/orders');
//       })
//       .catch(err => console.log(err));
//   };