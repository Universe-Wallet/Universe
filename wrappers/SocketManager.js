//Side effects/needed libs.
load("wrappers/FakeTLSSocket.js");
load("wrappers/EventEmitter.js");
load("wrappers/Thread.js");
load("wrappers/LogWindow.js");

var SocketManager = {
    new: function() {
        var emitter = EventEmitter.new();

        var maxSockets;

        var nodes = [];
        var promised = 0;

        var hosts = [] , hostsLock = false;
        function updateHosts() {
            while(hostsLock) {
                Thread.sleep(10);
            }
            hostsLock = true;

            hosts = [];
            for (var i in nodes) {
                try {
                    var host = nodes[i].getHost();
                    if (hosts.indexOf(host) > -1) {
                        throw host + " is already connected to.";
                    }
                    print("Added " + host);
                    hosts.push(host);
                } catch(e) {
                    print(e);
                    nodes[i].close();
                    delete nodes[i];
                }
            }

            hostsLock = false;
        }

        var log = LogWindow.new("Sockets");
        setInterval(function() {
            while (hostsLock) {
                Thread.sleep(10);
            }

            var info = "Nodes: " + nodes.length;
            for (var i in nodes) {
                info += "<br>";
                try {
                    info += nodes[i].getHost();
                } catch(e) {
                    info += "Node " + i + " had an error.";
                }
            }
            info += "<br><br>";
            info += "Hosts:<br>";
            info += hosts.join("<br>");
            log.update(info);
        }, 30*1000);

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
                    while (hostsLock) {
                        Thread.sleep(10);
                    }

                    if ((maxSockets <= this.getSocketCount()) || (hosts.indexOf(targets[i].host) > -1)) {
                        return;
                    }

                    Thread.new(function() {
                        var host = targets[i].host;
                        var port = targets[i].port;
                        try {
                            promised++;
                            var socket = FakeTLSSocket.new(host, port);
                            if (!(socket)) {
                                promised--;
                                return;
                            }
                            nodes.push(socket);

                            updateHosts();

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

                updateHosts();

                return res;
            }
        };
    }
}
