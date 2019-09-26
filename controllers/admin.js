const Medicine = require('../models/medicine');

exports.getMedicineList = (req, res) => {
    Medicine.find()
    .then( medicine => {
        res.render('admin/med-list',{
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

exports.getEditMedicine = (req, res) => {
    const id = req.params.medId;
    const edit = req.query.edit;
    Medicine.findById(id)
    .then( medicine => {
        res.render('admin/add-med',{
            edit: edit,
            medicine: medicine
        });
    })
    .catch( err => {
        console.log(err);
        res.redirect('/admin/medicine-list');
    });
};

exports.postEditMedicine = (req, res) => {
    const id = req.params.medId;
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
        console.log("Medicine Updated Successfully!");
        res.redirect('/admin/medicine-list');
    })
    .catch( err => {
        console.log(err);
        console.log("Medicine Updated Failed!");
        res.redirect('/admin/medicine-list');
    });
};

exports.getAddMedicine = (req, res) => {
    res.render('admin/add-med',{
        edit: false
    });
};

exports.postAddMedicine = (req, res) => {
    const name = req.body.name;
    const expDate = req.body.expDate;
    console.log(expDate);
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
        res.redirect('/admin/medicine-list');
    })
    .catch(err => {
        console.log(err);
        res.redirect('/admin/add-medicine');
    });
};

exports.deleteMedicine = (req, res) => {
    const id = req.params.medId;
    Medicine.findByIdAndRemove(id)
    .then( medicine => {
        console.log(`${medicine.name} deleted successfully!`);
        res.redirect('/admin/medicine-list');
    })
    .catch( err => {
        console.log(err);
        res.redirect('/admin/medicine-list');
    });
};