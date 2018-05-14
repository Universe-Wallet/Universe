var BigDecimal = {
    new: function(amount) {
        var bd = new (Java.type("java.math.BigDecimal"))(amount);

        return {
            add: function(bd2) {
                return bd.add(bd2);
            },

            subtract: function(bd2) {
                return bd.subtract(bd2);
            },

            multiply: function(bd2) {
                return bd.multiply(bd2);
            },

            divide: function(bd2) {
                return bd.divide(bd2);
            },

            compareTo: function(bd2) {
                return bd.compareTo(bd2);
            },

            toString: function() {
                return bd.toString();
            },

            getBD: function() {
                return bd;
            }
        };
    }
}
