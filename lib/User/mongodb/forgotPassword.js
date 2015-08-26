module.exports = (function (App, Connection) {
    var Model = Connection.models.User;


    return function (email, callback) {
        Model.findOne({email: email}).exec(function (err, User) {
            if (err || !User) {
                return callback('invalidUser');
            }

            User.update({passwordReminder : {
                token : App.Helpers.common.str_random(40),
                created_at : new Date()
            }},function(err){
                App.Event.emit('user.passwordReminder',User);
                return callback(null, User);
            });
        });
    }
});