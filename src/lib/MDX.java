package src.lib;

import src.lib.Hex;

import java.security.MessageDigest;

public class MDX {
    private MessageDigest md2;
    private MessageDigest md5;

    public MDX() {
        try {
            md2 = MessageDigest.getInstance("MD2");
            md5 = MessageDigest.getInstance("MD5");
        } catch(Exception e) {
            //Exception is thrown if there isn't the MDX algortihms which means your standard Java install is missing files.
            System.out.println("Your Java install is missing the MDX algortihms.");
            System.exit(-1);
        }
    }

    public String md2(String data) {
        return Hex.byteArrToHex(md2.digest(Hex.hexStrToByte(data)));
    }

    public String md5(String data) {
        return Hex.byteArrToHex(md5.digest(Hex.hexStrToByte(data)));
    }
}
