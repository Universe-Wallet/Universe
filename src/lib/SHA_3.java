package src.lib;

import src.lib.Hex;

import org.bouncycastle.jcajce.provider.digest.SHA3;
import org.bouncycastle.jcajce.provider.digest.SHA3.DigestSHA3;

public class SHA_3 {
    DigestSHA3 sha3_256;
    DigestSHA3 sha3_512;

    public SHA_3() {
        sha3_256 = new SHA3.Digest256();
        sha3_512 = new SHA3.Digest512();
    }

    public String sha3_256(String data) throws Exception {
        return Hex.byteArrToHex(sha3_256.digest(Hex.hexStrToByte(data)));
    }

    public String sha3_512(String data) {
        return Hex.byteArrToHex(sha3_512.digest(Hex.hexStrToByte(data)));
    }
}
