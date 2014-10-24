module.exports = (function(App){
    App.View = {};

    App.View.engine = require('hbs');

    App.View.hbsutils = require('hbs-utils')(App.View.engine);


    App.registerViews = function(path,callback){
        App.View.hbsutils.registerPartials(path,{
            compiled: false
        },function(){
            callback();
        });

    };

});