var Sequelize = require('sequelize');
var mold = require('sequelize-mold');
var lo = require('lodash');
module.exports = (function(Config){
    var DB = {};

    return {
        models : {},
        db : DB,
        connect : function(options){
            options = lo.merge({
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000
                },
                define : {
                    freezeTableName: true
                },
                logging: console.log,
                omitNull: true
            },options);

            if (typeof options.modelsPath == 'undefined'){//connect without models
                DB = new Sequelize(Config.database, Config.username, Config.password, options);
            }
            else {
                DB = mold(Config.database,Config.user,Config.password, options.modelsPath, options);
            }


            this.db = DB;
            return DB;
        },
        loadModels : function(mongoose,path){

        }
    };
});