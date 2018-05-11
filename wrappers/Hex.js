var Hex = {
    littleEndian: function(hexStr) {
        var res = "";
        for (var i = hexStr.length-2; i >= 0; i = i - 2) {
            res += hexStr.substr(i, 1);
            res += hexStr.substr(i+1, 1);
        }
        return res;
    }
}
