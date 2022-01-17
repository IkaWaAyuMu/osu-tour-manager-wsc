import serverConfig from "./config/config.json";

import ReconnectingWebSocket from "reconnecting-websocket";
import { Children, useEffect, useState } from "react";

import { Link, Routes, Route, BrowserRouter } from "react-router-dom";

const socket: ReconnectingWebSocket = new ReconnectingWebSocket(serverConfig.webSocketServer);

export default function App() {


    useEffect((): any => {
    
        socket.onopen = () => {
            console.log("Successfully Connected");
            console.log("connected");
            socket.send("SEND CONNECTION TEST");
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
            <BrowserRouter>
                <div id="top">
                    <Link to="/" className="topLink">SETUP</Link>
                    <Link to="/" className="topLink">SCREEN</Link>
                    <Link to="/" className="topLink">MATCH</Link>
                </div>
                <Routes>
                    <Route path="/" element={<div/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}