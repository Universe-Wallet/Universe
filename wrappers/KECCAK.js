var KECCAK = {
    new: function() {
        var keccak = new (Java.type("src.lib.KECCAK"))();

        return {
            keccak256: function(data) {
                return keccak.keccak256(data);
            },

            keccak512: function(data) {
                return keccak.keccak512(data);
            }
        };
    }
}
