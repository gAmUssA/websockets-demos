package demo.websockets.controller;

import com.google.gson.Gson;
import demo.common.RandomStocksGenerator;
import demo.common.domain.StockMessage;
import demo.websockets.decode.StockMessageDecoder;
import demo.websockets.encode.StockMessageEncoder;
import demo.websockets.task.BroadcastTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Timer;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 12/20/12
 */
@ServerEndpoint(value = "/stock-generator",
        encoders = {
                StockMessageEncoder.class
        },
        decoders = {
                StockMessageDecoder.class
        })
public class StocksEndpoint {

    private static Logger logger = LoggerFactory.getLogger(StocksEndpoint.class);

    public transient List<Session> participantList = new ArrayList<>();
    private boolean isRunning = false;
    private Timer broadcastTimer;

    public synchronized void addClient(Session client) {
        participantList.add(client);
    }

    public synchronized void removeClient(Session session) {
        participantList.remove(session);
    }

    public synchronized List<Session> getParticipantList() {
        return Collections.unmodifiableList(participantList);
    }

    @OnOpen
    public void onOpen(Session session) {
        logger.info("Client connected");
        addClient(session);
        sendInitialData(session);
        if (!isRunning && !getParticipantList().isEmpty()) {
            startBroadcastTask();
        } else if (getParticipantList().isEmpty() && isRunning) {
            stopBroadcastTask();
        }
    }

    private void sendInitialData(Session s) {
        try {
            if (s.isOpen()) {
                Gson gson = new Gson();
                s.getBasicRemote().sendObject(gson.toJson(RandomStocksGenerator.getInitlaData()));
                //s.getRemote().sendObject(RandomStocksGenerator.getRandomValues());
            }
        } catch (IOException | EncodeException e) {
            e.printStackTrace();
        }
    }

    @OnClose
    public void onClose(Session session) {
        removeClient(session);
        logger.info("Client disconnected");
    }

    @OnMessage
    public void onMessage(StockMessage message, Session client) {
        logger.info(message.toString());
    }

    public void startBroadcastTask() {
        broadcastTimer = new Timer();
        broadcastTimer.schedule(new BroadcastTask(this, 0), 0, 100);
        this.isRunning = true;
        logger.info("Started broadcast task");
    }

    public void stopBroadcastTask() {
        broadcastTimer.cancel();
        broadcastTimer = null;
        this.isRunning = false;
        logger.info("Stopped broadcast task");
    }
}
