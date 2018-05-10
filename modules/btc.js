load("wrappers/secp256k1.js");
load("wrappers/SHA.js");
load("wrappers/RIPEMD.js");
load("wrappers/Base58Check.js");
load("wrappers/BigDecimal.js");

load("wrappers/Electrum.js");

var secp256k1 = SECP256K1.new();
var sha = SHA.new();
var ripemd = RIPEMD.new();
var base58check = Base58Check.new();

var electrum, data;
function start(onReady, onBroken) {
    data = {
        addresses: {
            "1EErtzHciwu4vaKEZbm9LVtFwVvjiv6kuh|16bvUxuHqPq11W5kgfDGrnrVPcPK7Xeh7M": "",
            "1L8dwzoxrAJY2LyvjLxSsVAMnJDNy1tMyW|16bvUxuHqPq11W5kgfDGrnrVPcPK7Xeh7M": "953146f4d6ea6cad68d496ccd923165ad287df0ec4272eae8e7ecda407b18e1a",
            "13z9rdsxP52vBWbTqRirQqikGSwVH9AYFg|1J7FG6HYaJtxsAitqty71F5ABkzMsiek7o": "196e545ee2c9454184660e76a56dc570c68a338923385ed5cb1892c097b7163",
            "1g1Wkpt7647yeuNejUGhLwcEDE7NZE2uf|16bvUxuHqPq11W5kgfDGrnrVPcPK7Xeh7M": "",
            "17zNre27MmnwFBFQVkLAZtAeQnxccFwtFu|1H1G8dmDju23zEAtwf5UkJKkWSMvqP7rGJ": "5d70836b56178db9ff2482508d0502b85b48481f160cc57f5384d46a4c6f9a57",
            "1LG1RzQwzC6R8kmKDPKPCCtWt8LZtskHY7|1BjHgTGM4wtL32rwwSseG4nRwufpoTYuQe": "25ee1f15cb31f3614d90e46685c7ef05f790f5758160150b3462c30027d86c86"
        }
    };

    electrum = Electrum.new({
        "btc.smsys.me": 995,
        "VPS.hsmiths.com": 50002,
        "aspinall.io": 50002,
        "electrum.chainhost.io": 50002,
        "E-X.not.fyi": 50002,
        "btc.cihar.com": 50002,
        "crypto.subshell.com": 50002,
        "e.keff.org": 50002,
        "electrum2.villocq.com": 50002
    });

    electrum.emitter.on("ready", function() {
        print(getBalance());
        //Java had a problem with passing .call. I assume it's because .call uses `this` and that breaks the scope?
        onReady.call();
    });
    electrum.emitter.on("broken", function() {
        onBroken.call();
    });
}

function generate() {
    function toAddress(pubKey) {
        return base58check.encode(ripemd.ripemd160(sha.sha256(pubKey)), "00");
    }

    var keys = secp256k1.generateKeys();

    var addressUncompressed = toAddress(keys.pubKey.uncompressed);
    var addressCompressed = toAddress(keys.pubKey.compressed);

    return {
        privKey: keys.privKey,
        address: addressUncompressed
    };
}

function getBalance() {
    var balance = BigDecimal.new("0.0");
    var addrBalance;
    for (var i in data.addresses) {
        addrBalance = electrum.getBalance(i.split("|")[0]);
        if (addrBalance !== "false") {
            balance = balance.add(BigDecimal.new(addrBalance));
        }

        addrBalance = electrum.getBalance(i.split("|")[1]);
        if (addrBalance !== "false") {
            balance = balance.add(BigDecimal.new(addrBalance));
        }
    }
    return balance.toString();
}

var tx;
function prepare() {
    tx = {};
    var uxtos = [];
    for (var i in data.addresses) {
        uxtos = uxtos.concat(electrum.getUXTOs(i.split("|")[0]));
        uxtos = uxtos.concat(electrum.getUXTOs(i.split("|")[1]));
    }
}

function send() {

}

function getUSDPrice() {
    return JSON.parse(http.get("https://www.bitstamp.net/api/v2/ticker/btcusd/")).last;
}

function shutdown() {
    electrum.shutdown();
}
