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
    const user = req.user;
    const medicine = new Medicine ({
            name: name,
            expDate: expDate,
            price: price,
            medType: medType,
            userId: user
        });
    medicine
        .save()
        .then(med => {
            res.redirect('/admin/medList');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin/addMed');
        });
};

exports.getUpdateMedicine = (req, res) => {
    const id = req.params.id;
    Medicine.findById(id)
        .then( medicine => {
            res.render('admin/addMedicine',{
                pageTitle: 'Edit Medicine',
                mainContent: 'Welcome to Edit Medicine',
                edit: true,
                medicine: medicine
            });
        })
        .catch( err => {
            console.log(err);
            res.redirect('/admin/Medicine');
        });
};

exports.postUpdateMedicine  = (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const price = req.body.price;
    const medType = req.body.medType;
    Medicine.findById(id)
        .then( medicine => {
            medicine.name = name;
            medicine.price = price;            
            medicine.medType = medType ;
            return medicine.save();
        })
        .then( medicine => {
            res.redirect('/admin/medList');
        })
        .catch( err => {
            console.log(err);
            res.redirect('/admin/medList');
        });
};

exports.getMedicineList = (req, res) => {
    Medicine.find()
        .then( medicine => {
            res.render('admin/Medicine',{
                pageTitle: 'Medicine List',
                mainContent: 'Welcome to your Medicine List',
                length: medicine.length,
                medicines: medicine,
                admin: true
            });
        })
        .catch( err => {
            console.log(err);
            res.redirect('/');
        });
};

exports.deleteMedicine = (req, res) => {
    const id = req.params.id;
    Medicine.findByIdAndRemove(id)
    .then( medicine => {
        res.redirect('/admin/medList');
    })
    .catch( err => {
        console.log(err);
        res.redirect('/');
    });
};