// const express = require('express');
// const router = express.Router();
// const Joi = require('joi');
// const passport = require('passport');
// const randomstring = require('randomstring');
// const mailer = require('../misc/mailer');
const User = require('../models/models');
// const nodemailer = require('nodemailer');



exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error', 'Sorry, but have to login first!');
      res.redirect('/users/login');
    }
  };
  
exports.isNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash('error', 'Sorry, but you are already logged in!');
      res.redirect('/users/');
    } else {
      return next();
    }
  };