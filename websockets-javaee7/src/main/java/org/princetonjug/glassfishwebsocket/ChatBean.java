package org.princetonjug.glassfishwebsocket;

import org.glassfish.websocket.api.Conversation;
import org.glassfish.websocket.api.EndpointContext;
import org.glassfish.websocket.api.Peer;
import org.glassfish.websocket.api.annotations.WebSocket;
import org.glassfish.websocket.api.annotations.WebSocketContext;
import org.glassfish.websocket.api.annotations.WebSocketMessage;
import org.glassfish.websocket.api.annotations.WebSocketOpen;

import java.io.IOException;
import java.util.Set;
import java.util.logging.Logger;

/**
 * TODO
 *
 * @author Viktor Gamov (http://log.javaheadbrain.com)
 * @since 7/24/12
 */
@WebSocket(path = "/chat")
public class ChatBean {
    final static Logger logger = Logger.getLogger("application");

    @WebSocketContext
    public EndpointContext context;

    @WebSocketOpen
    public void init(Peer remote) {
        logger.info("############Someone connected...");
    }

    @WebSocketMessage
    public void chatMessage(String message) {
        Set<Conversation> conversations = context.getConversations();
        for (Conversation conversation : conversations) {
            try {
                conversation.getPeer().sendMessage(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}
