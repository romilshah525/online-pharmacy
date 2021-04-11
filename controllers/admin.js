const Medicine = require("../models/medicine");

const ITEMS_PER_PAGE = 2;
let total;

exports.getEditMedicine = (req, res) => {
  const id = req.params.medId;
  const edit = req.query.edit;
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  Medicine.findById(id)
    .then((medicine) => {
      res.render("admin/add-med", {
        edit: edit,
        error: error,
        medicine: medicine,
      });
    })
    .catch((err) => {
      console.log(err);
      req.flash("err", "Couldn't load the page");
      res.redirect("/medicine-list");
    });
};

exports.postEditMedicine = (req, res) => {
  const id = req.params.medId;
  const name = req.body.name;
  const price = req.body.price;
  const medType = req.body.medType;
  const capacity = req.body.capacity;
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  Medicine.findById(id)
    .then((medicine) => {
      medicine.name = name;
      medicine.price = price;
      medicine.capacity = capacity;
      return medicine.save();
    })
    .then((medicine) => {
      req.flash("err", "Changes upated successfully!");
      res.redirect("/medicine-list");
    })
    .catch((err) => {
      console.log(err);
      req.flash("err", "Couldn't save the changes");
      res.redirect("/medicine-list");
    });
};

exports.getAddMedicine = (req, res) => {
  // if(error.length > 0) {
  //     error = error[0];
  // } else {
  // 	error = null;
  // }
  res.render("admin/add-med", {
    edit: false,
    // error: error
  });
};

exports.postAddMedicine = (req, res) => {
  const name = req.body.name;
  const expDate = req.body.expDate;
  const price = req.body.price;
  const capacity = req.body.capacity;
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  Medicine.findOne({ name: name }).then((medicineDoc) => {
    if (medicineDoc) {
      console.log(`${medicineDoc} already exists!`);
      req.flash("err", "Item already exists!");
      return res.redirect("/add-medicine");
    }
  });
  const medicine = new Medicine({
    name: name,
    expDate: expDate,
    price: price,
    capacity: capacity,
  });
  medicine
    .save()
    .then((med) => {
      req.flash("error", "Medicines added successfully!");
      res.redirect("/medicine-list");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Error while uploading!");
      res.redirect("/admin/add-medicine");
    });
};

exports.deleteMedicine = (req, res) => {
  const id = req.params.medId;
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  Medicine.findByIdAndRemove(id)
    .then((medicine) => {
      req.flash("err", "Medicine couldn't be deleted from cart!");
      res.redirect("/medicine-list");
    })
    .catch((err) => {
      console.log(err);
      req.flash("err", "Couldn't load the page");
      res.redirect("/medicine-list");
    });
};
