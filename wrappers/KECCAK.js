var Keccak = {
    new: function() {
        var keccak = new (Java.type("src.lib.Keccak"))();

        return {
            keccak256: function(data) {
                return keccak.keccak256(data);
            },

            keccak384: function(data) {
                return keccak.keccak384(data);
            },

            keccak512: function(data) {
                return keccak.keccak512(data);
            }
        };
    }
}
