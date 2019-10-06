const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const express = require('express');
const csrf = require('csurf');
const path = require('path');

const errorController = require('./controllers/error');
const pharmRoutes = require('./routes/pharmacy');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const MONGODB_URI = "mongodb://localhost/pharmacy";
const csrfProtection = csrf();
const store = new MongoDBStore({
        uri: MONGODB_URI,
        collection: 'sessions'
    });

const app = express();
const port = 3001;

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
app.use(flash());
app.use((req, res, next ) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then( user => {
        req.user = user;
        next();
    })
    .catch( err => {
        console.log(err);
    });
});
app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    if(res.locals.isAuthenticated) {
        res.locals.isAdmin = req.session.user.isAdmin;
    } else {
        res.locals.isAdmin = false;
    }
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin/',adminRoutes);
app.use(authRoutes);
app.use(pharmRoutes);
app.use(errorController.get404);

mongoose
.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useFindAndModify: false
        })
    .then( res => {
        app.listen(port, ()=>{
            console.log(`==> Server started at http://localhost:${port}/`);
            });
        })
    .catch(err => {
        console.log(err);
    });

// "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath "D:\Studies\Projects\Web Development (Node JS)\OnlinePharmacy\data"
exports.port = port;