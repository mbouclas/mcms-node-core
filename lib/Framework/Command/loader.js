module.exports = (function(App){

    return {
        commands : {},
        registerCommand : function(command){
            if (typeof App.commands == 'undefined'){
                App.commands = {};
            }

            if (typeof command == 'string'){//assume array
                var tmp = command;
                command = [];
                command.push(tmp);
            }

            for (var a in command){
                //do not load the command unless we are in CLI env
                if (typeof App.CLI == 'undefined'){
                    var name = command[a].split('/');
                    App.commands[name[name.length-1]] = command[a];
                    continue;
                }
                var temp = require(command[a])(App);//load the command
                command[a] = new temp();

                App.commands[command[a].name] = command[a];
            }
        },
        showHelp : function(command){

        },
        execute : function(command,options,callback){

        },
        locate : function(command){
            if (typeof App.commands[command] == 'undefined'){
                return false;
            }

            return true;
        },
        loadCommands : function(){

        }
    }
})