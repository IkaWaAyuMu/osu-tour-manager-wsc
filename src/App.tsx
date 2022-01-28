import serverConfig from "./config/config.json";

import { Children, useEffect, useState } from "react";

import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import OsuTourManagerWebSocket from "./classes/osuTourManagerWebSocket";

const socket: OsuTourManagerWebSocket = new OsuTourManagerWebSocket(serverConfig.webSocketServer);

export default function App() {

    useEffect((): any => {
    
        socket.onopen = () => {
            console.log("Successfully Connected");
            socket.send(JSON.stringify({command: "TEST"}));
            socket.sendStrictMessage({message: "getTourData"});
            socket.sendStrictMessage({message: "getMapMod", mapID: "1295717"});
        };
        socket.onclose = event => {
            console.log("Socket Closed Connection: ", event);
        };
        socket.onerror = error => {
            console.log("Socket Error: ", error);
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