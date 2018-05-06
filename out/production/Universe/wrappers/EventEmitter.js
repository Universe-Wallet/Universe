var EventEmitter = {
    new: function() {
        var events = {};

        return {
            on: function(event, func) {
                events[event] = func;
            },

            emit: function(event) {
                var args = [];
                for (var i = 1; i < Object.keys(arguments).length; i++) {
                    args.push(arguments[""+i]);
                }
                if (typeof(events[event]) === "function") {
                    events[event].apply(null, args);
                }
            }
        };
    }
}
