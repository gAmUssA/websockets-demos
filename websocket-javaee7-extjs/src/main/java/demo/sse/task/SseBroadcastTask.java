package demo.sse.task;

import demo.common.RandomStocksGenerator;
import org.glassfish.jersey.media.sse.OutboundEvent;
import org.glassfish.jersey.media.sse.SseBroadcaster;

import java.util.TimerTask;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 3/25/13
 */
public class SseBroadcastTask extends TimerTask {

    private final SseBroadcaster owner;

    public SseBroadcastTask(SseBroadcaster owner, int timeout) {
        this.owner = owner;
    }

    @Override
    public void run() {
        OutboundEvent event = new OutboundEvent.Builder()
                .data(String.class, RandomStocksGenerator.getRandomValues().toJson()).build();

        //event = new OutboundEvent.Builder().mediaType(MediaType.APPLICATION_JSON_TYPE).data(S)
        owner.broadcast(event);
    }
}

