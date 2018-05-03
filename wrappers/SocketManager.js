//Side effect.
load("wrappers/FakeTLSSocket.js");
load("wrappers/Thread.js");

var SocketManager = {
    new: function() {
        var promised = [];
        var nodes = [];

        return {
            open: function(host, port, test) {
                Thread.new(function() {
                    Thread.sleep(100);
                    var id = promised.length;
                    promised.push(false);
                    try {
                        promised[id] = FakeTLSSocket.new(host, port);
                        if (!(test(promised[id]))) {
                            promised[id] = false;
                        }
                        nodes.push(promised[id]);
                        promised[id] = false;
                    } catch(e) {
                        promised[id] = false;
                    }
                });
                var id = promised.length;
                Thread.sleep(200);
                return id;
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

                var received = nodes[id].receive();
                return received;
            },

            close: function(id) {
                if (!(nodes[id])) {
                    return false;
                }
                var res = nodes[id].close();
                delete nodes[id];
                return res;
            },

            getNodeCount: function() {
                return nodes.length;
            }
        };
    }
}
