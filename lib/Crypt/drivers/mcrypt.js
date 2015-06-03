module.exports = (function(App,Engine){
    var settings = (typeof Engine == 'undefined') ? App.Config.crypt[App.Config.crypt.default] : Engine.settings;
    var MCrypt = require('mcrypt').MCrypt;
    var desEcb = new MCrypt(settings.cipher, 'ecb');
    desEcb.open(settings.secret); // we set the key

    return {
        encrypt : function(string){
            return desEcb.encrypt(string).toString('base64');
        },
        decrypt : function(string){
            var plainText = desEcb.decrypt(new Buffer(string, 'base64'));
            return plainText.toString();
        },
        check : function(string,hash){

        }
    }
});