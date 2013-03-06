package demo.sse.controller;

import javax.ws.rs.core.Application;
import java.util.Set;

/**
 * TODO
 *
 * @author Viktor Gamov (viktor.gamov@faratasystems.com)
 * @since 3/6/13
 */
@javax.ws.rs.ApplicationPath("rest")
public class RestApplication extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        resources.add(RestResource.class);
        return resources;
    }
}
