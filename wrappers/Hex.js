var Hex = {
    littleEndian: function(hexStr) {
        var res = "";
        for (var i = 0; i < hexStr.length; i = i + 2) {
            res += hexStr.substr(i+1, 1);
            res += hexStr.substr(i, 1);
        }

        hexStr = res;
        res = "";
        for (var i = 0; i < hexStr.length; i++) {
            res += hexStr.substr(hexStr.length - (i+1), 1);
        }

        return res;
    }
}
