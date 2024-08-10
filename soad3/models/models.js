const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Create schema and model

const foodSchema = new Schema({
    donatedBy: String,
    quantity: Number,
    location: String,
    date: Date,
    delivery_location: String,
    status: Boolean
 });


 const itemSchema = new Schema({
    donatedBy: String,
    user:String,
    category: String,
    location: String,
    description: String,
    quantity: Number,
    age : Number,
    delivery_location: String,
    status: Boolean,
    confirmationStatus : Number
 });
 const requestSchema = new Schema({
   requestor : String,
   itemRequested : [itemSchema]
 });

const userSchema = new Schema({
    methods: {
        type: [String],
        enum: ['local', 'google','facebook'],
        required: true
      },
    local:{
        username: {
            type: String,

        },
        email: {
            type: String,
            lowercase: true
        },
        password:{
            type: String,
        },
        secretToken: String,
        active: Boolean,

    },
    google: {
        id:{
            type:String,
        },email: {
            type: String,
            lowercase:true
        },
        username: {
            type: String,
        }

    },
    facebook:{
        id:{
            type:String,
        },email: {
            type: String,
            lowercase:true
        }

    },
    firstname: {
        type: String,
        
    },
    lastname: {
        type: String,
       
    },
    contactno: {
        type: Number,
    },
    address: {
        type: String,
    },
    food: [foodSchema],
    item: [itemSchema],
});

const ngoSchema = new Schema({
    user: Object,
    donatedBy: String,
    donatedTo: String,
    category: String,
    quantity: Number,
    location: String,
    status: Boolean    
});



const inquirySchema = new Schema ({
    name: String,
    address: String,
    category : String,
    quantity : Number
})



// const executiveSchema = new Schema({
//     username: {
//         type: String
//     },
//     email: {
//         type: String,
//         lowercase: true
//     },
//     password: {
//         type: String
//     },
//     address: {
//         type: String
//     },
//     contactno: {
//         type: Number
//     },
//     food: [foodSchema],
//     item: [itemSchema],
// });

const executiveSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    geometry: {
        type:{
            type:String,
            default:"Point"
        },
        coordinates:{
            type:[Number],
            index:"2dsphere"
        }
    },
    contactno: {
        type: Number
    },
    food: [foodSchema],
    item: [itemSchema],
    ngo: [ngoSchema]
});



userSchema.methods.isvalidPassword = async function(newPassword) {
    try{
        return await bcrypt.compare(newPassword, this.local.password);
    }catch(error){
        throw new Error(error);
    }
}

executiveSchema.methods.isvalidPassword = async function(newPassword) {
    try{
        return await bcrypt.compare(newPassword, this.password);
    }catch(error){
        throw new Error(error);
    }
}

const Food = mongoose.model('food', foodSchema);
const Item = mongoose.model('item', itemSchema);
const Profile = mongoose.model('profile', userSchema);
const NGO = mongoose.model('ngo', ngoSchema);
const Executive = mongoose.model('executive', executiveSchema);
const Request = mongoose.model('request', requestSchema);
const Inquiry = mongoose.model('inquiry', inquirySchema);


 //exporting it so we can use in other files in the project

//  module.exports = Food;
//  module.exports = Item;
module.exports = {profile:Profile, food: Food, item:Item, executive: Executive, request:Request, ngo: NGO, inquiry: Inquiry};
 

module.exports.hashPassword = async function(password) {
    try{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }catch(error){
        throw new Error('Hashing failed',error);
    }
}


