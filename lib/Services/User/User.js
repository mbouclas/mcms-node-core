module.exports = (function(App){
    var async = require("async");
    function user(){
       this.name = 'User';

    }

    user.prototype.create = function(user){

    };

    user.prototype.get = function(user,callback){
        var userModel = App.serviceProviders.core.models.User;
        async.parallel({
            user : function(callback){
                userModel.findOne(user,function(err,result){
                    callback(null,result);
                });
            },
            users : function(callback){
                userModel.find({},function(err,results){
                    callback(null,results);
                });
            }
        },function(err,results){

            callback(null,results);
        });
/*        Promise.promisifyAll(userModel);
        Promise.promisifyAll(userModel.prototype);

        userModel.findOneAsync(user).then(function(result){
            console.log(result)
            callback(null,result);
        }).then(function(result){

        }).done(function(result){
            console.log(result)
        });*/
/*        userModel.findOne(user,function(err,result){

        });*/
    };

    return user;
});