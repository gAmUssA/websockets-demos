package demo.sse.controller;

import org.glassfish.jersey.media.sse.SseFeature;
import org.glassfish.jersey.server.ResourceConfig;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 3/6/13
 */
@javax.ws.rs.ApplicationPath("rest")
public class RestApplication extends ResourceConfig {
    public RestApplication() {
        super(RestResource.class, SseResource.class, SseFeature.class);
    }
}
