const Medicine = require('../models/medicine');

exports.getHome = (req, res) => {
    res.render('pharmacy/dashboard',{
        pageTitle: 'Pharmacy', 
        mainContent: 'Welcome to abc pharmacy'
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
        medicines: medicines
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
        mainContent: 'Welcome to checkout Page'
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
                    admin: false
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
        mainContent: 'Welcome to your Order Details'
    });
};