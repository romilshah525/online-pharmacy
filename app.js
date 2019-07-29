const bodyParser = require('body-parser');
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

app.use('*', (req, res) => {
    console.log('No path found!');
    res.redirect('/');
});

// app.listen(port, () => {
//     console.log("Server Started At Port "+port);
// });

mongoose
    .connect("mongodb://localhost/pharmacy")
    .then(res => {
        app.listen(3000, ()=>{
            console.log("Server started at 3000");
            });
        })
    .catch(err => {
        console.log(err);
    });