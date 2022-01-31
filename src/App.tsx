import serverConfig from "./config/config.json";

import { useEffect, useState } from "react";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import OsuTourManagerWebSocket from "./classes/osuTourManagerWebSocket";
import TourData from "./interfaces/tourData";
import OsuTourManagerWebSocketServerSendMessage from "./interfaces/OsuTourManagerWebSocketServerSendMessage";

const socket: OsuTourManagerWebSocket = new OsuTourManagerWebSocket(serverConfig.webSocketServer);

let count = 0;

type setNumberFunction = (arg: number) => void;

export default function App() {

    const [fetchedData, setFetchedData] = useState<TourData[]>([]);
    const [roundSelect, setRoundSelect] = useState(-1);

    useEffect((): any => {

        socket.onopen = () => {
            console.log("Successfully Connected");
        };
        socket.onclose = event => {
            console.log("Socket Closed Connection: ", event);
        };
        socket.onerror = error => {
            console.log("Socket Error: ", error);
        };
        socket.onmessage = (e) => {
            console.log(`Recieved: ${e.data}`);
            const temp: OsuTourManagerWebSocketServerSendMessage = JSON.parse(e.data);
            if (temp.message === "fetchTourData") socket.sendStrictMessage({ message: "getTourData" })
            if (temp.message === "getTourData" && temp.tourData !== undefined) setFetchedData(temp.tourData);
        }

        return () => socket.OPEN && socket.close();
    });

    return (
        <div>
            <BrowserRouter>
                <div id="top">
                    <Link to="/" className="topLink">SETUP</Link>
                    <Link to="/draft" className="topLink">DRAFT</Link>
                </div>
                <div id="body">
                    <Routes>
                        { /* Setup */}
                        <Route path="/" element={
                            <div>
                                <button style={{ margin: "10px 80px 20px 80px", width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }} onClick={() => socket.sendStrictMessage({ message: "fetchTourData" })}>refetch</button>
                                <div style={{ margin: "10px 10px 10px 10px", width: "90%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                    <div style={{ color: "white" }}>Round</div>
                                    <div>|||||</div>
                                    <RoundSelect fetchedData={fetchedData} setIndexFunction={setRoundSelect}/>
                                </div>
                                <div style={{ margin: "10px 10px 10px 10px", width: "90%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                    <div style={{ color: "white" }}>Round</div>
                                    <div>|||||</div>
                                    {<MatchSelect fetchedData={fetchedData} index={roundSelect}/>}
                                </div>
                            </div>
                        } />
                        { /* Draft */}
                        <Route path="/draft" element={
                            <div>

                            </div>
                        } />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

function RoundSelect(props :{fetchedData: TourData[], setIndexFunction: setNumberFunction}) {
    const {fetchedData, setIndexFunction} = props;
    function setIndex(): void {
        const select = document.getElementsByName("round")[0] as HTMLSelectElement;
        if (select === undefined) return;
        setIndexFunction(select.selectedIndex);
    }
    if (fetchedData.length <= 0) return (<select name="round" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}></select>);
    const roundOptions: JSX.Element[] = [];
    fetchedData.map((tourData => {
        roundOptions.push(<option key={count++} value={tourData.round}>{tourData.round}</option>);
    }))
    return (<select name="round" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white"}} onChange={setIndex}>{roundOptions}</select>);
}

function MatchSelect(props :{fetchedData: TourData[], index: number}) {
    const {fetchedData, index} = props;
    if (fetchedData.length <= 0) return (<select name="match" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}></select>);
    const matchOptions: JSX.Element[] = [];
    if (index < 0) return (<select name="match" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}></select>);
    fetchedData[index].matches.map((match) => {
        matchOptions.push(<option key={count++} value={match.match}>{match.match}</option>);
    })
    return (<select name="match" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}>{matchOptions}</select>);
}