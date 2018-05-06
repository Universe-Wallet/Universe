var Random = {
    new: function() {
        var random = new (Java.type("src.lib.Random"))();

        return {
            bytes: function(quantity, low, high) {
                if (typeof(low) === "undefined") {
                    low = "0";
                }
                if (typeof(high) === "undefined") {
                    high = "0";
                }

                return random.bytes(quantity, low, high);
            }
        };
    }
}
