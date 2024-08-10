const express = require('express');
const router = require('express-promise-router')();
const models = require('../models/models');
//const Food = models.food;
//const Item = models.item;
const Ngo = models.ngo;
const Request = models.inquiry;


router.route('/')
.post(async (req,res, next) => {
    try{
        var { name, address, category, quantity } = req.body;
        category = category.toLowerCase();
        const newRequest = new Request({ name, address, category, quantity });
        await newRequest.save();
          
        res.json({ success: 'Request recorded '});
    }catch(error){
        next(error);
    }
});

module.exports = router;
