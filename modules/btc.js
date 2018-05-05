load("wrappers/secp256k1.js");
load("wrappers/SHA.js");
load("wrappers/RIPEMD.js");
load("wrappers/Base58Check.js");

load("wrappers/Electrum.js");

var secp256k1 = SECP256K1.new();
var sha = SHA.new();
var ripemd = RIPEMD.new();
var base58check = Base58Check.new();

var electrum;
function start(onReady, onBroken) {
    electrum = Electrum.new({
        "btc.smsys.me": 995,
        "E-X.not.fyi": 50002,
        "btc.cihar.com": 50002
    });

    electrum.emitter.on("ready", function() {
        //Java had a problem with passing .call. I assume it's because .call uses this and that breaks the scope?
        onReady.call();
    });
    electrum.emitter.on("broken", function() {
        onBroken.call();
    });
}

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
    print(electrum.getBalance("1C1mCxRukix1KfegAY5zQQJV7samAciZpv"));
    return electrum.getBalance("1C1mCxRukix1KfegAY5zQQJV7samAciZpv");
}

function prepare() {

}

function send() {

}

function getUSDPrice() {
    return JSON.parse(http.get("https://www.bitstamp.net/api/v2/ticker/btcusd/")).last;
}

function shutdown() {
    electrum.shutdown();
}
