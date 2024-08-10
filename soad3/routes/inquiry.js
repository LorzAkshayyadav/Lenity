const express = require('express');
const router = require('express-promise-router')();
const models = require('../models/models');
//const Food = models.food;
//const Item = models.item;
const Ngo = models.ngo;
const Request = models.inquiry;

router.route('/:category')
    .post(async (req, res, next) => {
        try{
        var category = req.params.category;
        category = category.toLowerCase();
        console.log(category);
        var count = 0;
        
            const item = await Ngo.find({ 'category': category });
            console.log(item);
            
            for (i=0; i<item.length; i++){
                count = count + item[i].quantity;
            }
            console.log(count);
            
        
        res.json({ Available: count });
        }catch(error){
            next(error);
        }
    });






module.exports = router;