package demos.websockets.domain;

import demos.common.domain.StockMessage;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 12/20/12
 */
public class RandomStocksGenerator {
    private static final Random generator = new Random();
    private static AtomicInteger lastId = new AtomicInteger(0);

    private static final String[] symbols = {"AAPL", "MSFT", "YHOO", "AMZN", "MOT"};

    public static StockMessage getRandomValues() {

        // Generate random number of shares of a random stock
        String price = Double.toString(generator.nextDouble() * 50.0);
        String symbol = symbols[generator.nextInt(symbols.length)];
        Integer id = lastId.incrementAndGet();
        return new StockMessage(id, symbol, price);

    }
}
