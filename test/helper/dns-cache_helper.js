module.exports = exports = function(){

    return {
        createDnsResult: function(response, error){
            return {
                res: response,
                err: error
            };
        }
    }
};