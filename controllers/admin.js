const Medicine = require('../models/medicine');

exports.getAddMedicine = (req, res) => {
    res.render('admin/addMedicine',{
        pageTitle: 'Add Medicine',
        mainContent: 'Welcome to your Add Medicine',
        edit: false
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
        })
        .catch(err => {
            console.log(err);
        });
        res.redirect('/admin/medList');
};

exports.getEditMedicine = (req, res) => {
    const id = req.params.id;
    Medicine.findById(id, (err, medicine) => {
        res.render('admin/addMedicine',{
                pageTitle: 'Edit Medicine',
                mainContent: 'Welcome to Edit Medicine',
                edit: true,
                medicine: medicine
            });
    });
};

exports.postEditMedicine  = (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const expDate = req.body.expDate;
    const price = req.body.price;
    const medType = req.body.medType;
    Medicine.findById(id, (err, medicine) => {
        medicine.name = name;
        medicine.expDate = expDate;
        medicine.price = price;            
        medicine.medType = medType ;
        medicine.save()
            .then(res => {
                console.log("Product Updated!");
            });
    });
    res.redirect('/admin/medList');
};

exports.getMedList = (req, res) => {
    Medicine.find({}, (err, medicine) => {
        res.render('admin/Medicine',{
                pageTitle: 'Medicine List',
                mainContent: 'Welcome to your Medicine List',
                medicines: medicine
            });
    });
};