package org.princetonjug.glassfishwebsocket;

import org.glassfish.websocket.api.annotations.WebSocket;
import org.glassfish.websocket.api.annotations.WebSocketMessage;

@WebSocket(path = "/echo")
public class EchoBean {
    @WebSocketMessage
    public String echo(String message) {
        System.out.println("##################### Message received");
        return message + " (from your server)";
    }
}
