load("wrappers/secp256k1.js");
load("wrappers/SHA.js");
load("wrappers/RIPEMD.js");
load("wrappers/Base58Check.js");

load("wrappers/Electrum.js");

var secp256k1 = SECP256K1.new();
var sha = SHA.new();
var ripemd = RIPEMD.new();
var base58check = Base58Check.new();

var electrum = Electrum.new({
    "btc.smsys.me": 995,
    "E-X.not.fyi": 50002,
    "btc.cihar.com": 50002
});

function generate() {
    var keys = secp256k1.generateKeys();

    var privKey = keys.privKey;
    var pubKey = "04" + keys.pubKey.x + keys.pubKey.y;

    var publicHash = ripemd.ripemd160(sha.sha256(pubKey));

    var address = base58check.encode(publicHash, "00");

    return {
        privKey: privKey,
        address: address
    };
}

function getBalance() {
    electrum.getBalance("1C1mCxRukix1KfegAY5zQQJV7samAciZpv");
}

function prepare() {

}

function send() {

}

function getUSDPrice() {
    return JSON.parse(http.get("https://www.bitstamp.net/api/v2/ticker/btcusd/")).last;
}

function shutdown() {

}
