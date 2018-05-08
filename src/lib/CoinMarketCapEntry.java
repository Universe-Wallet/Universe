package src.lib;

import src.lib.HTTP;

public class CoinMarketCapEntry {
    private String symbol, price, percent, arrow;

    public static boolean isGreen(String data) {
        return (data.substring(0, 1) == "▲");
    }

    public static String getPriceData(int id) {
        try {
            String symbol, price, percent, arrow;
            String coinData = HTTP.get("https://api.coinmarketcap.com/v2/ticker/?start=" + id + "&limit=1");

            symbol = coinData.split("\"symbol\":")[1].split("\"")[1];

            price = coinData.split("\"price\": ")[1].split(",")[0];

            percent = coinData.split("\"percent_change_1h\": ")[1].split(",")[0];
            if (percent.contains("-")) {
                percent = percent.substring(1, percent.length());
                arrow = "▲";
            } else {
                arrow = "▼";
            }

            return arrow + symbol + " $" + price + " %" + percent;
        } catch(Exception e) {
            return "";
        }
    }

    public CoinMarketCapEntry(int id) {

    }

    public CoinMarketCapEntry(String ticker) {

    }
}
