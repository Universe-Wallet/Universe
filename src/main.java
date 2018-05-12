package src;

//These need to be compiled; until we have a build suite, they go in main.
import src.lib.Hex;
import src.lib.Random;
import src.lib.SHA;
import src.lib.SHA_3;
import src.lib.RIPEMD;
import src.lib.Base58;
import src.lib.Base58Check;
import src.lib.SECP256K1;
import src.lib.MDX;
import src.lib.TCPSocket;
import src.lib.FakeTLSSocket;
import src.lib.HTTP;
import src.lib.CoinMarketCapEntry;
import src.lib.LogWindow;

//This is actually needed.
import src.Coin;
import java.util.ArrayList;

import src.UI;
import java.lang.Thread;
import java.lang.Runnable;

public class main {
    public static void main(String[] args) throws Exception { //throws Exception adds extra logging.
        ArrayList<Coin> coins = new ArrayList<Coin>(0);
        String[] coinsToLoad = {"btc"};

        for (int i = 0; i < coinsToLoad.length; i++) {
            Coin coin;
            //try {
                coin = new Coin(coinsToLoad[i]);
                //System.out.println(coin.generate().getMember("address")); //Testing code.
            //} catch(Exception e) {
            //    System.out.println(coinsToLoad[i] + " failed to load.");
            //    continue;
            //}
            coins.add(coin);
        }


        (new Thread(new Runnable(){
            public void run() {
                UI ui = new UI();
            }
        })).start();
        return;
    }
}
