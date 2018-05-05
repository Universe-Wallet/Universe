//Side effects/needed libs.
load("wrappers/Timeout.js");
load("wrappers/Interval.js");
load("wrappers/SocketManager.js");

var Electrum = {
    new: function(seedNodes) {
        var emitter = EventEmitter.new();

        var nodes = SocketManager.new();
        nodes.setMaxSockets(8);

        function connectToNodes(targets) {
            for (var i in targets) {
                if ((targets[i].host.indexOf(".onion") > -1) || (!(/^[a-zA-Z]+/.test(targets[i].host)))) {
                    targets.splice(i, 1);
                }
            }

            nodes.open(targets, function(socket) {
                try {
                    socket.send(JSON.stringify({id: 0, method: "server.version", params: ["0.10"]}));
                    var res = JSON.parse(socket.receive());
                    if (res.error) {
                        return false;
                    }
                } catch(e) {
                    return false;
                }
                return true;
            });
        }

        function connect() {
            var toConnect = [];
            var count = 8 - nodes.getSocketCount();

            while (toConnect.length < count) {
                try {
                    nodes.send(0, JSON.stringify({id: 0, method: "server.peers.subscribe", params: []}));
                    var res = JSON.parse(nodes.receive(0)).result;

                    for (var x in res) {
                        for (var z in res[x][2]) {
                            if (res[x][2][z].substr(0, 1) !== "s") {
                                continue;
                            }

                            toConnect.push({
                                host: res[x][1],
                                port: parseInt(res[x][2][z].substr(1, res[x][2][z].length))
                            });
                        }

                        if (toConnect.length === count) {
                            break;
                        }
                    }

                    //If we went through every node...
                    break;
                } catch(e) {
                    nodes.close(0);
                    count++;
                }
            }
            connectToNodes(toConnect);
        }
        //Make sure we have at least 8 nodes every 11 minutes.
        setInterval(connect, 11*60*1000);

        function testNodes() {
            for (var i = 0; i < nodes.getRealSocketCount(); i++) {
                try {
                    nodes.send(i, JSON.stringify({id: 0, method: "server.version", params: ["0.10"]}));
                    var res = JSON.parse(nodes.receive(i));
                    if (res.error) {
                        nodes.close(i);
                    }
                } catch(e) {
                    nodes.close(i);
                }
            }
        }
        //Make sure we send a keep-alive message/test nodes every minute...
        setInterval(testNodes, 60*1000);

        var notReady = true;
        nodes.emitter.on("connect", function(id) {
            if (seedNodesFormatted.length < 3) {
                if (id === 2) {
                    connect();
                }
                return;
            }

            if (id === 1) {
                connect();
            }
            
            if (notReady) {
                notReady = false;
                emitter.emit("ready");
            }
        });

        var seedNodesFormatted = [];
        for (var i in seedNodes) {
            seedNodesFormatted.push({
                host: i,
                port: seedNodes[i]
            });
        }
        connectToNodes(seedNodesFormatted);

        setTimeout(function() {
            if (notReady) {
                throw "None of the Electrum Seed Nodes were valid.";
            }
        }, 10000);

        function testConclusiveness(ress) {
            var keys = Object.keys(ress[0]);

            var counts = {};
            for (var i in ress) {
                try {
                    var count = "";
                    for (var k in keys) {
                        count += ress[i][keys[k]];
                    }

                    if (typeof(counts[count]) !== "object") {
                        counts[count] = {
                            count: 0,
                            example: ress[i]
                        };
                    }
                    counts[count].count++;

                    if (counts[count].count === (Math.ceil(nodes.getRealSocketCount()/2)+1)) {
                        return counts[count].example;
                    }
                } catch (e) {
                    print(e);
                }
            }

            return false;
        }

        function query(method, params) {
            if (notReady) {
                return false;
            }

            var ress = [];
            for (var i = 0; i < nodes.getSocketCount(); i++) {
                try {
                    nodes.send(i, JSON.stringify({
                        id: 0,
                        method: method,
                        params: ((typeof(params) === "object") ? params : [params])
                    }));

                    var res = nodes.receive(i);
                    if (!(res)) {
                        nodes.close(i);
                    }
                    res = JSON.parse(res);
                    if (res.error) {
                        print(res.error);
                        continue;
                    }
                    ress.push(res.result);
                } catch(e) {
                    nodes.close(i)
                }
            }
            return ress;
        }

        function queryConclusive(method, params) {
            var queryRes = query(method, params);
            if (!(queryRes)) {
                return false;
            }
            return testConclusiveness(queryRes);
        }

        return {
            emitter: {
                on: function(event, func) {
                    emitter.on(event, func);
                }
            },

            getBalance: function(address) {
                var res = queryConclusive("blockchain.address.get_balance", address);
                if (!(res)) {
                    return "false";
                }
                res = res.confirmed.toString();
                return res.substr(0, res.length-8) + "." + res.substr(-8, 8);
            },

            execute: function(command, parameters) {
                return query(command, parameters);
            },

            shutdown: function() {
                for (var i = 0; i < nodes.getSocketCount(); i++) {
                    nodes.close(i);
                }
            }
        }
    }
}
