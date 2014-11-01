module.exports = exports = function autoID (schema, options) {
    var model = options.model;
    var DB = options.DB;
    var options = options.options;

    schema.add({ autoID: Number })

    schema.pre('save', function (next) {
        var that = this;

        DB.collection(model).count(function(err,res){
            that.autoID = res+1;
            next();
        });

    })

    if (options && options.index) {
        schema.path('autoID').index(options.index)
    }
}