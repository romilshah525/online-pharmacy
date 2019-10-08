const nodemailer = require('nodemailer');

const Medicine = require('../models/medicine');
const Order = require('../models/order');
const ITEMS_PER_PAGE = 2;
let total ;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shahromil525@gmail.com',
        pass: 'rldegzyqjsqirwpf'
    }   
});

exports.getHome = (req, res) => {
    res.render('pharmacy/index');
};

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
        res.render('pharmacy/med-list',{
            medicines: medicine,
            length: medicine.length,
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

exports.getCart = (req, res) => {
    req.user
    .populate('cart.items.medicineId')
    .execPopulate()
    .then(user => { 
        const medicines = user.cart.items;
        res.render('pharmacy/cart', {
            length: medicines.length,
            medicines: medicines
        });
    })
    .catch(err => console.log(err));
};

exports.postAddToCart = (req, res) => {
    const medId = req.body.medId;
    Medicine.findById(medId)
    .then( medicine => {
        return req.user.addToCart(medicine);
    })
    .then(result => {
        res.redirect('/medicine-list');
    })
    .catch( err => {
        console.log(`Error: ${err}`);
        res.redirect('/cart');
    });
};

exports.postDeleteFromCart = (req, res) => {
    const medId = req.params.medicineId;
    req.user
    .removeFromCart(medId)
    .then( result => {
        res.redirect('/cart');
    })
    .catch( err => {
        console.log(`Error: ${err}`);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res) => {
    Order.find({ 'userId': req.user._id })
    .then(orders => {
        res.render('pharmacy/orders', {
            orders: orders,
            length: orders.length
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/cart');
    });
};

exports.postOrder = (req, res) => {
    var amt = 0;
    req.user
    .populate('cart.items.medicineId')
    .execPopulate()
    .then( user => {
        const medicines = user.cart.items.map(i => {
            return { quantity: i.quantity, medicine: { ...i.medicineId._doc } };
        });
        medicines.forEach( m => { 
            let p = m.medicine.price;
            let q = m.quantity;
            amt = amt + (p*q);
        });
        const order = new Order({
            userId: req.user,
            medicines: medicines,
            amount: amt
        });
        return order.save();
    })
    .then( result => {
        html=`<!DOCTYPE html>
            <html>
                <body>
                    <head>
                        <style>
                            table {
                                border-collapse: collapse;
                                width: 100%;
                            }
                            table, td, th {
                                border: 1px solid black;
                            }
                            td, th {
                                padding: 2px;
                            }
                        </style>
                    </head>
                    <p>
                        Your order has been successfully placed! Below are the order detaisls:
                    </p>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Price</th>
                        </tr>`;
        result.medicines.forEach( p => {
            html = html + `<tr>
                                <td>${p.medicine.name}</td>
                                <td>${p.quantity}</td>
                                <td>${p.medicine.price}</td>
                                <td>${p.medicine.price*p.quantity}</td>
                            </tr>`;
        });
        html = html + `
                        </table>
                        <p>
                            The total amount payable is <b>Rs. ${result.amount}</b>
                        </p>
                    </body>
                </html>`;
        let mailOptions = {
            from: 'shahromil525@gmail.com',
            to: req.user.username,
            subject: 'Order PLaced on ABC Pharmacy!',
            html: html
        };
        return transporter.sendMail(mailOptions);
    })
    .then( (info, err) => {
        if (err) {
            console.log(err);
            console.log(`Email Not Send!`);
        } else {
            console.log(`Email sent successfully: ${info.response}`);
        }
    })
    .then( () => {
        req.user.clearCart()
        .then((cart) => {
            res.redirect('/orders');
        })
        .catch((resp) => {
            console.log(`Failure: ${resp}`);
            res.redirect('/cart');
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/cart');
    });
}

exports.clearCart = (req, res) => {
    req.user.clearCart()
    .then((cart) => {
        res.redirect('/cart');
    })
    .catch((resp) => {
        console.log(`Failure: ${resp}`);
        res.redirect('/cart');
    });
}