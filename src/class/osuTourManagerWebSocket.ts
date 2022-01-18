import ReconnectingWebSocket from "reconnecting-websocket"
import OsuTourManagerWebSocketServerMessage from "../interfaces/OsuTourManagerWebSocketServerMessage";

/** Class that able to strictly send OsuTourManagerWebSocketServerMessage
 */
export default class OsuTourManagerWebSocket extends ReconnectingWebSocket{
    sendStrictMessage(message: OsuTourManagerWebSocketServerMessage) : void {
        this.send(JSON.stringify(message));
    }
}