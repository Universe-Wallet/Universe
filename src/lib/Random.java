package src.lib;

import src.lib.Hex;

import java.security.SecureRandom;
import java.math.BigInteger;

public class Random {
    SecureRandom random;

    public Random() {
        try {
            random = SecureRandom.getInstanceStrong();
        } catch(Exception e) {
            //Exception is thrown if there isn't a strong instance which means your standard Java install is missing files.
            System.out.println("Your Java install is missing a SecureRandom Strong Instance.");
            System.exit(-1);
        }
    }

    //Untested.
    public String bytes(int byteQuantity, String low, String high) throws Exception { //Throws Exception if it takes too long or the bounds are invalid.
        String result;

        do {
            byte[] byteArray = new byte[byteQuantity];
            random.nextBytes(byteArray);
            result = Hex.byteArrToHex(byteArray);
        } while(!(Hex.isHigher(result, low, false) && Hex.isHigher(result, high, true)));

        return result;
    }
}
