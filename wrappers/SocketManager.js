//Side effect.
load("wrappers/FakeTLSSocket.js");
load("wrappers/EventEmitter.js");
load("wrappers/Thread.js");

var SocketManager = {
    new: function() {
        var emitter = EventEmitter.new();

        var maxSockets;
        var nodes = [];
        var promised = 0;

        return {
            emitter: {
                on: function(event, func) {
                    emitter.on(event, func);
                }
            },

            setMaxSockets: function(max) {
                maxSockets = max;
            },

            getRealSocketCount: function() {
                return nodes.length;
            },

            getSocketCount: function() {
                return nodes.length + promised;
            },

            open: function(targets, test) {
                for (var i in targets) {
                    if (maxSockets <= this.getSocketCount()) {
                        return;
                    }

                    Thread.new(function() {
                        try {
                            promised++;
                            var socket = FakeTLSSocket.new(targets[i].host, targets[i].port);
                            if (!(socket)) {
                                promised--;
                                return;
                            }
                            nodes.push(socket);

                            emitter.emit("connect", nodes.length);
                        } catch(e) {
                            promised--;
                        }
                    });
                }
            },

            send: function(id, data) {
                if (!(nodes[id])) {
                    return false;
                }

                nodes[id].send(data);
            },

            receive: function(id) {
                if (!(nodes[id])) {
                    return false;
                }

                return nodes[id].receive();
            },

            close: function(id) {
                if (!(nodes[id])) {
                    return false;
                }
                var res = nodes[id].close();
                delete nodes[id];
                return res;
            }
        };
    }
}
