var Base58Check = {
    new: function() {
        var base58check = new (Java.type("src.lib.Base58Check"))();

        return {
            encode: function(payload, version) {
                return base58check.encode(payload, version);
            }
        };
    }
}
