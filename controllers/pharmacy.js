const nodemailer = require('nodemailer');

const Medicine = require('../models/medicine');
const Order = require('../models/order');
const ITEMS_PER_PAGE = 5;
let total ;

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'shahromil525@gmail.com',
		pass: 'rldegzyqjsqirwpf'
	}
});

exports.getHome = (req, res) => {
	let error = req.flash('error');
	if(error.length > 0) {
		error = error[0];
	} else {
		error = null;
	}
	res.render('pharmacy/index',{
		error: error
	});
};

exports.getMedicineList = (req, res) => {
	let error = req.flash('error');
	if(error.length > 0) {
		error = error[0];
	} else {
		error = null;
	}
	const page =+ req.query.page || 1;
	Medicine.find()
	.countDocuments()
	.then( totalMed => {
		total = totalMed;
		return Medicine.find().skip((page-1)*(ITEMS_PER_PAGE)).limit(ITEMS_PER_PAGE)
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
			lastPageNo:Math.ceil(total/ITEMS_PER_PAGE),
			error: error
		});
	})
	.catch( err => {
		console.log(err);
		req.flash('error','Could not load the page');
		res.redirect('/');
	});
};

exports.getCart = (req, res) => {
	let error = req.flash('error');
	if(error.length > 0) {
		error = error[0];
	} else {
		error = null;
	}
	req.user
	.populate('cart.items.medicineId')
	.execPopulate()
	.then(user => {
		const medicines = user.cart.items;
		res.render('pharmacy/cart', {
			length: medicines.length,
			medicines: medicines,
			error: error,
			prescriptionList: req.user.prescription
		});
	})
	.catch(err => {
		console.log(err);
		req.flash('error','Could not load the page');
		res.redirect('/');
	});
};

exports.getAddToCart = (req, res) => {
	const medId = req.params.medId;
	Medicine.findById(medId)
	.then( medicine => {
		medicine.userId = req.user;
		return req.user.addToCart(medicine);
	})
	.then(result => {
		res.redirect('/medicine-list');
	})
	.catch( err => {
		console.log(`Error: ${err}`);
		req.flash('error','Could not add to cart!');
		res.redirect('/cart');
	});
};

exports.postDeleteFromCart = (req, res) => {
	const medId = req.params.medicineId;
	 Medicine.findById(medId)
	.then( medicine => {
		medicine.userId = null;
	})
	req.user
	.removeFromCart(medId)
	.then( result => {
		res.redirect('/cart');
	})
	.catch( err => {
		req.flash('error','Could not delete from the cart!');
		res.redirect('/cart');
	});
}

exports.getOrders = (req, res) => {
	let error = req.flash('error');
	if(error.length > 0) {
		error = error[0];
	} else {
		error = null;
	}
	Order.find({ 'userId': req.user._id })
	.then(orders => {
		res.render('pharmacy/orders', {
			orders: orders,
			length: orders.length,
			error: error
		});
	})
	.catch(err => {
		console.log(err);
		req.flash('error','Could not get the orders');
		res.redirect('/cart');
	});
};

exports.postOrder = (req, res) => {
	var amt = 0;
	const image = req.file;
	if(!image) {
		req.flash('error','Attach an image');
		return res.render('/cart');
	}
	const imageUrl = image.path;
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
			medicines,
			amount: amt,
			imageUrl
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
						Your order has been successfully placed! Below are the order details!\nYour order id is: ${result._id}
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
			req.flash('error','Unknwn error');
			res.redirect('/cart');
		});
	})
	.catch(err => {
		console.log(err);
		req.flash('error','Could not load the page');
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
		req.flash('error','Could not load the page');
		res.redirect('/cart');
	});
}

exports.getPrescriptions = (req, res) => {
	let error = req.flash('error');
	if(error.length > 0) {
		error = error[0];
	} else {
		error = null;
	}
	
};

exports.getBilling = (req, res) => {
	let error = req.flash('error');
	if(error.length > 0) {
		error = error[0];
	} else {
		error = null;
	}
	res.render('pharmacy/bill',{
		error: error
	});
};

exports.postBilling = (req, res) => {
	let error = req.flash('error');
	if(error.length > 0) {
		error = error[0];
	} else {
		error = null;
	}
	let amt = 0;
	const image = req.file;
	if(!image) {
		req.flash('error','Attach an image');
		return res.render('/cart');
	}
	const imageUrl = image.path;
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
		// const order = new Order({
		// 	userId: req.user,
		// 	medicines,
		// 	amount: amt,
		// 	imageUrl
		// });
		// return order.save();
	})
	// .then( result => {
	// 	html=`<!DOCTYPE html>
	// 		<html>
	// 			<body>
	// 				<head>
	// 					<style>
	// 						table {
	// 							border-collapse: collapse;
	// 							width: 100%;
	// 						}
	// 						table, td, th {
	// 							border: 1px solid black;
	// 						}
	// 						td, th {
	// 							padding: 2px;
	// 						}
	// 					</style>
	// 				</head>
	// 				<p>
	// 					Your order has been successfully placed! Below are the order details!\nYour order id is: ${result._id}
	// 				</p>
	// 				<table>
	// 					<tr>
	// 						<th>Name</th>
	// 						<th>Quantity</th>
	// 						<th>Rate</th>
	// 						<th>Price</th>
	// 					</tr>`;
	// 	result.medicines.forEach( p => {
	// 		html = html + `<tr>
	// 							<td>${p.medicine.name}</td>
	// 							<td>${p.quantity}</td>
	// 							<td>${p.medicine.price}</td>
	// 							<td>${p.medicine.price*p.quantity}</td>
	// 						</tr>`;
	// 	});
	// 	html = html + `
	// 					</table>
	// 					<p>
	// 						The total amount payable is <b>Rs. ${result.amount}</b>
	// 					</p>
	// 				</body>
	// 			</html>`;
	// 	let mailOptions = {
	// 		from: 'shahromil525@gmail.com',
	// 		to: req.user.username,
	// 		subject: 'Order PLaced on ABC Pharmacy!',
	// 		html: html
	// 	};
	// 	return transporter.sendMail(mailOptions);
	// })
	// .then( (info, err) => {
	// 	if (err) {
	// 		console.log(err);
	// 		console.log(`Email Not Send!`);
	// 	} else {
	// 		console.log(`Email sent successfully: ${info.response}`);
	// 	}
	// })
	// .then( () => {
	// 	req.user.clearCart()
	// 	.then((cart) => {
	// 		res.redirect('/orders');
	// 	})
	// 	.catch((resp) => {
	// 		console.log(`Failure: ${resp}`);
	// 		req.flash('error','Unknwn error');
	// 		res.redirect('/cart');
	// 	});
	// })
	// .catch(err => {
	// 	console.log(err);
	// 	req.flash('error','Could not load the page');
	// 	res.redirect('/cart');
	// });
	res.render('pharmacy/bill',{
		error: error,
		amt: amt,
		user: req.user
	});
};