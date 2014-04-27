module.exports = exports = function(){


    return {
        onRequest: function(callback) {
            server.on('request', callback);
        },
        onError: function(callback) {
            if (callback) {
                server.on('error', callback);
            } else {
                server.on('error', function (err, buff, req, res) {
                    console.log(err.stack);
                });
            }
        },
        start: function(port) {
            server.serve(port);
        }
    }
};
