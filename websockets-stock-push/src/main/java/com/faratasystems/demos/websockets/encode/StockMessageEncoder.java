package com.faratasystems.demos.websockets.encode;

import com.faratasystems.demos.common.domain.StockMessage;
import com.google.gson.Gson;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;

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
}
