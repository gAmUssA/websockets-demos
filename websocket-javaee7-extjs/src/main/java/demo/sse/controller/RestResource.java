package demo.sse.controller;

import com.google.gson.Gson;
import demo.common.RandomStocksGenerator;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 3/26/13
 */
@Path("stock")
public class RestResource {

    @GET
    @Produces(value = MediaType.APPLICATION_JSON)
    public String getRandomValue() {
        Gson gson = new Gson();
        return gson.toJson(RandomStocksGenerator.getRandomValues());
    }

    @GET
    @Produces(value = MediaType.APPLICATION_JSON)
    @Path("/{ticker}")
    public String getRandomValue(@PathParam(value = "ticker") String ticker) {
        return new Gson().toJson(RandomStocksGenerator.getDataForTicker(ticker));
    }
}
