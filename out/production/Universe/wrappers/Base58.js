var Base58 = {
    new: function() {
        var base58 = new (Java.type("src.lib.Base58"))();

        return {
            convert: function(hexNum) {
                return base58.convert(hexNum);
            },

            revert: function(base58Num) {
                return base58.revert(base58Num);
            }
        };
    }
}
