var TCPSocket = {
    new: function(host, port) {
        var socket;
        try {
            socket = new (Java.type("src.lib.TCPSocket"))(host, port);
        } catch(e) {
            return false;
        }

        return {
            send: function(data) {
                socket.send(data);
            },

            receive: function() {
                return socket.receive();
            },

            close: function() {
                return socket.close();
            }
        };
    }
}
