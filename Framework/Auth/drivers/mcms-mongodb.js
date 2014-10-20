module.exports = (function(App,User){
    //User is the user model
    return {
        handlers : {
            findById : function(id,callback){
                User.findById(id,function(err,user){
                    callback(err,user);
                });
            },
            findByCredentials : function(credentials,callback){
                User.findOne(credentials,function(err,user){
                    callback(err,user);
                });
            },
            encryptPassword : function(id,callback){

            }
        }
    }
});