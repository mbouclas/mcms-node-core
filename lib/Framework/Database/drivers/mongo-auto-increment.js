module.exports = exports = function autoID (schema, options) {
    var model = options.model;
    var DB = options.DB;
    var options = options.options;
    var autoIdName = (typeof options.autoIdName == 'undefined') ? 'autoID' : options.autoIdName;
    var autoIdObj = {};
    autoIdObj[autoIdName] = Number;

    schema.add(autoIdObj);

    schema.pre('save', function (next) {
        var that = this;

        DB.collection(model).count(function(err,res){
            that.autoID = res+1;
            next();
        });

    })

    if (options && options.index) {
        schema.path(autoIdName).index(options.index)
    }
}