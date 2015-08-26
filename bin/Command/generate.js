module.exports = (function(App) {
    var colors = require('colors');
    var fs = require('fs-extra');
    var async = require('async');
    var lo = require('lodash');
    var baseDir = App.Config.baseDir + '/node_modules/';
    var publicPath = App.Config.baseDir + '/public/';
    var workBenchFolder = App.Config.baseDir + '/workbench/';
    var nunjucks = require('nunjucks');
    var String = require('string');
    var moduleName = '',
        originalModuleName;

    function command() {
        this.name = 'generate';
        this.description = 'generate a new module';
        this.options = {};
    }

    command.prototype.fire = function (done) {
        this.module = this.options['_'][1];
        this.destinationDir = this.options['_'][2] || false;

        if (this.destinationDir) {
            workBenchFolder = this.destinationDir;

            if (!String(workBenchFolder).endsWith('/') || !String(workBenchFolder).endsWith('\\')){
                workBenchFolder = workBenchFolder + '/';
            }
        }

        nunjucks.configure(workBenchFolder,{ autoescape: true });
        moduleName = String(this.module).camelize().s;
        originalModuleName = this.module;

        var asyncArr = [
            checkWorkBenchFolder.bind(null,this.module),
            copyTemplate,
            findAndReplaceInTemplates,
            runNpmLink
        ];

        async.waterfall(asyncArr,function(err,results){
            done(null,true);
        });


    };


    function checkWorkBenchFolder(module,callback){
        if (!fs.existsSync(workBenchFolder)){
            fs.mkdirpSync(workBenchFolder);
        }

        if (!fs.existsSync(workBenchFolder + originalModuleName)){
            fs.mkdirpSync(workBenchFolder + originalModuleName);
        }

        var message = 'workbench folder ok...';

        workBenchFolder = workBenchFolder + originalModuleName + '/';

        callback(null,module);
    }

    function copyTemplate(module,callback){
        fs.copySync(__dirname + '/workBenchTemplate',workBenchFolder);
        callback(null,module);
    }

    function findAndReplaceInTemplates(module,callback){

        var tasks = [
            serviceProvider.bind(null,moduleName),
            packageJson,
            adminJson
        ];

        async.parallel(tasks,function(err,results){
            callback(null);
        });

    }

    function serviceProvider(name,callback){
        var file = workBenchFolder + 'serviceProvider.template';


        var out = nunjucks.render(file,{module : name});

        fs.outputFile(workBenchFolder + moduleName + 'ServiceProvider.js', out, function (err) {
            fs.deleteSync(workBenchFolder + 'serviceProvider.template');
            callback(null,true);
        });

    }

    function packageJson(callback){
        var file = workBenchFolder + 'package.json.template';

        var out = nunjucks.render(file,{
            module : originalModuleName,
            author : App.Config.app.author || {
                name : '',
                email : '',
                url : ''
            }
        });

        fs.outputFile(workBenchFolder  + 'package.json', out, function (err) {
            fs.deleteSync(workBenchFolder + 'package.json.template');
            callback(null,true);
        });

    }

    function adminJson(callback){
        var file = workBenchFolder + 'admin-package.json.template';

        var out = nunjucks.render(file,{
            module : originalModuleName
        });

        fs.outputFile(workBenchFolder  + 'admin-package.json', out, function (err) {
            fs.deleteSync(workBenchFolder + 'admin-package.json.template');
            callback(null,true);
        });

    }

    function runNpmLink(callback){
        callback(null,true);
    }

    return command;
});