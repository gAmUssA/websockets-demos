package com.faratasystems.demos.websockets.task;

import com.faratasystems.demos.websockets.controller.StocksEndpoint;
import com.faratasystems.demos.websockets.domain.RandomStocksGenerator;

import javax.websocket.EncodeException;
import javax.websocket.Session;
import java.io.IOException;
import java.util.TimerTask;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 12/20/12
 */
public class BroadcastTask extends TimerTask {
    private final StocksEndpoint owner;

    public BroadcastTask(StocksEndpoint owner, int timeout) {
        this.owner = owner;
    }

    @Override
    public void run() {
        if (!owner.getParticipantList().isEmpty()) {
            for (Session s : owner.getParticipantList()) {
                try {
                    if (s.isOpen()) {
                        s.getRemote().sendObject(RandomStocksGenerator.getRandomValues());
                    }
                } catch (IOException | EncodeException e) {
                    e.printStackTrace();
                }
            }
        } else {
            owner.stopBroadcastTask();
        }
    }
}
