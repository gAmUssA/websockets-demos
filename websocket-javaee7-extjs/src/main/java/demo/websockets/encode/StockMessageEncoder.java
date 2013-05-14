package demo.websockets.encode;

import com.google.gson.Gson;
import demo.common.domain.StockMessage;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 12/20/12
 */
public class StockMessageEncoder implements Encoder.Text<StockMessage> {
    @Override
    public String encode(StockMessage object) throws EncodeException {
        return new Gson().toJson(object);
    }

    @Override
    public void init(EndpointConfig config) {
    }

    @Override
    public void destroy() {
    }
}
