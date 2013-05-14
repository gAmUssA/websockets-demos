package demo.websockets.decode;

import com.google.gson.Gson;
import demo.common.domain.StockMessage;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 3/26/13
 */
public class StockMessageDecoder implements Decoder.Text<StockMessage> {

    @Override
    public StockMessage decode(String s) throws DecodeException {
        Gson gson = new Gson();
        return gson.fromJson(s, StockMessage.class);
    }

    @Override
    public boolean willDecode(String s) {
        //TODO
        return true;
    }

    @Override
    public void init(EndpointConfig config) {
    }

    @Override
    public void destroy() {
    }
}
