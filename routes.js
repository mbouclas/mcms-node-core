module.exports = (function(App,Package){
    var Config = App.serviceProviders[Package.packageName].Config;
    //Change stuff about the views
    if (typeof Config.viewEngine != 'undefined'){
        App.server.set('view engine', Config.viewEngine);
    }

    App.server.set('views', __dirname + '/views');
    App.registerViews(__dirname + '/views');


    App.server.get('/admin', function (req, res) {

        res.render('partials/index',{
            title: 'Layout Test',
            items: [
                'apple',
                'orange',
                'banana'
            ]
        });

    });

    return App;
});
