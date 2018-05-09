package src.lib;

import src.lib.HTTP;

public class CoinMarketCapEntry {
    public static String upArrow = "▲";
    public static String downArrow = "▼";

    private int rank = -1;
    private String symbol, price, percent, arrow;
    private boolean up;

    public CoinMarketCapEntry(int rank) throws Exception {
        this.rank = rank;
        getEntryByRank(rank);
    }

    public CoinMarketCapEntry(String symbol) throws Exception {
        this.symbol = symbol.toUpperCase();
        getEntryByID(getID(this.symbol));
    }

    public int getID(String symbol) throws Exception {
        String[] currency = HTTP.get("https://api.coinmarketcap.com/v2/listings").split("\"symbol\": \"" + symbol + "\"")[0].split("\"id\": ");
        return Integer.parseInt(currency[currency.length-1].split(",")[0]);
    }

    public void parseEntry(String coinData) {
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

    public void getEntryByRank(int rank) throws Exception {
        parseEntry(HTTP.get("https://api.coinmarketcap.com/v2/ticker/?start=" + rank + "&limit=1"));
    }

    public void getEntryByID(int id) throws Exception {
        parseEntry(HTTP.get("https://api.coinmarketcap.com/v2/ticker/" + id));
    }

    public void update() throws Exception {
        if (rank != -1) {
            getEntryByRank(rank);
        } else {
            getEntryByID(getID(symbol));
        }
    }

    public boolean isUp() {
        return up;
    }

    public String toString() {
        return symbol + " $" + price + " %" + percent;
    }
}
