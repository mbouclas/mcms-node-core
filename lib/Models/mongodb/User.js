module.exports = function (mongoose, modelName) {
    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        username: { type: String, index: true },
        password: String,
        email: { type: String, index: true },
        firstName: String,
        lastName: String,
        active: Number,
        activated_at: Date,
        created_at: {type : Date, default : Date.now},
        updated_at: {type : Date, default : Date.now},
        remember_token : String,
        activation_code : String,
        userClass : String,
        permissions : {},
        preferences : {},
        passwordReminder : {},
        settings : {}
    }, { strict: false });
    // `modelName` in here will be "User"
    mongoose.model(modelName, schema);
};