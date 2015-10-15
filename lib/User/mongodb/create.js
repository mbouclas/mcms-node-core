module.exports = (function(App,Connection){
    var Model = Connection.models.User,
        async = require('async'),
        lo = require('lodash'),
        Validator = require('obj-validator').Checker,
        validationRules = App.Config.user.createRules || {
                firstName : 'isAlpha',
                lastName : 'isAlpha',
                email : 'isEmail',
                password : 'notNull'
            };

    function create(user_data,callback){
        if (!user_data.email){
            return callback('invalidUser');
        }

        var asyncArr = [
            checkIfUserExists.bind(null,user_data),
            validate,
            saveUser
        ];

        async.waterfall(asyncArr,function(err,user){
            if (err){
                return callback(err);
            }
            App.Event.emit('user.created',user);
            callback(null,user);
        });

    }

    function checkIfUserExists(user,next){
        Model.findOne({email : user.email}).exec(function(err,res){
            if (err) {
                return next(err);
            }

            if (res){
                return next('userExists');
            }

            return next(null,user);
        });
    }

    function validate(user,next){
        var errors = [],
            rules = {};
        lo.forEach(validationRules,function(rule,field){
            rules[field] = Validator[rule]();
        });

        var validate = Validator(rules);

        try {
            validate(user);
            return next(null,user);
        } catch(e){
            App.Log.error(e);
            return next(e);
        }


    }

    function saveUser(user,next){
        user.password = App.Crypt.make(user.password);
        user.active = user.active || 0;
        user.userClass = user.userClass || 'U';
        user.username = user.username || user.email;
        user.settings = user.settings || {profile : {firstName : user.firstName, lastName : user.lastName}};
        user.activation_code = App.Helpers.common.str_random(40);

        return  Model(user).save(next);
    }

    return create;
});