var SECP256K1 = {
    new: function() {
        var secp256k1 = new (Java.type("src.lib.SECP256K1"))();

        return {
            scalarG: function(scalar) {
                var point = secp256k1.scalarG(scalar);
                return {
                    x: point.getX(),
                    y: point.getY()
                };
            }
        };
    }
}
