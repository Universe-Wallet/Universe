package src.lib;

import src.lib.HTTP;

public class CoinMarketCapEntry {
    public static String upArrow = "▲";
    public static String downArrow = "▼";

    private String symbol, price, percent, arrow;
    private boolean up;

    public CoinMarketCapEntry(int id) throws Exception {
        String coinData = HTTP.get("https://api.coinmarketcap.com/v2/ticker/?start=" + id + "&limit=1");

        symbol = coinData.split("\"symbol\":")[1].split("\"")[1];
        price = coinData.split("\"price\": ")[1].split(",")[0];
        percent = coinData.split("\"percent_change_1h\": ")[1].split(",")[0];

        if (percent.contains("-")) {
            percent = percent.substring(1, percent.length());
            up = false;
            arrow = downArrow;
        } else {
            up = true;
            arrow = upArrow;
        }
    }

    public CoinMarketCapEntry(String ticker) throws Exception {

    }

    public boolean isUp() {
        return up;
    }

    public String toString() {
        return symbol + " $" + price + " %" + percent;
    }
}
