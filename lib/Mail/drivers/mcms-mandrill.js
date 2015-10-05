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
        formatMessage : formatMessage,
        send : send
    };


    function send(message,options,callback){

        mandrill_client.messages.send({"message": message, "async": Options.async, "ip_pool": Options.ip_pool}, function(result) {
            callback(null,result);
        }, function(e) {
            callback(e);
        });
    }

    function formatMessage(from,to,subject,body,extra){
        var messages = [],
            fromEmail = (lo.isObject(from)) ? from.email : from,
            fromName = (lo.isObject(from)) ? from.name : from,
            toEmail = (lo.isObject(to)) ? to.email : to,
            toName = (lo.isObject(to)) ? to.name : to;
        if (lo.isArray(toEmail)){//expect multiple messages

            lo.forEach(toEmail,function(recipient){
                messages.push({
                    "email": recipient.to.email,
                    "name": recipient.to.name,
                    "type": "to"
                });
            });
        } else {
            messages = [{
                "email": toEmail,
                "name": toName,
                "type": "to"
            }];
        }
        return {
            "html": body,
            "subject": subject,
            "from_email": fromEmail,
            "from_name": fromName,
            "to": messages,
            "headers": {
                "Reply-To": fromEmail
            }
        };
    }
});