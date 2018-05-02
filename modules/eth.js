load("wrappers/secp256k1.js");
//load("wrappers/KECCAK.js");

load("wrappers/HTTP.js");

var secp256k1 = SECP256K1.new();
//var keccak = KECCAK.new();

var http = HTTP.new();

function generate() {
    var keys = secp256k1.generateKeys();

    //var pubHash = keccak.keccak256(keys.pubKey.x + keys.pubKey.y);
    var pubHash = "";

    var address = "0x" + pubHash.substr(-40, 40);

    return {
        privKey: keys.privKey,
        address: address
    };
}

function getBalance() {

}

function prepare() {

}

function send() {

}

function getUSDPrice() {
    return JSON.parse(http.get("https://www.bitstamp.net/api/v2/ticker/ethusd/")).last;
}

function shutdown() {

}
