module.exports = (function(App,bodyParser){
    var expressSession = require('express-session');

    App.server.use(bodyParser.urlencoded({
        extended: true
    }));
    App.server.use(bodyParser.json());

    var store = require(__dirname + '/drivers/' + App.Config.auth[App.Config.auth.default].store)(App,expressSession);

    App.server.use(expressSession(store));
});