var SECP256K1 = {
    new: function() {
        var secp256k1 = new (Java.type("src.lib.SECP256K1"))();

        return {
            generateKeys: function() {
                var keys = secp256k1.generateKeys();
                print(JSON.stringify(JSON.parse(keys), null, 4));
                return JSON.parse(keys);
            }
        };
    }
}
