var express = require('express');
var connection = require('./connection');
var models = require('../models/models');
const cors= require('cors');

// var foodcontroller = require('../controllers/foodController');


//const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
//const mongoose = require('mongoose');
const passport = require('passport');
const mongoose = require('mongoose');
require('../passport');

mongoose.Promise = global.Promise;

//var foodcontroller = require('./controllers/foodcontroller');

var app = express();
app.use(cors());


//set up template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));

// foodcontroller(app);

mongoose.set('useCreateIndex', true);

app.use(morgan('dev'));

// View Engine
app.set('views', path.join(__dirname, '../views'));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }));
app.set('view engine', 'ejs');
      
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));



app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  res.locals.isAuthenticated = req.user ? true : false;
  next();
});

app.use('/', require('../routes/index'));
app.use('/home', require('../routes/foodController'));
app.use('/item', require('../routes/itemController'));
app.use('/users', require('../routes/users'));
app.use('/executive',require('../routes/executive'));
app.use('/ngo', require('../routes/ngo'));
app.use('/inquiry', require('../routes/inquiry'));
app.use('/request', require('../routes/request'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.render('notFound');
});



//listn to port
app.listen(8080);
console.log('You are listening to port 8080');
