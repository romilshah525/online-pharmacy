const Medicine = require('../models/medicine');

const ITEMS_PER_PAGE = 2;
let total ;

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
        req.flash('err','Couldn\'t load the page');
        res.redirect('/medicine-list');
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
        return medicine.save();
    })
    .then( medicine => {
        res.redirect('/medicine-list');
    })
    .catch( err => {
        console.log(err);
        req.flash('err','Couldn\'t save the changes');
        res.redirect('/medicine-list');
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
    const price = req.body.price;
    Medicine.findOne({name: name})
    .then( medicineDoc => {
        if(medicineDoc) {
            console.log(`${medicineDoc} already exists!`);
            req.flash('err','Medicine already exists!');
            return res.redirect('/add-medicine');
        }
    });
    const medicine = new Medicine ({
            name: name,
            expDate: expDate,
            price: price
        });
    medicine.save()
    .then( med => {
        res.redirect('/medicine-list');
    })
    .catch(err => {
        console.log(err);
        req.flash('error','Error while uploading!');
        res.redirect('/admin/add-medicine');
    });
};

exports.deleteMedicine = (req, res) => {
    const id = req.params.medId;
    Medicine.findByIdAndRemove(id)
    .then( medicine => {
        res.redirect('/medicine-list');
    })
    .catch( err => {
        console.log(err);
        req.flash('err','Couldn\'t load the page');
        res.redirect('/medicine-list');
    });
};