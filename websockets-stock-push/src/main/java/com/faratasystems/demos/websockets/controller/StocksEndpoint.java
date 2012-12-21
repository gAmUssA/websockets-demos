package com.faratasystems.demos.websockets.controller;

import com.faratasystems.demos.websockets.encode.StockMessageEncoder;
import com.faratasystems.demos.websockets.task.BroadcastTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.Session;
import javax.websocket.WebSocketClose;
import javax.websocket.WebSocketEndpoint;
import javax.websocket.WebSocketOpen;
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
@WebSocketEndpoint(value = "stock-generator",
        encoders = {
                StockMessageEncoder.class
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

    @WebSocketOpen
    public void onOpen(Session session) {
        logger.info("Client connected");
        addClient(session);
        if (!isRunning && !getParticipantList().isEmpty()) {
            startBroadcastTask();
        } else if (getParticipantList().isEmpty() && isRunning) {
            stopBroadcastTask();
        }
    }

    @WebSocketClose
    public void onClose(Session session) {
        removeClient(session);
        logger.info("Client disconnected");
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
