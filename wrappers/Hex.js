var Hex = {
    pad: function(data, padLength) {
        while(data.length < padLength) {
            data = "0" + data;
        }
        return data;
    },

    littleEndian: function(hexStr) {
        var res = "";
        for (var i = hexStr.length-2; i >= 0; i = i - 2) {
            res += hexStr.substr(i, 1);
            res += hexStr.substr(i+1, 1);
        }
        return res;
    },

    toHex: function(decimalStr) {
        return Java.type("src.lib.Hex").toHex(decimalStr);
    }
}
