const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shahromil525@gmail.com',
        pass: 'rldegzyqjsqirwpf'
    }   
});

exports.getSignUp = (req, res) => {
    res.render('auth/signup');
};

exports.postSignUp = (req, res) => {
    const email = req.body.email;
    const pwd = req.body.pwd;
    const salt = 12;
    let emailReceiver = email;
    User.findOne({email: email})
    .then( userDoc => {
        if(userDoc){
            return res.redirect('/signup');
        }
        return bcrypt.hash(pwd, salt)
        .then( hashedPwd => {
            const user = new User({
                email: email,
                pwd: pwd,
                password: hashedPwd,
                cart: {items:[]}
            });
            return user.save();
        })
        .then( () => {
            let mailOptions = {
                from: 'shahromil525@gmail.com',
                to: emailReceiver,
                subject: 'Email Registered on ABC Pharmacy!',
                text: 'Hey there, your account has been created!'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(`Email sent - response: ${info.response}`);
                }
            })
            .then( ()=> {
                res.redirect('/login');
            });
        })
        .catch(err => {
            console.log(`${err}`);
            res.redirect('/signup');
        });
    })
    .catch(err => {
        console.log(`Error: ${err}`);
        res.redirect('/');
    });
};

exports.getLogin = (req, res) => {
    res.render('auth/login');
};

exports.postLogin = (req, res, next) => {
    const emailEntered = req.body.email;
    const pwd = req.body.pwd;
    User.findOne({email: emailEntered})
    .then(user => {
        if(!user){
            return res.redirect('/login');
        }
        bcrypt
        .compare(pwd, user.password)
        .then( isMatched => {
            if(isMatched) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    if(err) {
                        console.log(err);
                    }
                    res.redirect('/');
                });
            }
            res.redirect('/login'); 
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/login');
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });
};

exports.getResetPassword = (req, res) => {
    res.render('auth/reset-password');
};

exports.postResetPassword = (req, res) => {
    var email = req.body.email;
    crypto.randomBytes(32, (err, bufferedBytes) => {
        if(err) {
            console.log(err);
        } else {
            const token = bufferedBytes.toString('hex');
            User.findOne({email: email})
                .then( user => {
                    if(!user) {
                        console.log('No User Found');
                        return res.redirect('/signup');
                    } 
                    user.resetToken= token;
                    user.resetTokenExpirationDate= Date.now() + 3600000;
                    return user.save();
                })
                .then( user => {
                    let mailOptions = {
                        from: 'shahromil525@gmail.com',
                        to: user.email,
                        subject: 'Reset Password',
                        html:`<h3>
                        Password Reset Link.
                        <a href="http://localhost:3000/reset-password/${token}">Click Here</a></h3>`
                    }
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log(`Email sent - response: ${info.response}`);
                        }
                    })
                    res.redirect('/login');
                })
                .catch( err => {
                    console.log(err);
                });
            }
    });
}

exports.getNewPassword = (req, res) => {
    const token = req.params.token;
    User.findOne({
        resetToken : token,
        resetTokenExpirationDate: {
            $gt: Date.now()
        }})
        .then( user => {
            res.render('auth/new-password',{
                email: user.email,
                token: token,
                userId: user._id.toString()
            });
        });
};

exports.postNewPassword = (req, res) => {
    const pwd = req.body.pwd;
    const userId = req.body.userId;
    const token = req.body.token;
    let fetchedUser;
    User.findOne({
            resetToken : token,
            resetTokenExpirationDate: {$gt: Date.now() },
            _id: userId
        })
        .then( user => {
            fetchedUser = user;
            user.pwd = pwd;
            return bcrypt.hash(pwd, 12);
        })
        .then( hashedPwd => {
            fetchedUser.password = hashedPwd;
            fetchedUser.resetToken = undefined;
            fetchedUser.resetTokenExpirationDate = undefined;
            return fetchedUser.save();
        })
        .then( user => {
            res.redirect('/login');
        })
        .catch( err => {
            console.log(err);
        })
 
}