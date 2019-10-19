const passportLocalMongoose = require('passport-local-mongoose');
const localStrategy =  require('passport-local');
const session = require('express-session');
const nodemailer = require('nodemailer');
const flash = require('connect-flash');
const passport = require('passport');

const User = require('../models/user');
const App = require('../app');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'shahromil525@gmail.com',
		pass: 'rldegzyqjsqirwpf'
	}   
});

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getSignUp = (req, res) => {
	if (req.flash('error').length > 0) {
		console.log(req.flash('error'));
	}
	res.render('auth/signup');
};

exports.postSignUp = (req, res) => {
	req.body.username
	req.body.name
	req.body.gender
	req.body.address
	req.body.age
	req.body.contact
	const email = req.body.email
	User.register( new User({
		username: req.body.username,
		name: req.body.name,
		gender: req.body.gender,
		address: req.body.address,
		age: req.body.age,
		contact: req.body.contact,
		 }),
		req.body.password,
		function(err, user) {
			if(err) {
				req.flash('error','Enter valid credentials!');
				console.log(`Error:${err}`);
				return res.redirect('/signup');
			}
			console.log(`User Saved Details:${user}`);
			passport.authenticate('local')(req, res, function(){
				console.log(`Sending mail to : ${user.username}...\n`);
				let mailOptions = {
					from: 'shahromil525@gmail.com',
					to: user.username,
					subject: 'Email Registered on ABC Pharmacy!',
					text: `Hey there, your account has been created!\n\nYour Username is ${user.username}`
				};
				transporter.sendMail(mailOptions, (err, info) => {
					if (err) {
						console.log(`Email Not Send!\n`);
						console.log(err);
					} else {
						console.log(`Email sent successfully: ${info.response}`);
					}
					res.redirect('/login');
				});
					res.redirect('/login');
			});
		}
	);
};

exports.getLogin = (req, res) => {
	console.log(`----->ERROR:${req.flash('error')}`);
	console.log(`----->failureFlash:${req.flash('failureFlash')}`);
	console.log(req);
	
	res.render("auth/login");
};

exports.postLogin = (req, res) => {
	console.log(`REQUEST:${req}`);
	passport.authenticate('local', {
		successRedirect: '/medicine-list',
		failureRedirect: '/login',
		failureFlash: 'Invalid Username or Password!'
		// failureFlash: true
	}), function(req, res) {
		res.redirect('/medicine-list');
	}
}

exports.getLogout = (req, res) => {
	req.logout();
	res.redirect('/');
};

// exports.getResetPassword = (req, res) => {
//     let error = req.flash('error');
//     if(error.length > 0) {
//         error = error[0];
//     } else {
//         error = null;
//     }
//     res.render('auth/reset-password',{
//         error:error
//     });
// };

// exports.postResetPassword = (req, res) => {
//     var email = req.body.email;
//     crypto.randomBytes(32, (err, bufferedBytes) => {
//         if(err) {
//             console.log(err);
//             return res.redirect('/reset-password');
//         }
//         const token = bufferedBytes.toString('hex');
//         User.findOne({email: email})
//         .then( user => {
//             if(!user) {
//                 req.flash('error','email doesn\'t exists');
//                 return res.redirect('/signup');
//             } 
//             user.resetToken= token;
//             user.resetTokenExpirationDate= Date.now() + 3600000;
//             return user.save();
//         })
//         .then( user => {
//             let mailOptions = {
//                 from: 'shahromil525@gmail.com',
//                 to: user.email,
//                 subject: 'Reset Password',
//                 html:`<h3>
//                 Password Reset Link.
//                 <a href="http://localhost:${App.port}/reset-password/${token}">Click Here</a></h3>`
//             }
//             return transporter.sendMail(mailOptions)
//         })
//         .then( (info, err) => {
//             if (err) {
//                 console.log(err);
//                 console.log(`Email Not Send!`);
//             } else {
//                 console.log(`Email sent successfully: ${info.response}`);
//             }
//             res.redirect('/login');
//         })
//         .catch( err => {
//             console.log(err);
//             res.redirect('/reset-password');
//         });
//     });
// }

// exports.getNewPassword = (req, res) => {
//     const token = req.params.token;
//     User.findOne({
//         resetToken : token,
//         resetTokenExpirationDate: {
//             $gt: Date.now()
//         }})
//     .then( user => {
//         let error = req.flash('error');
//         if (error.length > 0) {
//             error = error[0];
//         } else {
//             error = null;
//         }
//         res.render('auth/new-password',{
//             email: user.email,
//             token: token,
//             userId: user._id.toString(),
//             error: error
//         });
//     })
//     .catch( () => {
//         res.redirect('/reset-password');
//     });
// };

// exports.postNewPassword = (req, res) => {
//     const pwd = req.body.pwd;
//     const userId = req.body.userId;
//     const token = req.body.token;
//     let fetchedUser;
//     User.findOne({
//             resetToken : token,
//             resetTokenExpirationDate: {$gt: Date.now() },
//             _id: userId
//     })
//     .then( user => {
//         fetchedUser = user;
//         user.pwd = pwd;
//         return bcrypt.hash(pwd, 12);
//     })
//     .then( hashedPwd => {
//         fetchedUser.password = hashedPwd;
//         fetchedUser.resetToken = undefined;
//         fetchedUser.resetTokenExpirationDate = undefined;
//         return fetchedUser.save();
//     })
//     .then( user => {
//         res.redirect('/login');
//     })
//     .catch( err => {
//         console.log(err);
//         res.redirect('/reset-password');
//     });
// }