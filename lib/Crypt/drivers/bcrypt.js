module.exports = (function(App,Engine){
    var settings = (typeof Engine == 'undefined') ? App.Config.crypt[App.Config.crypt.default] : Engine.settings;
    var bcrypt = require('bcrypt');
    var salt = bcrypt.genSaltSync(settings.salt);

    return {
        make : function(string){
            return bcrypt.hashSync(string, salt);
        },
        check : function(string,hash){
            return bcrypt.compareSync(string, hash); // true
        }
    }

});