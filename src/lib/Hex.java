package src.lib;

import java.math.BigInteger;

public class Hex {
    public static String toHex(String decimal) {
        return (new BigInteger(decimal)).toString(16).toLowerCase();
    }

    public static boolean isHigher(String number, String bound, boolean numOrBound) { //False is number is supposed to be higer, True else
        if (bound.equals("0")) {
            return true;
        } else {
            BigInteger biNumber = new BigInteger(number, 16);
            BigInteger biBound = new BigInteger(bound, 16);

            if (numOrBound) {
                return (biNumber.compareTo(biBound) == -1);
            } else {
                return (biNumber.compareTo(biBound) == 1);
            }
        }
    }

    private static char[] hexArray = "0123456789abcdef".toCharArray();
    public static String byteArrToHex(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];

        for (int i = 0; i < bytes.length; i++) {
            int hexChar = bytes[i] & 0xFF;
            hexChars[i * 2] = hexArray[hexChar >>> 4];
            hexChars[i * 2 + 1] = hexArray[hexChar & 0x0F];
        }

        return new String(hexChars);
    }

    public static byte[] hexStrToByte(String str) {
        byte[] data = new byte[str.length() / 2];
        for (int i = 0; i < data.length; i++) {
            int value = Integer.parseInt(str.substring((i*2), (i*2) + 2), 16);
            data[i] = (byte) value;
        }
        return data;
    }
}
