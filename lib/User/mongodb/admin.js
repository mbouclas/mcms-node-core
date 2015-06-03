module.exports = (function(App,Connection){
    var adminClasses = [
        'A',
        'SU'
    ];

    return {
        isAdmin : isAdmin
    };

    function isAdmin(user,callback){
        //basic check first
        if (user.userClass && user.userClass.indexOf(adminClasses)) {
            return callback(null,'user is admin')
        }


        return callback(false);
    }
});