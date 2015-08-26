module.exports = (function(Config){
    var lo = require('lodash');
    var mandrill = require('mandrill-api/mandrill');
    var mandrill_client = new mandrill.Mandrill(Config.key);
    var Options = lo.merge({
        async : true,
        ip_pool : "Main Pool"
    },Config.options);
    return {
        client : mandrill_client,
        send : send
    };


    function send(message,options,callback){

        mandrill_client.messages.send({"message": message, "async": Options.async, "ip_pool": Options.ip_pool}, function(result) {
            callback(null,result);
        }, function(e) {
            callback(e);
        });
    }
});