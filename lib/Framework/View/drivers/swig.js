var dir = require('node-dir');
var path = require('path');
var swig = require('swig');

module.exports = (function(App,server){

    App.View = {};
    App.templateEngine = swig;
    server.engine('html', swig.renderFile);
    server.set('view engine', 'html');
    server.set('view cache', false);
// To disable Swig's cache, do the following:
    swig.setDefaults({ cache: false });

    return {
        registerTemplates : function(targetDir,callback){
            driver = (typeof server.viewDriver == 'undefined')
                ? App.Config.view[App.Config.view.default].defaultLoadDriver
                : server.viewDriver;

            return this[driver](targetDir,callback);
        },
        loadViewsInMemory : function(targetDir,callback){
            var templates = {};
            dir.readFiles(targetDir,
                function(err, content, filename , next) {
                    if (err) throw err;

                    App.templates[filename] = content;
                    next();
                },
                function(err, files){
                    if (err) throw err;
                    swig.setDefaults({ loader: swig.loaders.memory(App.templates)});
                    //callback(templates);
                });
        },
        loadViewsFS : function(targetDir,callback){
            swig.setDefaults({ loader: swig.loaders.fs()});
        }
    };

    App.registerViews = function(path,callback){

        swig.setDefaults({ loader: swig.loaders.fs(path)});
    };
    
    App.loadViewsInMemory = function(targetDir,callback){
        var templates = {};
        dir.readFiles(targetDir,
            function(err, content, filename , next) {
                if (err) throw err;

                App.templates[filename] = content;
                next();
            },
            function(err, files){
                if (err) throw err;
                //callback(templates);

            });
    };

    App.registerTemplates = function(){
        swig.setDefaults({ loader: swig.loaders.memory(App.templates)});
    };

});