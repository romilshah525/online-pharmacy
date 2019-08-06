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
app.use((req, res, next ) => {
    console.log(" ==> Inside user find by id middleware ");
    User.findById('5d46b6a2b21e1842c0de8d7e')
    .then( user => {
        req.user = user;
        // console.log(" ==> User Found :" + user);
        console.log(" ==> exiting user find by id middleware ");
        next();
    })
    .catch( err => {
        console.log(err);
    });
});
app.use('/admin/',adminRoutes);
app.use(pharmRoutes);

mongoose
    .connect("mongodb://localhost/pharmacy")
    .then( res => {
        console.log(" ==> Connected to database successfully..");
        User.findOne().then( user => {
            if( !user ) {
                const user = new User({
                    name: 'Romil',
                    email: 'romilshah525@gmail.com',
                    cart: {items: []}
                });
                user.save();
                console.log(" ==> User Saved :" + user.name);
            }
            // } else {
                // console.log(" ==> User Logged In :" + user.name);
            // }
        });
        app.listen(port, ()=>{
            console.log("Server started at Port :" + port);
            });
        })
    .catch(err => {
        console.log(err);
    });

// "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath "D:\Studies\Projects\NodeJS\OnlinePharmacy\data"