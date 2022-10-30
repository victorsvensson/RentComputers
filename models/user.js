const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    isAdmin: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});
UserSchema.plugin(passportLocalMongoose); //this is added to schema like field for password and username field, also gives us a few more methods to use

module.exports = mongoose.model("User", UserSchema);
