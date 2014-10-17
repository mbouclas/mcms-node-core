module.exports = (function (app) {

    var io = require('socket.io')(app);
    return io;
});