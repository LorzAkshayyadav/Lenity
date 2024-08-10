const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return(req,res,next) => {
            const result = Joi.validate(req.body, schema);
            if(result.error) {
                return res.status(400).json(result.error);
            }

            // req.value.body instead req.body
            if(!req.value) { req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
        authSchema: Joi.object().keys({
           
            email: Joi.string().email().required(),
            username: Joi.string().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
         
        })
    },

    signInSchema: {
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
         
        })
    },

    confirmPassword: {
        authSchema: Joi.object().keys({
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
         })
    },

    editProfile: {
        authSchema: Joi.object().keys({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            contactno :Joi.number().min(1000000000).max(9999999999).required(),
            address: Joi.string().required()
         
        })
    },


}