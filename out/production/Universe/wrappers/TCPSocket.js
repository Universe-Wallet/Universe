var TCPSocket = {
    new: function(host, port) {
        var socket;
        try {
            socket = new (Java.type("src.lib.TCPSocket"))(host, port);
        } catch(e) {
            print(e);
            return false;
        }

        return {
            send: function(data) {
                socket.send(data);
            },

            receive: function() {
                var received;
                try {
                    received = socket.receive();
                } catch(e) {
                    print(e);
                    return false;
                }
                return received;
            },

            close: function() {
                return socket.close();
            }
        };
    }
}
