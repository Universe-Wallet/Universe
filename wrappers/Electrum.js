//Side effects/needed libs.
load("wrappers/Timeout.js");
load("wrappers/Interval.js");
load("wrappers/SocketManager.js");

var Electrum = {
    new: function(seedNodes) {
        var nodes = SocketManager.new();
        var pending = [];

        function connectToNode(host, port) {
            if ((host.indexOf(".onion") > -1) || (/^[a-zA-Z]+/.test(host) === false)) {
                return false;
            }

            print("Connecting to " + host + ":" + port);
            var id = nodes.open(host, port, function(socket) {
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

        for (var i in seedNodes) {
            connectToNode(i, seedNodes[i]);
        }
        Thread.sleep(6000);

        setTimeout(function() {
            if (nodes.getNodeCount() === 0) {
                throw "None of the Electrum Seed Nodes were valid.";
            }
        }, 6000);

        function connect() {
            print(8 - nodes.getNodeCount());
            for (var i = 0; i < 8 - nodes.getNodeCount(); i++) {
                print("In loop.")
                try {
                    nodes.send(0, JSON.stringify({id: 0, method: "server.peers.subscribe", params: []}));
                    var res = JSON.parse(nodes.receive(0)).result;

                    for (var x in res) {
                        print ("Handling " + JSON.stringify(x));
                        for (var z in res[x][2]) {
                            if (res[x][2][z].substr(0, 1) !== "s") {
                                continue;
                            }

                            connectToNode(res[x][1], parseInt(res[x][2][z].substr(1, res[x][2][z].length)));
                        }

                        if (i > 8-nodes.getNodeCount()) {
                            break;
                        }
                    }

                    //If we went through every node...
                    break;
                } catch(e) {
                    nodes.close(0);
                }
            }
        }
        connect();
        //Make sure we have at least 8 nodes every 11 minutes.
        setInterval(connect, 11*60*1000);

        function testNodes() {
            for (var i = 0; i < nodes.getNodeCount(); i++) {
                try {
                    if (i > 7) {
                        nodes.close(i);
                        continue;
                    }

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

        Thread.sleep(6000);

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

                    if (counts[count].count === 5) {
                        print("Conclusive: " + JSON.stringify(counts[count].example));
                        return counts[count].example;
                    }
                }catch(e){}
            }

            return false;
        }

        function query(method, params) {
            var ress = [];
            for (var i = 0; i < nodes.getNodeCount(); i++) {
                try {
                    nodes.send(i, JSON.stringify({
                        id: 0,
                        method: method,
                        params: ((typeof(params) === "object") ? params : [params])
                    }));
                    var res = nodes.receive(i);
                    if (res === false) {
                        nodes.close(i);
                    }
                    res = JSON.parse(res);
                    if (res.error) {
                        continue;
                    }
                    ress.push(res.result);
                } catch(e) {
                    nodes.close(i)
                }
            }
            print("Ress");
            print(JSON.stringify(ress, null, 4));
            return ress;
        }

        function queryConclusive(method, params) {
            return testConclusiveness(query(method, params));
        }

        return {
            getBalance: function(address) {
                print("Getting balance.");
                var res = queryConclusive("blockchain.address.get_balance", address);
                print("Res");
                print(JSON.stringify(res));
                if (res === false) {
                    return false;
                }
                res = res.confirmed.toString();
                return res.substr(0, res.length-8) + "." + res.substr(-8, 8);
            },

            execute: function(command, parameters) {

            },

            shutdown: function() {
                for (var i = 0; i < nodes.getNodeCount(); i++) {
                    nodes.close(i);
                }
            }
        }
    }
}
