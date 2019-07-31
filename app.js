const bodyParser = require('body-parser');
const User = require('./models/user');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

const pharmRoutes = require('./routes/pharmacy');
const adminRoutes = require('./routes/admin');
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin/',adminRoutes);
app.use(pharmRoutes);
app.use((req, res, next ) => {
    User.findById('5d41c4b8b29f3845ec94732e')
    .then( user => {
        req.user = user;
        next();
    })
    .catch( err => {
        console.log(err);
    });
});

mongoose
    .connect("mongodb://localhost/pharmacy")
    .then(res => {
        User.findOne().then( user => {
            if(!user) {
                const user = new User({
                    name: 'Romil',
                    email: 'romilshah525@gmail.com',
                    cart: {items: []}
                });
                user.save();
            }
        });
        app.listen(port, ()=>{
            console.log("Server started at Port :" + port);
            });
        })
    .catch(err => {
        console.log(err);
    });

// "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath "D:\Studies\Projects\NodeJS\OnlinePharmacy\data"