module.exports = (function(Config){
    var FiveBeans = require("fivebeans");

    var Queue = {
        connection : {},
        client : {},
        put : put,
        delay : delay,
        getFailed : getFailed
    };

    Queue.client = new FiveBeans.client(Config.host, Config.port);
    Queue.client.connect();
    Queue.client.use(Config.tube, function(err, tubename) {});
    //connect


    return Queue;

    function put(type,payload,callback,priority, delay, ttr){

        priority = priority || 0;
        delay = delay || 0;
        ttr = ttr || 60;
        if (!payload){
            return callback('noPayload');
        }

        var data = {
            type: type,
            payload : payload
        };

        this.client.put(priority, delay, ttr, JSON.stringify(data),callback);

        return this;
    }

    function delay(){

    }

    function getFailed(){

    }
});