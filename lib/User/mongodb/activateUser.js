module.exports = (function (App, Connection) {
    var Model = Connection.models.User;

    return function (token, callback) {
        Model.findOne({activation_code: token, activated_at: null})
            .exec(function (err, user) {
                if (err || !user) {
                    return callback('invalidUser');
                }

                user.update({activated_at : new Date(),active : 1},function(){
                    App.Event.emit('user.activated',user);
                    callback(null, 'valid');
                });

            });
    }
});