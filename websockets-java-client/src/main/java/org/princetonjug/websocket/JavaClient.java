package org.princetonjug.websocket;

import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.websocket.WebSocket;
import com.ning.http.client.websocket.WebSocketTextListener;
import com.ning.http.client.websocket.WebSocketUpgradeHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Date;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutionException;

import static java.util.concurrent.TimeUnit.MILLISECONDS;
import static java.util.concurrent.TimeUnit.SECONDS;

/**
 * simple java client that participated in chating with real people
 *
 * @author Viktor Gamov (http://log.javaheadbrain.com)
 * @since 7/24/12
 */
public class JavaClient {
    private static Logger logger = LoggerFactory.getLogger(JavaClient.class);

    public static void main(String[] args) {
        try {
            AsyncHttpClient c = new AsyncHttpClient();
            final WebSocket w = c.prepareGet("ws://localhost:8080/websockets-javaee7/chat")
                    .execute(new WebSocketUpgradeHandler.Builder().build())
                    .get();
            w.addWebSocketListener(new WebSocketTextListener() {
                public void onMessage(String message) {
                    logger.info("Message Received:  " + message);
                }

                @Override
                public void onFragment(String fragment, boolean last) {
                }

                public void onOpen(WebSocket websocket) {
                    logger.info("WebSocket Opened");
                }

                @Override
                public void onClose(WebSocket websocket) {
                    logger.info("Socket closed");
                }

                @Override
                public void onError(Throwable t) {
                    logger.error("Error: {}", t);
                }
            });
            Timer t = new Timer();
            Random random = new Random();
            t.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                    w.sendTextMessage("I'M A JAVA ROBOT IN THIS CHAT. CURRENT TIME IS: " + new Date());
                }
            }, 0, MILLISECONDS.convert(random.nextInt(20), SECONDS));
        } catch (InterruptedException e) {
            logger.error("InterruptedException: {}", e);
        } catch (ExecutionException e) {
            logger.error("ExecutionException: {}", e);
        } catch (IOException e) {
            logger.error("IOException: {}", e);
        }

    }
}
