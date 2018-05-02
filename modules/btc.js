load("wrappers/Random.js");
load("wrappers/secp256k1.js");
load("wrappers/SHA.js");
load("wrappers/RIPEMD.js");
load("wrappers/Base58Check.js");

var random = Random.new();
var secp256k1 = SECP256K1.new();
var sha = SHA.new();
var ripemd = RIPEMD.new();
var base58check = Base58Check.new();

function generate() {
    //var privKey = random.bytes(32, "0", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
    var privKey = "E07EB8089ED29F51A8B45106BE8A78EEA091B675923948C04F08EC9ADEB12E16";

    //https://en.bitcoin.it/wiki/Secp256k1
    //THis is wrong. Luke is working on it...
    //We're printing with dashes just so we can see the X/Y better.
    var pubKey = secp256k1.scalarG(privKey);
    print("04-" + pubKey.x + "-" + pubKey.y);

    //What it should be.
    var pubKey = "04877C227EC1913AF11A6212FEFD489DC44CCC6242EE1190F6A1754393FAAA91F6C1696E4A5EE87B8BCD7C8EEAE314A429135BE780DA07C1D7B32FFF0CDBF81111";

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
