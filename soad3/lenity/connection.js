const mongoose = require('mongoose');
const models = require('../models/models');
const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



Profile= models.profile;
Food = models.food;
Item = models.item;
Executive = models.executive;
NGO = models.ngo;

require('../passport');


// var item1 = new Item({
//   category: 'books',
//     location: 'agra',
//     donatedBy: 'vasu',
//     description: 'hsglsfhsf',
//     quantity: 2,
//     age : 10,
//     confirmationStatus:0,
//     status:false,
//     delivery_location: 'Tada'
// });
//  item1.save();
//-------------------uncomment
//  var exe1 = new Executive({
//     username : "srishti",
//     contact : 9586412578.0,
//     email : "srishti.e17@iiits.in",
//     password : "root1234",
//     address : "sri city",
//     geometry : {
//         "type" : "point",
//         "coordinates" : [ 
//             79.980175, 
//             13.5268678
//         ]
//     },
//     food : [],
//     item : [],
//     ngo: []
// })
// exe1.save();

// var exe2 = new Executive({
//     username : "chethna",
//     contact : 9586412578.0,
//     email : "mendonchethna@gmail.com",
//     password : "root1234",
//     address : "Arambakkam",
//     geometry : {
//         "type" : "point",
//         "coordinates" : [ 
//             80.0690056, 
//             13.5426818
//         ]
//     },
//     food : [],
//     item : [],
//     ngo: []
// })
// exe2.save();
//----------------------------



// var pro1 = new Profile({
//     name: 'sssg',
//     email: 'sdfs',
//     contact: 344,
//     food: [food1],
//     item: [item1]
// });
// pro1.save();

//ES6 PROMISES
mongoose.Promise = global.Promise;

//connect to db 
mongoose.connect('mongodb://localhost/lenity',{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

mongoose.connection.once('open',function(){
    console.log('connection has been made, now make fireworks 1 2 3...');
    

}).on('error', function(error){
    console.log('Connection error: ',error);
});
