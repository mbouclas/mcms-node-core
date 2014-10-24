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
            findOrCreate : function(credentials,callback){

            },
            encryptPassword : function(id,callback){
                User.findOrCreate({ accessToken: 'sdepold' }, { job: 'Technical Lead JavaScript' })
            }
        }
    }
});