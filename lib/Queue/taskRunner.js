module.exports = (function(App) {
    var Beanstalk = require('nodestalker'),
        fs = require('fs-extra'),
        path = require('path'),
        lo = require('lodash');

    function TaskRunner(config){
        this.Options = lo.merge({
            workersDir: App.Config.baseDir + 'workers',
            tube : App.Config.queue[App.Config.queue.default].tube,
            connection : App.Config.queue[App.Config.queue.default].host + ':' + App.Config.queue[App.Config.queue.default].port
        },config);
        this.Workers = {};
        return this;
    }

    TaskRunner.prototype.init = function(){
        console.log(this.Options.tube + ' tube initializing...');
        this.loadWorkers(this.Options.workersDir).resJob();
    };

    TaskRunner.prototype.loadWorkers = function(dir) {
        dir = dir || this.Options.workersDir;
        var files = fs.readdirSync(dir),
            _this = this;
        files.forEach(function(file){
            if (path.extname(file) == '.js' && file.indexOf('Helpers') == -1){
                _this.Workers[file.replace(path.basename(path.extname(file)),'')] = require(dir + '/'+ file)(App);
            }
        });

        return this;
    };

    TaskRunner.prototype.work = function(type,jobId,payload,callback){
        if (!this.Workers[type]){
            return callback('workerNotFound');
        }

        this.Workers[type](jobId,payload,callback);
    };

    TaskRunner.prototype.resJob = function(){
        var _this = this,
            client = Beanstalk.Client(this.Options.connection);

        client.watch(this.Options.tube).onSuccess(function (data) {
            client.reserve().onSuccess(function (job) {
                _this.resJob();//async recursion
                //check the job type and pass it to the workers
                var jobId = job.id,
                    data = JSON.parse(job.data),
                    type = data.type,
                    payload = data.payload;

                _this.work(type,jobId,payload,function(err,results){
                    if (err){
                        console.log('Worker error',err);
                        App.Event.emit('worker.error',{jobId : jobId,error : err,payload : payload,type : type});
                        client.bury(jobId);//bury the job as there was an error
                        return;
                        //log it maybe
                    }
                    client.deleteJob(jobId).onSuccess(function(del_msg) {
                        //console.log(del_msg);
                        //client.disconnect();
                    });
                });
            });
        });
    };


    return TaskRunner;
});