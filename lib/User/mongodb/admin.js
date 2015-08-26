module.exports = (function(App,Connection){
    var adminClasses = App.Config.admin.adminClasses || ['A','SA'];

    return {
        isAdmin : isAdmin,
        adminClasses : adminClasses
    };

    function isAdmin(user,callback){
        //basic check first
        if (user.userClass && adminClasses.indexOf(user.userClass)) {
            return callback(null,'user is admin')
        }


        return callback(false);
    }
});