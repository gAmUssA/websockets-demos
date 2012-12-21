package com.faratasystems.demos.common.domain;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 12/20/12
 */
public class StockMessage {
    private String symbol;
    private String price;
    private String id;

    @Override
    public String toString() {
        return "StockMessage{" +
                "symbol='" + symbol + '\'' +
                ", price='" + price + '\'' +
                ", id='" + id + '\'' +
                '}';
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public StockMessage(Integer Id, String symbol, String price) {
        this.id = id;
        this.symbol = symbol;
        this.price = price;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
}
