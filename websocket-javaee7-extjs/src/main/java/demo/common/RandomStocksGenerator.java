package demo.common;

import demo.common.domain.StockMessage;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
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

    private static final String[] symbols = {"AAPL", "MSFT", "YHOO", "AMZN", "MOT", "FLWS",
            "FCTY",
            "FCCY",
            "SRCE",
            "FUBC",
            "VNET",
            "SSRX"
            /*"JOBS",
            "EGHT", "AVHI",
            "SHLM",
            "AAON",
            "ASTM",
            "ABAX",
            "ABMD",
            "AXAS",
            "ACRX",
            "ACET",
            "ACHN",
            "ACIW",
            "APKT",
            "ACNB",
            "ACOR",
            "ACFN",
            "ACTS",
            "ACPW",
            "ATVI",
            "BIRT",
            "ACUR",
            "ACXM",
            "ADES",
            "ADUS",
            "AEY",
            "ADEP",
            "ADBE",
            "ADTN",
            "AEIS",
            "ADVS",
            "AVCA",
            "AEGR",
            "AEGN",
            "AEHR"*/};

    public static StockMessage getRandomValues() {

        // Generate random number of shares of a random stock
        Double price = generator.nextDouble() * 50.0;
        int totalSymbols = symbols.length;
        String symbol = symbols[generator.nextInt(totalSymbols)];
        Integer id = lastId.incrementAndGet();

        DecimalFormat twoDForm = new DecimalFormat("#.####");
        price = Double.valueOf(twoDForm.format(price));

        return new StockMessage(id, symbol, price.toString());

    }

    public static StockMessage getDataForTicker(String ticker) {
        Double price = generator.nextDouble() * 50.0;
        return new StockMessage(lastId.incrementAndGet(), ticker, price.toString());
    }

    public static StockMessage[] getInitialData() {
        List<StockMessage> list = new ArrayList<>();


        /*Comparator<StockMessage> bySymbolName = new Comparator<StockMessage>() {
            @Override
            public int compare(StockMessage o1, StockMessage o2) {
                return o1.getSymbol().compareTo(o2.getSymbol());
            }
        };*/

        for (String symbol : symbols) {
            Double price = generator.nextDouble() * 50.0;
            Integer id = lastId.incrementAndGet();
            list.add(new StockMessage(id, symbol, price.toString()));
        }

        /*List<StockMessage> sortedCopy = Ordering.from(bySymbolName).sortedCopy(list);*/

        return list.toArray(new StockMessage[list.size()]);
    }
}
