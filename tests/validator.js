var Checker = require('obj-validator').Checker,
    validate;
var User = {
        email: 'aaa@gmail.com',
        firstName: 'mike',
        lastName: 'Bouclas',
        password: '',
        preferences: {
            subscribeToNewsletter: true
        }
    },
    validationRules = {
        firstName : 'isAlpha',
        lastName : 'isAlpha',
        email : 'isEmail',
        password : 'notNull'
    },
    rules = {};

for (var field in validationRules){
    rules[field] = Checker[validationRules[field]]()
}

validate = Checker(rules);

try {
    validate(User);
    console.log('valid')
}
catch(e){
    console.log(e)
}
