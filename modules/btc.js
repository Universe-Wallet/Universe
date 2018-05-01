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
    var privkey = "e07eb8089ed29f51a8b45106be8a78eea091b675923948c04f08ec9adeb12e16";

    //https://en.bitcoin.it/wiki/Secp256k1
    //The actual public key should be "04" + pubkey.x + pubkey.y but there may be a modulus involved (I doubt it).
    //We're printing with dashes just so we can see the X/Y better.
    print("--------------------------------");
    var pubkey = secp256k1.scalarG("e07eb8089ed29f51a8b45106be8a78eea091b675923948c04f08ec9adeb12e14");
    print("04-" + pubkey.x + "-" + pubkey.y);
    print("--------------------------------");
    var pubkey = secp256k1.scalarG("e07eb8089ed29f51a8b45106be8a78eea091b675923948c04f08ec9adeb12e15");
    print("04-" + pubkey.x + "-" + pubkey.y);
    print("--------------------------------");
    var pubkey = secp256k1.scalarG(privkey);
    print("04-" + pubkey.x + "-" + pubkey.y);
    print("--------------------------------");
    var pubkey = secp256k1.scalarG("e07eb8089ed29f51a8b45106be8a78eea091b675923948c04f08ec9adeb12e17");
    print("04-" + pubkey.x + "-" + pubkey.y);
    print("--------------------------------");
    var pubkey = secp256k1.scalarG("e07eb8089ed29f51a8b45106be8a78eea091b675923948c04f08ec9adeb12e18");
    print("04-" + pubkey.x + "-" + pubkey.y);
    print("--------------------------------");

    //What it should be.
    var pubkey = "04877C227EC1913AF11A6212FEFD489DC44CCC6242EE1190F6A1754393FAAA91F6C1696E4A5EE87B8BCD7C8EEAE314A429135BE780DA07C1D7B32FFF0CDBF81111";

    var publicHash = ripemd.ripemd160(sha.sha256(pubkey));

    var address = base58check.encode(publicHash, "00");

    return {
        privkey: privkey,
        address: address
    };
}

function receive() {

}

function prepare() {

}

function send() {

}

function getUSDPrice() {

}
