const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
    email:{
        type: String, 
        required: true,
    },
    admin:{
        type: Boolean,
        require: true,
        default: false,
    },createdAt: {
        type: Date,
        default: Date.now(),
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);