package demo.sse.controller;

import demo.sse.task.SseBroadcastTask;
import org.glassfish.jersey.media.sse.EventOutput;
import org.glassfish.jersey.media.sse.SseBroadcaster;
import org.glassfish.jersey.media.sse.SseFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.Timer;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 3/25/13
 */
@Path("stock")
public class SseResource {
    private static final SseBroadcaster BROADCASTER = new SseBroadcaster();

    private static Logger logger = LoggerFactory.getLogger(SseResource.class);

    private boolean isRunning = false;
    private Timer broadcastTimer;

    @GET
    @Path("stock-generator")
    @Produces(SseFeature.SERVER_SENT_EVENTS)
    public EventOutput itemEvents() {
        final EventOutput eventOutput = new EventOutput();
        BROADCASTER.add(eventOutput);
        if (!isRunning) startBroadcastTask();
        return eventOutput;
    }

    @GET
    @Path("stop-generator")
    @Produces(MediaType.TEXT_PLAIN)
    public String stopBroadcast() {
        if (isRunning) {
            stopBroadcastTask();
        }

        return "STOPPED";
    }

    protected void startBroadcastTask() {
        broadcastTimer = new Timer();
        broadcastTimer.schedule(new SseBroadcastTask(BROADCASTER, 0), 0, 100);
        this.isRunning = true;
        logger.info("Started SSE broadcast task");
    }

    protected void stopBroadcastTask() {
        if (broadcastTimer != null) {
            broadcastTimer.cancel();
            broadcastTimer = null;
            this.isRunning = false;
        }
        logger.info("Stopped SSE broadcast task");
    }
}
