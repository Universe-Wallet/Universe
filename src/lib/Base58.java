package src.lib;

import java.util.Arrays;
import java.util.List;

import java.math.BigInteger;

public class Base58 {
    private static List<String> Characters = Arrays.asList(
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z"
    );
    private static BigInteger base10 = new BigInteger("10");
    private static BigInteger base58 = new BigInteger("58");

    public static String convert(String strValue) {
        BigInteger value = new BigInteger(strValue, 16);
        String response = "";
        if (value.compareTo(BigInteger.ZERO) == -1) {
            return response;
        }

        BigInteger remainder;
        while (value.compareTo(base58) == 1) {
            remainder = value.remainder(base58);
            value = value.divide(base58);
            response = Characters.get(remainder.intValue()) + response;
        }
        remainder = value.remainder(base58);
        value = value.divide(base58);
        response = Characters.get(remainder.intValue()) + response;

        if (value.compareTo(BigInteger.ONE) == 0) {
            response = Characters.get(value.intValue()) + response;
        }

        return response;
    }

    public static String revert(String value) {
        int i;
        int valueLength = value.length();
        for (i = 0; i < valueLength; i++) {
            if (Characters.indexOf(value.substring(i, i+1)) == -1) {
                return "";
            }
        }
        int digits = valueLength;
        BigInteger digitValue;
        BigInteger digitMultiple;
        BigInteger total = new BigInteger("0");

        for (i = 0; i < valueLength; i++) {
            digits--;
            digitValue = new BigInteger(Integer.toString(Characters.indexOf(value.substring(i, i+1))));
            digitMultiple = new BigInteger(Integer.toString((int) Math.pow(58, digits)));
            total = total.add(digitValue.multiply(digitMultiple));
        }

        return total.toString(16);
    }
}
