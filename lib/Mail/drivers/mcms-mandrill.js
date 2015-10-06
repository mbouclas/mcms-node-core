module.exports = (function(Config){
    var lo = require('lodash');
    var mandrill = require('mandrill-api/mandrill');
    var mandrill_client = new mandrill.Mandrill(Config.key);

    return {
        client : mandrill_client,
        formatMessage : formatMessage,
        send : send
    };

    //options can be omitted
    function send(from,to,subject,body,options,callback){
        if (arguments.length < 5) {
            return 'missing some arguments there...';
        }
        if (arguments.length == 5 && lo.isFunction(arguments[4])){
            var callback = arguments[4];
            var options = {};
        }

        options = lo.merge({
            async : true,
            ip_pool : "Main Pool"
        },Config.options);

        mandrill_client.messages.send({"message": formatMessage(from,to,subject,body), "async": options.async,
            "ip_pool": options.ip_pool}, function(result) {
            callback(null,result);
        }, function(e) {
            callback(e);
        });
    }

    function formatMessage(from,to,subject,body){
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