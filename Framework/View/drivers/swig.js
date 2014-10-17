module.exports = (function(App){
    var swig = require('swig');
    App.View = {};

    App.server.engine('html', swig.renderFile);
    App.server.set('view engine', 'html');
    App.server.set('view cache', false);
// To disable Swig's cache, do the following:
    swig.setDefaults({ cache: false });

    App.registerViews = function(path,callback){

        swig.setDefaults({ loader: swig.loaders.fs(path)});
    };

});