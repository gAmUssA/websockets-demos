package demo.websockets.encode;

import com.google.gson.Gson;
import demo.common.domain.StockMessage;

import javax.websocket.*;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 12/20/12
 */
public class StockMessageEncoder implements Encoder.Text<StockMessage>, Decoder.Text<StockMessage> {
    @Override
    public String encode(StockMessage object) throws EncodeException {
        return new Gson().toJson(object);
    }

    @Override
    public StockMessage decode(String s) throws DecodeException {
        Gson gson = new Gson();
        return gson.fromJson(s, StockMessage.class);
    }

    @Override
    public boolean willDecode(String s) {
        // TODO
        return true;
    }

    @Override
    public void init(EndpointConfig config) {
    }

    @Override
    public void destroy() {
    }
}
