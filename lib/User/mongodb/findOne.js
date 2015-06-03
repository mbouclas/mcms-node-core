module.exports = (function(App,Connection){
    var userModel = Connection.models.User;

    function findOne(user,callback){
        userModel.findOne(user,function(err,result){
            callback(null,result);
        });
    }

    return findOne;
});