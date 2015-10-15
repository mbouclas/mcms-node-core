module.exports = (function(App){
    var expressSession = require('express-session');
    var cookieParser = require('cookie-parser');
    var flash = require('connect-flash');
    var csrf = require('csurf');
    var bodyParser = require('body-parser');

    return {
      init : init
    };

    function init(){
        App.server.use(bodyParser.urlencoded({
            extended: true
        }));


        App.server.use(bodyParser.json());

        var store = require(__dirname + '/drivers/' + App.Config.auth.sessionStore)(App,expressSession);

        App.server.use(expressSession(store));
        App.server.use(flash());
        App.server.use(cookieParser(App.Config.auth.sessionSecret));
/*        App.server.use(csrf());

        App.server.use(function(req, res, next){
            if (req.csrfToken){
                res.locals.CSRF = req.csrfToken();
            }

            next();
        });*/

/*        App.server.use(function (err, req, res, next) {
            if (err.code !== 'EBADCSRFTOKEN') return next(err);

            // handle CSRF token errors here
            res.status(403);
            res.send('session has expired or form tampered with');
        });*/
    }
});