const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getSignUp = (req, res) => {
    res.render('auth/signup',{
        pageTitle: 'Sign Up Page', 
        mainContent: 'Welcome to Sign up page'
    });
};

exports.postSignUp = (req, res) => {
    const email = req.body.email;
    const pwd = req.body.pwd;
    // const cnfrmpwd = req.body.cnfrmpwd;
    const salt = 12;
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
        .then(result => {
            console.log(`User Created Successfully: ${result.email}`);
            res.redirect('/login');
        });
    })
    .catch(err => {
        console.log(`Error: ${err}`);
        res.redirect('/');
    });
};

exports.getLogin = (req, res) => {
    res.render('auth/login',{
        pageTitle: 'Login Page', 
        mainContent: 'Welcome to Log In page'
    });
};

exports.postLogin = (req, res, next) => {
    const emailEntered = req.body.email;
    const pwd = req.body.pwd;
    User.findOne({email: emailEntered})
    .then(user => {
        if(!user){
            console.log('Wrong user!');
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
                    console.log(`User Logged In Correctly: ${user.email}`);
                    res.redirect('/');
                });
            }
            console.log('Wrong password!');
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
        console.log(`User Logged Out!`);
        res.redirect('/');
    });
};