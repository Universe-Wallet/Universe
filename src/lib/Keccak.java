package src.lib;

import src.lib.Hex;

import org.bouncycastle.jcajce.provider.digest.Keccak.Digest256;
import org.bouncycastle.jcajce.provider.digest.Keccak.Digest384;
import org.bouncycastle.jcajce.provider.digest.Keccak.Digest512;

public class Keccak {
    Digest256 keccak256Digest;
    Digest384 keccak384Digest;
    Digest512 keccak512Digest;

    public Keccak() {
        keccak256Digest = new Digest256();
        keccak384Digest = new Digest384();
        keccak512Digest = new Digest512();
    }

    public String keccak256(String data) throws Exception {
        keccak256Digest.update(Hex.hexStrToByte(data), 0, (data.length()/2));
        return Hex.byteArrToHex(keccak256Digest.digest());
    }

    public String keccak384(String data) throws Exception {
        keccak384Digest.update(Hex.hexStrToByte(data), 0, (data.length()/2));
        return Hex.byteArrToHex(keccak384Digest.digest());
    }

    public String keccak512(String data) throws Exception {
        keccak512Digest.update(Hex.hexStrToByte(data), 0, (data.length()/2));
        return Hex.byteArrToHex(keccak512Digest.digest());
    }
}
