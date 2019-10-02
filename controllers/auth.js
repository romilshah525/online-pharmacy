const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shahromil525@gmail.com',
        pass: 'rldegzyqjsqirwpf'
    }   
});

exports.getSignUp = (req, res) => {
    let error = req.flash('error');
    if(error.length > 0) {
        error = error[0];
    } else {
        error = null;
    }
    res.render('auth/signup',{
        error: error
    });
};

exports.postSignUp = (req, res) => {
    const email = req.body.email;
    const pwd = req.body.pwd;
    const salt = 12;
    let emailReceiver = email;
    let error = req.flash('error');
    if(error.length > 0) {
        error = error[0];
    } else {
        error = null;
    }
    User.findOne({email: email})
    .then( userDoc => {
        if(userDoc) {
            req.flash('error','email already exists!');
            console.log('email already exists!');
            return res.redirect('/signup');
        }
        console.log('email doenst exists!');
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
        .then( ( user) => {
            console.log(`user:${user}`);
            console.log(`Sending Mail!`);
            let mailOptions = {
                from: 'shahromil525@gmail.com',
                to: emailReceiver,
                subject: 'Email Registered on ABC Pharmacy!',
                text: 'Hey there, your account has been created!'
            };
            return transporter.sendMail(mailOptions);
        })
        .then( (info, err) => {
            if (err) {
                console.log(`Email Not Send!\n`);
                console.log(err);
            } else {
                console.log(`Email sent successfully: ${info.response}`);
            }
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(`Error:${err}`);
        res.redirect('/');
    });
};

exports.getLogin = (req, res) => {
    let error = req.flash('error');
    if(error.length > 0) {
        error = error[0];
    } else {
        error = null;
    }
    res.render('auth/login',{
        error: error
    });
};

exports.postLogin = (req, res, next) => {
    const emailEntered = req.body.email;
    const pwd = req.body.pwd;
    User.findOne({email: emailEntered})
    .then(user => {
        if(!user) {
            req.flash('error','email not registered !');
            return res.redirect('/login');
        }
        bcrypt.compare(pwd, user.password)
        .then( isMatched => {
            if(isMatched) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    if(err) console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error','invalid password');
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
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
    let error = req.flash('error');
    if(error.length > 0) {
        error = error[0];
    } else {
        error = null;
    }
    res.render('auth/reset-password',{
        error:error
    });
};

exports.postResetPassword = (req, res) => {
    var email = req.body.email;
    crypto.randomBytes(32, (err, bufferedBytes) => {
        if(err) {
            console.log(err);
            return res.redirect('/reset-password');
        }
        const token = bufferedBytes.toString('hex');
        User.findOne({email: email})
        .then( user => {
            if(!user) {
                req.flash('error','email doesn\'t exists');
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
            return transporter.sendMail(mailOptions)
        })
        .then( (info, err) => {
            if (err) {
                console.log(err);
                console.log(`Email Not Send!`);
            } else {
                console.log(`Email sent successfully: ${info.response}`);
            }
            res.redirect('/login');
        })
        .catch( err => {
            console.log(err);
            res.redirect('/reset-password');
        });
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
        let error = req.flash('error');
        if (error.length > 0) {
            error = error[0];
        } else {
            error = null;
        }
        res.render('auth/new-password',{
            email: user.email,
            token: token,
            userId: user._id.toString(),
            error: error
        });
    })
    .catch( () => {
        res.redirect('/reset-password');
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
        res.redirect('/reset-password');
    });
}