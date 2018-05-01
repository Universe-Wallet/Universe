var RIPEMD = {
    new: function() {
        var ripemd = Java.type("src.lib.RIPEMD");

        return {
            ripemd160: function(data) {
                return ripemd.ripemd160(data);
            }
        };
    }
}
