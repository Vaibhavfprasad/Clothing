const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        name:Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().allow("",null),
        category: Joi.string().required(),
        subCategory : Joi.string().required(),
        date: Joi.date().required(),
        sizes: Joi.string().required(),
    }).required(),
});



module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});