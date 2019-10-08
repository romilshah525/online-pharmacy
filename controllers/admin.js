const Medicine = require('../models/medicine');

const ITEMS_PER_PAGE = 2;
let total ;

exports.getMedicineList = (req, res) => {
    const page =+ req.query.page || 1;
    Medicine.find()
    .countDocuments()
    .then( totalMed => {
        total = totalMed;
        return Medicine.find()
            .skip((page-1)*(ITEMS_PER_PAGE))
            .limit(ITEMS_PER_PAGE)
    })
    .then( medicine => {
        res.render('admin/med-list',{
            medicines: medicine,
            length: medicine.length,
            admin: true,
            hasNextPage: ITEMS_PER_PAGE*page < total,
            hasPrevPage: page > 1,
            currPageNo: page,
            prevPageNo: page - 1,
            nextPageNo: page + 1,
            hasNextNextPage: ITEMS_PER_PAGE*(page+1) < total,
            nextNextPageNo: page + 2,
            hasPrevPrevPage: page > 2,
            prevPrevPageNo: page - 2,
            lastPageNo:Math.ceil(total/ITEMS_PER_PAGE)
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
        return medicine.save();
    })
    .then( medicine => {
        res.redirect('/admin/medicine-list');
    })
    .catch( err => {
        console.log(err);
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
    const price = req.body.price;
    Medicine.findOne({name: name})
    .then( medicineDoc => {
        if(medicineDoc) {
            console.log(`${medicineDoc} already exists!`);
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
        res.redirect('/admin/medicine-list');
    })
    .catch( err => {
        console.log(err);
        res.redirect('/admin/medicine-list');
    });
};