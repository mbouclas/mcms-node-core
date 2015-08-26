module.exports = {
    sanitizeUserOutput : sanitizeUserOutput
};


function sanitizeUserOutput(user){
    var User = (typeof user.toObject == 'undefined') ? user : user.toObject();
    delete User.password;
    delete User.activated_at;
    delete User.active;
    delete User.remember_token;
    delete User._v;
    User.uid = user._id;
    return User;
}