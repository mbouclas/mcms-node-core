module.exports = (function (App, Connection) {
    var Model = Connection.models.User;


    return function (token, callback) {
        Model.findOne({'passwordReminder.token': token}).exec(function (err, User) {

            if (err || !User) {
                return callback('invalidUser');
            }

            return callback(null, User);

        });
    }
});