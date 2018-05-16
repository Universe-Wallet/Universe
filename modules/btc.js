load("wrappers/Hex.js");

load("wrappers/secp256k1.js");
load("wrappers/SHA.js");
load("wrappers/RIPEMD.js");
load("wrappers/Base58Check.js");

load("wrappers/Electrum.js");

var secp256k1 = SECP256K1.new();
var sha = SHA.new();
var ripemd = RIPEMD.new();
var base58check = Base58Check.new();

var electrum, data;
data = {
    addresses: {
        "mjQ8SPUsMitKiTZw7dVbSwFG89hSLB9Sde": "2418ff859dc5230e9ae1eab61650fa9c8d7ab525929e799a1aba7a4156a1b5c2",
        "myS1YyNDQPzCTUx7JVDjxit62vzV7DYtqC": "8e1e48cc9713c2e2e16ca6fe2770ce4174aae0df52df8ac76d1eacf607d26c8a",
        "mviLCLPMV59dcQyhf3HRE9tDvAxeG6WcmW": "a1106098a43f841dbe9ed1005baa55804e8d2b473ce6ca6f8aca069194a8da1a",
        "mpVyy8u27xYnSs3UNjdvTcibiNiPCY8PHh": "fdef9dd388d89eec91159b2544380c4335aa8f1335b5425c7de216d63d14c5c7"
    }
};
function start(onReady, onBroken) {
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
        //Java had a problem with passing .call. I assume it's because .call uses `this` and that breaks the scope?
        onReady.call();
    });
    electrum.emitter.on("broken", function() {
        onBroken.call();
    });
}

function generate() {
    function toAddress(pubKey) {
        return base58check.encode(ripemd.ripemd160(sha.sha256(pubKey)), "6F");
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
//Get minimum amount of UXTOs, r, s, change output.
function prepare(destination, amount, fee) {
    print("In prepare")
    /*var uxtos = [];
    for (var i in data.addresses) {
        uxtos = uxtos.concat(electrum.getUXTOs(i.split("|")[0]));
        uxtos = uxtos.concat(electrum.getUXTOs(i.split("|")[1]));
    }*/
    var uxtos = [
        {
            address: "mjQ8SPUsMitKiTZw7dVbSwFG89hSLB9Sde",
            hash: "71e4be87998bb1a8beced6bddb850a274004bcce97b5a18e0cac4e2338b333d3",
            index: "0",
            amount: BigDecimal.new("9000000.0").divide(BigDecimal.new("100000000").getBD())
        }
    ];

    print("Created UXTOs")

    //Get minimum amount of UXTOs needed.
    var UXTOAmount = BigDecimal.new("0.0");

    print("Created UXTO data")

    var version = Hex.littleEndian(Hex.pad("1", 8));
    tx = version + Hex.pad(Hex.toHex(uxtos.length), 2);

    var RAndS, r, s, signature, pubKey, script, sequence;
    for (var i in uxtos) {
        print("Handling " + i);
        UXTOAmount = UXTOAmount.add(uxtos[i].amount);
        tx += Hex.littleEndian(uxtos[i].hash) + Hex.littleEndian(Hex.pad(uxtos[i].index, 8));

        RAndS = secp256k1.sign(data.addresses[uxtos[i].address], "6b3a64500ab59928a03ad6d33466443e6fa2e12c49e64a1c7f0070fcf1304e48").split("|");
        r = RAndS[0];
        if ((r.length % 2) === 1) {
            r = "0" + r;
        }
        s = RAndS[1];
        if ((s.length % 2) === 1) {
            s = "0" + s;
        }
        print("Got r and s. " + r + " - " + s);
        signature = "02" + Hex.toHex(r.length) + r + "02" + Hex.toHex(s.length) + s;
        signature = "30" + Hex.toHex(signature.length) + signature + "01";
        print("Signature length: " + signature.length);
        signature = Hex.toHex(signature.length) + signature;
        pubKey = base58check.decode(uxtos[i].address);
        if ((pubKey.length % 2) === 1) {
            pubKey = "0" + pubKey;
        }
        print("Decoded pubkey: " + pubKey);
        script = Hex.toHex(signature.length/2) + signature + Hex.toHex(pubKey.length/2) + pubKey;
        print("Script is done");

        sequence = "ffffffff";

        tx += Hex.toHex(script.length/2) + script + sequence;
    }

    print("Handled UXTOs.");

    var outputs = [{
        destination: destination,
        amount: amount
    }];

    //Add change output.

    tx += Hex.pad(Hex.toHex(outputs.length), 2);

    for (var i in outputs) {
        amount = outputs[i].amount.multiply(BigDecimal.new("100000000").getBD()).toString();
        if (amount.indexOf(".") > -1) {
            amount = amount.split(".")[0];
        }
        amount = Hex.littleEndian(Hex.pad(Hex.toHex(amount), 16));

        //Size of locking script.

        print("Handled output amount.")
        script = base58check.decode(outputs[i].destination);
        print("Decoded address: " + script);
        script = "76a9" + Hex.toHex(script.length/2) + script + "88ac";
        print("Handled script.")

        tx += amount + Hex.toHex(script.length/2) + script;
    }

    print("Handled outputs.");

    var locktime = Hex.pad("", 8);
    tx += locktime;

    print("\r\n\r\n" + tx);
}
print(prepare("myS1YyNDQPzCTUx7JVDjxit62vzV7DYtq", BigDecimal.new("0.8")));

function send() {

}

function getUSDPrice() {
    return JSON.parse(http.get("https://www.bitstamp.net/api/v2/ticker/btcusd/")).last;
}

function shutdown() {
    electrum.shutdown();
}
