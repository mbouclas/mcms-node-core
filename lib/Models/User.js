module.exports = function (mongoose, modelName) {
    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        username: { type: String, index: true },
        password: { type: String, index: true },
        email: { type: String, index: true },
        firstName: String,
        lastName: String,
        active: Number,
        activated_at: Date,
        created_at: Date,
        updated_at: Date,
        remember_token : String,
        userClass : String,
        permissions : {},
        preferences : {},
        settings : {}
    });
    // `modelName` in here will be "User"
    mongoose.model(modelName, schema);
};