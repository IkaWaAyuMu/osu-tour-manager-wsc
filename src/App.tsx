import serverConfig from "./config/config.json";

import ReconnectingWebSocket from "reconnecting-websocket";
import { useEffect, useState } from "react";

export default function App() {

    const socket: ReconnectingWebSocket = new ReconnectingWebSocket(serverConfig.webSocketServer);

    useEffect((): any => {
    
        socket.onopen = () => {
            console.log("Successfully Connected");
            console.log("connected");
            socket.send("Example message.");
        };
        socket.onclose = event => {
            console.log("Socket Closed Connection: ", event);
            socket.send("Client Closed!");
        };
        socket.onerror = error => {
            console.log("Socket Error: ", error);
        };
        socket.onclose = event => {
            console.log("Socket Closed Connection: ", event);
            socket.send("Client Closed!");
        };
        socket.onmessage = (e) => {
            console.log(`Recieved: ${e.data}`);
        }
    
        return () => socket.OPEN && socket.close();
      });

    return (
        <div>

        </div>
    );
}