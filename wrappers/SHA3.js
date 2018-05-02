var SHA3 = {
    new: function() {
        var sha3 = new (Java.type("src.lib.SHA3"))();

        return {
            sha3_256: function(data) {
                return sha3.sha3_256(data);
            },

            sha3_512: function(data) {
                return sha3.sha3_512(data);
            }
        };
    }
}
