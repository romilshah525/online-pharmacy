const Medicine = require('../models/medicine');

exports.getAddMedicine = (req, res) => {
    res.render('admin/addMedicine',{
        pageTitle: 'Add Medicine',
        mainContent: 'Welcome to your Add Medicine'
    });
};

exports.postAddMedicine = (req, res) => {
    const name = req.body.name;
    const expDate = req.body.expDate;
    const price = req.body.price;
    const medType = req.body.medType;
    const medicine = new Medicine ({
            name: name,
            expDate: expDate,
            price: price,
            medType: medType  
        });
    medicine
        .save()
        .then(res => {
            console.log("Product Created!");
            console.log(medicine);
        })
        .catch(err => {
            console.log(err);
        });
        res.redirect('/admin/medList');
};

exports.getMedList = (req, res) => {
    Medicine.find({}, (err, medicine) => {
        if(err) {
            console.log(err);
            res.render('admin/addMedicine',{
                pageTitle: 'Add Medicine',
                mainContent: 'Welcome to your Add Medicine'
            });
        }
        else {
            res.render('admin/Medicine',{
                pageTitle: 'Edit Medicine',
                mainContent: 'Welcome to your Add Medicine',
                medicines: medicine
            });
        }
    });
};