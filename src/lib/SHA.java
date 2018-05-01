package src.lib;

import src.lib.Hex;

import java.security.MessageDigest;

public class SHA {
    private MessageDigest sha1;
    private MessageDigest sha256;
    private MessageDigest sha384;
    private MessageDigest sha512;

    public SHA() {
        try {
            sha1 = MessageDigest.getInstance("SHA-1");
            sha256 = MessageDigest.getInstance("SHA-256");
            sha384 = MessageDigest.getInstance("SHA-384");
            sha512 = MessageDigest.getInstance("SHA-512");
        } catch(Exception e) {
            //Exception is thrown if there isn't the SHA algortihms which means your standard Java install is missing files.
            System.out.println("Your Java install is missing the SHA algortihms.");
            System.exit(-1);
        }
    }

    public String sha1(String data) {
        return Hex.byteArrToHex(sha1.digest(Hex.hexStrToByte(data)));
    }

    public String sha256(String data) {
        return Hex.byteArrToHex(sha256.digest(Hex.hexStrToByte(data)));
    }

    public String sha384(String data) {
        return Hex.byteArrToHex(sha384.digest(Hex.hexStrToByte(data)));
    }

    public String sha512(String data) {
        return Hex.byteArrToHex(sha512.digest(Hex.hexStrToByte(data)));
    }
}
