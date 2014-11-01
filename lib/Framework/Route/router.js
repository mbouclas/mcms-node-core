module.exports = (function(App,server){
    var lo = require('lodash');

    var Route = {
        controllers : {},
        map : {},
        filters : {},
        middleware : [],
        params : {},
        registerControllers : function(controllers,mode){
            if (mode == 'append'){
                for (var a in controllers){
                    this.controllers[a] = controllers[a];
                }
                return;
            }

            this.controllers = controllers;
        },
        get : function(route,options){

            setupRoute('get',route,options);

        },
        post : function(){

        },
        all : function(){

        },
        group : function(options,routes){
            if (typeof options.prefix == 'undefined'){
                throw new Error('Group must have a prefix');
            }

            for (var a in routes){
                var route = routes[a]();
                var dest = (typeof route.route != 'undefined') ? options.prefix + '/' + route.route : options.prefix;

                //attach group filters to route ones
                if (typeof options.filters != 'undefined'){
                    var tempFilters = [];
                    if (typeof options.filters == 'string'){
                        tempFilters.push(options.filters);
                    } else {
                        tempFilters = options.filters;
                    }

                    if (typeof route.filters == 'string'){//single filter
                        tempFilters.push(route.filters);
                    } else {
                        if (typeof route.filters == 'undefined') {
                            route.filters = [];
                        }

                        for (var iterator in tempFilters) {
                            route.filters.push(tempFilters[iterator]);
                        }
                    }

                }

                setupRoute(route.method,dest,route);
            }
        },
        resolve : function(name,params){
            if (typeof params != 'undefined'){
                var temp = this.map[name];
                for (var a in params){
                    temp = temp.replace(':'+ a,params[a]);
                }
                return temp;
            }

            return this.map[name];
        },
        render : function(res,req,view,options){
            res.render(view,lo.merge(this,options));
        },
        filter : function(name,filter){
            this.filters[name] = filter;
        },
        param : function(param,callback){
            this.params[param] = callback;
        },
        resolveController : function(ctrl){
            var parts = ctrl.split('.');
            if (typeof this.controllers[parts[0]] == 'undefined') {
                console.log(this.controllers)
                throw (ctrl + ' is not a registered controller');
                return;
            }


            var temp = new this.controllers[parts[0]](App);
            return temp[parts[1]];
        }
    };

    function setupRoute(type,route,options){
        var router = App.express.Router();


        if (typeof options.exec == 'undefined' && options.render == 'undefined'){
            console.error('i need a valid callback');
            return;
        }

        router = addFilter(options.filters,router);

        if (typeof options.middleware != 'undefined'){
            router.use(options.middleware);
        }

        if (typeof options.as != 'undefined'){
            Route.map[options.as] = route;
        }

        if (typeof options.param != 'undefined'){
            for (var a in options.param){
                var param = options.param[a];
                router.param(param,Route.params[param]);
            }
        }


        if (type == 'group') {//nesting routes
            options.options.prefix = route + '/' + options.options.prefix;
            return Route.group(options.options,options.routes);
        }

        var res = (typeof options.exec == 'string') ? Route.resolveController(options.exec) : options.exec;

        router[type](route ,res);
        server[type](route,router);
    }


    function addFilter(filter,router){

        if (typeof filter != 'undefined'){
            if (typeof filter == 'string' && typeof Route.filters[filter] != 'undefined'){
                router.use(Route.filters[filter]);
            } else {
                for (var a in filter){
                    if (typeof Route.filters[filter[a]] == 'undefined' && typeof filter[a] != 'function'){
                        return;
                    }

                    router.use(Route.filters[filter[a]]);
                }
            }
        }

        return router;
    }

    return Route;
});

