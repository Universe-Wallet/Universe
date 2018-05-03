load("wrappers/secp256k1.js");
load("wrappers/SHA.js");
load("wrappers/RIPEMD.js");
load("wrappers/Base58Check.js");

load("wrappers/FakeTLSSocket.js");

var secp256k1 = SECP256K1.new();
var sha = SHA.new();
var ripemd = RIPEMD.new();
var base58check = Base58Check.new();

var seedNodes = {
    "btc.smsys.me": 995,
    "E-X.not.fyi": 50002,
    "btc.cihar.com": 50002
};
var nodes = {};
for (var i in seedNodes) {
    try {
        nodes[i] = FakeTLSSocket.new(i, seedNodes[i]);
        nodes[i].send(JSON.stringify({"id": 0, "method": "server.version", "params":["0.1"]}));
        var response = JSON.parse(nodes[i].receive());
        if (response.error) {
            delete nodes[i];
        }
    } catch(e) {
        delete nodes[i];
    }
}\
if (Object.keys(nodes).length < 8) {

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
