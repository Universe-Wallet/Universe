load("wrappers/Random.js");
load("wrappers/secp256k1.js");
load("wrappers/KECCAK.js");

var random = Random.new();
var secp256k1 = SECP256K1.new();
var keccak = KECCAK.new();

function generate() {
    var privKey = random.bytes(32, "0", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");

    //secp256k1 is still in progress.
    var pubKey = secp256k1.scalarG(privKey);

    var pubHash = keccak.keccak160(pubKey);

    var address = "0x" + pubHash.substr(-40, 40);

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
