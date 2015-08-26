module.exports = (function(App,Engine){
    var settings = (typeof Engine == 'undefined') ? App.Config.crypt[App.Config.crypt.default] : Engine.settings;
    var crypto = require('crypto'),
        algorithm = settings.algorithm,
        password = settings.secret;

    return {
        encrypt : function(text){
            var cipher = crypto.createCipher(algorithm,password);
            var crypted = cipher.update(text,'utf8','hex');
            crypted += cipher.final('hex');
            return crypted;
        },
        decrypt : function(string){
            var decipher = crypto.createDecipher(algorithm,password);
            var dec = decipher.update(text,'hex','utf8');
            dec += decipher.final('utf8');
            return dec;
        },
        check : function(string,hash){

        }
    }
});