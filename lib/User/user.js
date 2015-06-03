module.exports = (function(App,DB,Connection){

    return {
        findOne : require('./' + DB + '/findOne')(App,Connection),
        find : require('./' + DB + '/find')(App,Connection),
        findOrCreate : require('./' + DB + '/findOrCreate')(App,Connection),
        findByCredentials : require('./' + DB + '/findByCredentials')(App,Connection),
        update : require('./' + DB + '/update')(App,Connection),
        create : require('./' + DB + '/create')(App,Connection),
        delete : require('./' + DB + '/delete')(App,Connection),
        settings : require('./' + DB + '/settings')(App,Connection),
        admin : require('./' + DB + '/admin')(App,Connection),
        profile : require('./' + DB + '/profile')(App,Connection)
    };
});