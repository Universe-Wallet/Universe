package src;

//These need to be compiled; until we have a build suite, they go in main.
import src.lib.Hex;
import src.lib.Random;
import src.lib.SHA;
import src.lib.RIPEMD;
import src.lib.Base58;
import src.lib.Base58Check;
import src.lib.SECP256K1;
import src.lib.MDX;
import src.lib.TCPSocket;
import src.lib.HTTP;

//This is actually needed.
import src.Coin;

import src.lib.Point;
import java.math.BigInteger;
import java.math.BigDecimal;
import java.util.ArrayList;

public class main {
    public static void main(String[] args) throws Exception { //throws Exception adds extra logging.
        ArrayList<Coin> coins = new ArrayList<Coin>(0);
        String[] coinsToLoad = {"btc", "eth"};

        for (int i = 0; i < coinsToLoad.length; i++) {
            Coin coin;
            //try {
                coin = new Coin(coinsToLoad[i]);
                System.out.println(coin.generate().getMember("address")); //Testing code.
            //} catch(Exception e) {
            //    System.out.println(coinsToLoad[i] + " failed to load.");
            //    continue;
            //}
            coins.add(coin);
        }

        return;
    }
}
