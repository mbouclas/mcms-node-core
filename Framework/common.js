var os = require('os');
var hostname = os.hostname();

function common(){

}

//env is an object
//env[a] can be either a string or an array
common.prototype.detectEnv = function(env){
    for (var a in env){
        if (typeof env[a] == 'string'){
            if (hostname == env[a]){
                return a;
            }
        }
        else if (typeof env[a] == 'object') {
            if (env[a].indexOf(hostname)!= -1){
                return a;
            }
        }
    }

    return 'production';
};

module.exports = common;