module.exports = function (mongoose, modelName) {
    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        username: { type: [String], index: true },
        series: { type: [String], index: true },
        token: { type: [String], index: true },

    });

    mongoose.model(modelName, schema);
};