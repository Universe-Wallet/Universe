load("wrappers/secp256k1.js");
load("wrappers/SHA.js");
load("wrappers/RIPEMD.js");
load("wrappers/Base58Check.js");

var secp256k1 = SECP256K1.new();
var sha = SHA.new();
var ripemd = RIPEMD.new();
var base58check = Base58Check.new();

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

}

function prepare() {

}

function send() {

}

function getUSDPrice() {

}
