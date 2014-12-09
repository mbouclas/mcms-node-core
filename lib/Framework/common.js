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

common.prototype.calculateExpiry = function(time){
    if (typeof time != 'string'){
        return time;
    }

    var hour = 3600000,
        day = hour * 24,
        month = day * 30,
        year = day * 365;

    var char = time.match(/[a-zA-Z]/g);
    var num = time.match(/\d+/g);
    var expires;

    switch (char[0]){
        case 'd' || 'D' : expires = num * day;
            break;
        case 'm' || 'M' : expires = num * month;
            break;
        case 'Y' || 'Y' : expires = num * year;
            break;
        default : expires = hour;
            break;
    }

    return expires;
};

module.exports = common;