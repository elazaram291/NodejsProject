const mongoose = require("mongoose");
const Joi = require("joi");

const ToySchema = new mongoose.Schema({
    id:Number,
    name:String,
    price:Number,
    info:String,
    category:String,
    img_url:String,
    date_created: {
        type: Date, default: Date.now
      },
    userID:String,  
});

const ToyModel = mongoose.model("toys",ToySchema);
exports.ToyModel = ToyModel;


exports.validToy = (_bodyData) => {
    let joiSchema = Joi.object({
        name:Joi.string().min(2).max(99).required(),
        price:Joi.number().min(2).max(9999).required(),
        info:Joi.string().min(4).max(9999).required(),
        category:Joi.string().min(2).max(50).required(),
        img_url:Joi.string().min(2).max(900).allow(),
    })

    return joiSchema.validate(_bodyData);
}