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

exports.postCart = (req, res ) => {
  const medId = req.body.medId;
  console.log("inside post cart");
  console.log(medId);
  Medicine.findById(medId)
    .then( medicine => {
      return req.user.addToCart(medicine);
    })
    .then(result => {
      console.log(result);
      res.redirect('/medList');
    });
};

exports.getCheckOut = (req, res) => {
    res.render('pharmacy/checkOut',{
        pageTitle: 'Checkout', 
        mainContent: 'Welcome to checkout Page'
    });
};

exports.getMedicineList =  (req, res) => {
    Medicine.find()
        .then( medicine => {
            console.log("_______________________");
            console.log("Medicine list received.");
            // console.log("_______________________");
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

// const Product = require('../models/product');
// const Order = require('../models/order');

// exports.getProducts = (req, res, next) => {
//   Product.find()
//     .then(products => {
//       console.log(products);
//       res.render('shop/product-list', {
//         prods: products,
//         pageTitle: 'All Products',
//         path: '/products'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findById(prodId)
//     .then(product => {
//       res.render('shop/product-detail', {
//         product: product,
//         pageTitle: product.title,
//         path: '/products'
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.getIndex = (req, res, next) => {
//   Product.find()
//     .then(products => {
//       res.render('shop/index', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .removeFromCart(prodId)
//     .then(result => {
//       res.redirect('/cart');
//     })
//     .catch(err => console.log(err));
// };

// exports.postOrder = (req, res, next) => {
//   req.user
//     .populate('cart.items.productId')
//     .execPopulate()
//     .then(user => {
//       const products = user.cart.items.map(i => {
//         return { quantity: i.quantity, product: { ...i.productId._doc } };
//       });
//       const order = new Order({
//         user: {
//           name: req.user.name,
//           userId: req.user
//         },
//         products: products
//       });
//       return order.save();
//     })
//     .then(result => {
//       return req.user.clearCart();
//     })
//     .then(() => {
//       res.redirect('/orders');
//     })
//     .catch(err => console.log(err));
// };

// exports.getOrders = (req, res, next) => {
//   Order.find({ 'user.userId': req.user._id })
//     .then(orders => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders: orders
//       });
//     })
//     .catch(err => console.log(err));
// };
