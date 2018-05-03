load("wrappers/FakeTLSSocket.js");

var Electrum = {
    new: function(seedNodes) {
        var nodes = [];

        function connectToNode(host, port) {
            try {
                if ((host.indexOf(".onion") > -1) || (/^[a-zA-Z]+/.test(host) === false)) {
                    return false;
                }

                var socket = FakeTLSSocket.new(host, port);
                socket.send(JSON.stringify({id: 0, method: "server.version", params: ["0.10"]}));
                var res = JSON.parse(socket.receive());
                if (res.error) {
                    return false;
                }
                return socket;
            } catch(e) {
                return false;
            }
        }

        for (var i in seedNodes) {
            var socket = connectToNode(i, seedNodes[i]);
            if (socket) {
                nodes.push(socket);
            }
        }

        if (Object.keys(nodes).length === 0) {
            throw "None of the Electrum Seed Nodes were valid.";
        }

        while (Object.keys(nodes).length < 8) {
            var server = nodes[0];
            try {
                nodes[0].send(JSON.stringify({id: 0, method: "server.peers.subscribe", params: []}));
                var res = JSON.parse(nodes[0].receive()).result;

                for (var i in res) {
                    for (var x in res[i][2]) {
                        if (res[i][2][x].substr(0, 1) !== "s") {
                            continue;
                        }

                        var socket = connectToNode(res[i][1], parseInt(res[i][2][x].substr(1, res[i][2][x].length)));
                        if (socket) {
                            nodes.push(socket);
                        }
                    }

                    if (Object.keys(nodes).length > 8) {
                        break;
                    }
                }
            } catch(e) {
                delete nodes[0];
            }
        }

        function testConclusiveness(ress) {
            var keys = Object.keys(ress);
            var counts = {};
            for (var i in ress) {
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
                    return counts[count].example;
                }
            }

            return false;
        }

        function query(method, params) {
            var ress = [];
            for (var i in nodes) {
                nodes[i].send(JSON.stringify({
                    id: 0,
                    method: method,
                    params: ((typeof(params) === "object") ? params : [params])
                }));
                var res = JSON.parse(nodes[i].receive()).result;
                if (res.error) {
                    continue;
                }
                ress.push(res);
            }
            return ress;
        }

        function queryConclusive(method, params) {
            return testConclusiveness(query(method, params));
        }

        return {
            getBalance: function(address) {
                var res = queryConclusive("blockchain.address.get_balance", address);
                if (res === false) {
                    return false;
                }
                res = res.confirmed;
                return res.substr(0, res.length-8) + "." + res.substr(-8, 8);
            },

            execute: function(command, parameters) {

            }
        }
    }
}
