import serverConfig from "./config/config.json";

import { useEffect, useState } from "react";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import OsuTourManagerWebSocket from "./classes/osuTourManagerWebSocket";
import TourData from "./interfaces/tourData";
import OsuTourManagerWebSocketServerSendMessage from "./interfaces/OsuTourManagerWebSocketServerSendMessage";

const socket: OsuTourManagerWebSocket = new OsuTourManagerWebSocket(serverConfig.webSocketServer);

type setNumberFunction = (arg: number) => void;

export default function App() {

    const [fetchedData, setFetchedData] = useState<TourData[]>([]);
    const [roundSelect, setRoundSelect] = useState(0);
    const [matchIndex, setMatchIndex] = useState({round: -1, match: -1})

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
            if (temp.message === "getTourData" && temp.status === 0 && temp.tourData !== undefined) setFetchedData(temp.tourData);
            else if (temp.message === "setMatchIndex" && temp.status <= 1 && temp.status >=0) socket.sendStrictMessage({ message: "getMatchIndex" });
            else if (temp.message === "getMatchIndex" && (temp.status === 0 || temp.status === 4) && temp.matchIndex !== undefined) setMatchIndex(temp.matchIndex);
        }
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
                                <button style={{ margin: "10px 80px 5px 80px", width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }} onClick={() => socket.sendStrictMessage({ message: "fetchTourData" })}>refetch</button>
                                <button style={{ margin: "5px 80px 10px 80px", width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }} onClick={() => socket.sendStrictMessage({ message: "getTourData" })}>apply fetched</button>
                                <div style={{ margin: "10px 10px 10px 10px", width: "90%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                    <div style={{ color: "white" }}>Round</div>
                                    <div>|||||</div>
                                    <RoundSelect fetchedData={fetchedData} setIndexFunction={setRoundSelect}/>
                                </div>
                                <div style={{ margin: "10px 10px 10px 10px", width: "90%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                    <div style={{ color: "white" }}>Match</div>
                                    <div>|||||</div>
                                    {<MatchSelect fetchedData={fetchedData} index={roundSelect}/>}
                                </div>
                                <button style={{ margin: "10px 80px 10px 80px", width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }} onClick={() => socket.sendStrictMessage({ message: "setMatchIndex", matchIndex: Matchvalue(fetchedData)})}>set match</button>
                                <div style={{color: "white", margin: "10px 10px 10px 10px", width: "90%", display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && 
                                        <div>Round : { fetchedData[matchIndex.round].round} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length &&
                                        <div>Match : { fetchedData[matchIndex.round].matches[matchIndex.match].match} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length &&
                                        <div>Time : { fetchedData[matchIndex.round].matches[matchIndex.match].dateTime} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].leftSide !== undefined &&
                                        <div>LeftSide : { fetchedData[matchIndex.round].matches[matchIndex.match].leftSide} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].rightSide !== undefined &&
                                        <div>RightSide : { fetchedData[matchIndex.round].matches[matchIndex.match].rightSide} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].referee !== undefined &&
                                        <div>Referee : { fetchedData[matchIndex.round].matches[matchIndex.match].referee} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].streamer !== undefined &&
                                        <div>Streamer : { fetchedData[matchIndex.round].matches[matchIndex.match].streamer} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].comms1 !== undefined &&
                                        <div>1st Comms : { fetchedData[matchIndex.round].matches[matchIndex.match].comms1} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].comms2 !== undefined &&
                                        <div>2nd comms : { fetchedData[matchIndex.round].matches[matchIndex.match].comms2} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].leftScore !== undefined &&
                                        <div>LeftScore : { fetchedData[matchIndex.round].matches[matchIndex.match].leftScore} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].rightScore !== undefined &&
                                        <div>RightScore : { fetchedData[matchIndex.round].matches[matchIndex.match].rightScore} </div>}
                                </div>
                            </div>
                        }/>
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
        setIndexFunction(select.selectedIndex-2);
    }
    if (fetchedData.length <= 0) return (<select name="round" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}><option key={"R-2"} value={-1}>Please apply fetch</option></select>);
    const roundOptions: JSX.Element[] = [];
    fetchedData.map(((tourData, index) => {
        roundOptions.push(<option key={"R" + index} value={index}>{tourData.round}</option>);
    }))
    return (<select name="round" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white"}} onChange={setIndex} ><option key={"R-1"} value={-1}>Please select</option><option disabled>──────────</option>{roundOptions}</select>);
}

function MatchSelect(props :{fetchedData: TourData[], index: number}) {
    const {fetchedData, index} = props;
    if (fetchedData.length <= 0) return (<select name="match" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}><option key={"M-2"} value={-1}>Please apply fetch</option></select>);
    const matchOptions: JSX.Element[] = [];
    if (index < 0) return (<select name="match" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}></select>);
    fetchedData[index].matches.map((match, index) => {
        matchOptions.push(<option key={"M" + index} value={index}>{match.match}</option>);
    })
    return (<select name="match" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}><option key={"M-1"} value={-1}>Please select</option><option disabled>──────────</option>{matchOptions}</select>);
}

function Matchvalue(tourData: TourData[]) {
    if (parseInt((document.getElementsByName("round")[0] as HTMLSelectElement).value) === undefined) return {round: -1 ,match: -1};
    const roundIndex = parseInt((document.getElementsByName("round")[0] as HTMLSelectElement).value);
    if (roundIndex < 0 || roundIndex >= tourData.length) return {round: -1 ,match: -1};
    if (parseInt((document.getElementsByName("match")[0] as HTMLSelectElement).value) === undefined) return {round: roundIndex ,match: -1};
    const matchIndex = parseInt((document.getElementsByName("match")[0] as HTMLSelectElement).value);
    if (matchIndex < 0 || matchIndex >= tourData[roundIndex].matches.length) return {round: roundIndex ,match: -1};
    return {round: roundIndex ,match: matchIndex};
}