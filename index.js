module.exports = (function(App){
    var Core = {
        serviceProvider : require('./lib/ServiceProvider/registerServiceProvider')(App),
        DB : require('./lib/DB/loader')(App),
        Crypt : require('./lib/Crypt/loader')(App),
        Helpers : require('./lib/Helpers/loader')(App),
        Session : require('./lib/Session/session')(App),
        User : require('./lib/User/user'), //will return a function so that you can load at will
        Command : require('./lib/Command/loader'),
        Cache : require('./lib/Cache')(App),
        Queue : require('./lib/Queue')(App),
        Mail : require('./lib/Mail')(App),
        Worker : require('./lib/Queue/taskRunner')(App)
    };

    Core.Helpers.loadHelpers(__dirname + '/lib/Helpers');

    return Core;

});