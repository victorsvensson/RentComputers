const User = require("./models/user");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in!");
        return res.redirect("/login");
    }
    next();
};

isAdminLoggedIn = async (req, res, next) => {
    const isAdmin = await User.findById;
};
