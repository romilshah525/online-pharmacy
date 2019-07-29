exports.getDashboard = (req, res) => {
    res.render('pharmacy/dashboard',{
        pageTitle: 'Pharmacy', 
        mainContent: 'Welcome to abc pharmacy'
    });
};

exports.getCart = (req, res) => {
    res.render('pharmacy/cart',{
        pageTitle: 'My Cart', 
        mainContent: 'Welcome to your cart'
    });
};

exports.getCheckOut = (req, res) => {
    res.render('pharmacy/checkOut',{
        pageTitle: 'Checkout', 
        mainContent: 'Welcome to checkout Page'
    });
};

exports.getMedicineDetails =  (req, res) => {
    res.render('pharmacy/medDetails',{
        pageTitle: 'Medicine Details', 
        mainContent: 'Welcome to your Medicine Details'
    });
};

exports.getMedicineList =  (req, res) => {
    res.render('pharmacy/medList',{
        pageTitle: 'Medicine List', 
        mainContent: 'Welcome to your Medicine List'
    });
};

exports.getOrders = (req, res) => {
    res.render('pharmacy/orders',{
        pageTitle: 'Order Details', 
        mainContent: 'Welcome to your Order Details'
    });
};