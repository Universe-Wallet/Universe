package src.lib;

import src.lib.Hex;
import src.lib.Base58;

import java.security.MessageDigest;

import java.util.Arrays;

public class Base58Check {
    private MessageDigest sha256;

    public Base58Check() {
        try {
            sha256 = MessageDigest.getInstance("SHA-256");
        } catch(Exception e) {
            //Exception is thrown if there isn't the SHA algortihms which means your standard Java install is missing files.
            System.out.println("Your Java install is missing the SHA algortihms.");
            System.exit(-1);
        }
    }

    public String encode(String hexPayload, String hexVersion) {
        byte[] s1Combined = Hex.hexStrToByte(hexVersion + hexPayload);

        byte[] doubleSha = sha256.digest(sha256.digest(s1Combined));
        byte[] checksum = Arrays.copyOfRange(doubleSha, 0, 4);

        String base58 = Base58.convert(hexVersion + hexPayload + Hex.byteArrToHex(checksum));
        return (hexVersion.equals("00") ? "1" : "") + base58;
    }

    public String decode(String base58Payload) {
        String hexPayload = Base58.revert(base58Payload);
        return hexPayload.substring(2, hexPayload.length()-8);
    }
}
