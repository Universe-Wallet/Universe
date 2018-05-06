var SECP256K1 = {
    new: function() {
        var secp256k1 = new (Java.type("src.lib.SECP256K1"))();

        return {
            generateKeys: function() {
                var keys = secp256k1.generateKeys();
                return JSON.parse(keys);
            },

            privateToPublic: function(privKey) {
                return JSON.parse(secp256k1.privateToPublic(privKey));
            }
        };
    }
}
