module.exports = (function(App,User){
    //User is the user model
    return {
        handlers : {
            findById : function(id,callback){
                User.find(id).then(function(user){
                    callback(null,user);
                });
            },
            findByCredentials : function(credentials,callback){
                User.find({where : credentials}).then(function(user){
                    callback(null,user);
                });
            },
            encryptPassword : function(id,callback){

            }
        }
    }
});