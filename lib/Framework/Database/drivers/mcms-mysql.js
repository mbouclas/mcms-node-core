var Sequelize = require('sequelize');
var mold = require('sequelize-mold');
var lo = require('lodash');
module.exports = (function(App,Config){
    var DB = {};

    return {
        db : DB,
        connect : function(options){
            options = lo.merge({
                dialectOptions: {
                    socketPath: Config.socketPath,
                    supportBigNumbers: true,
                    bigNumberStrings: true
                },
                pool: { maxConnections: 5, maxIdleTime: 30},
                define : {
                    freezeTableName: true
                },
                logging: false,
                omitNull: true
            },options);

            if (typeof options.modelsPath == 'undefined'){//connect without models
                DB = new Sequelize(Config.database, Config.user, Config.password,options);
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