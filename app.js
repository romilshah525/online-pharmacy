const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const User = require('./models/user');
const mongoose = require('mongoose');
const express = require('express');
const csrf = require('csurf');
const path = require('path');

const errorController = require('./controllers/error');
const pharmRoutes = require('./routes/pharmacy');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();
const MONGODB_URI = "mongodb://localhost/pharmacy";
const port = 3000;
const store = new MongoDBStore({
        uri: MONGODB_URI,
        collection: 'sessions'
    });
const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
        })
    );
app.use(csrfProtection);
app.use((req, res, next ) => {
    if (!req.session.user) {
        return next();
    }
    User.findById('5d53e4bcd2b1f91fb8d98ecb')
    .then( user => {
        req.user = user;
        next();
    })
    .catch( err => {
        console.log(err);
    });
});

app.use('/admin/',adminRoutes);
app.use(authRoutes);
app.use(pharmRoutes);
app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then( res => {
        app.listen(port, ()=>{
            console.log("==> Server started at Port :" + port);
            });
        })
    .catch(err => {
        console.log(err);
    });

// "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath "D:\Studies\Projects\Web Development (Node JS)\OnlinePharmacy\data"