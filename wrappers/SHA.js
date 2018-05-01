var SHA = {
    new: function() {
        var sha = new (Java.type("src.lib.SHA"))();

        return {
            sha1: function(data) {
                return sha.sha1(data);
            },

            sha256: function(data) {
                return sha.sha256(data);
            },

            sha384: function(data) {
                return sha.sha384(data);
            },

            sha512: function(data) {
                return sha.sha512(data);
            }
        };
    }
}
