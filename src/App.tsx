import serverConfig from "./config/config.json";

import { useEffect, useState } from "react";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import { Textfit }  from "react-textfit";
import OsuTourManagerWebSocket from "./classes/osuTourManagerWebSocket";
import TourData from "./interfaces/tourData";
import OsuTourManagerWebSocketServerSendMessage from "./interfaces/OsuTourManagerWebSocketServerSendMessage";
import DraftData from "./interfaces/draftData";

const socket: OsuTourManagerWebSocket = new OsuTourManagerWebSocket(serverConfig.webSocketServer);

type setNumberFunction = (arg: number) => void;
type setSideFunction = (arg: "left" | "right") => void;
type setActionFunction = (arg: "pick" | "ban") => void;

export default function App() {

    const [fetchedData, setFetchedData] = useState<TourData[]>([]);
    const [roundSelect, setRoundSelect] = useState(0);
    const [matchIndex, setMatchIndex] = useState({ round: -1, match: -1 });
    const [draftData, setDraftData] = useState<DraftData[]>();
    const [actionSide, setActionSide] = useState<"left" | "right">("left");
    const [action, setAction] = useState<"pick" | "ban">("ban");
    const [mapIndex, setMapIndex] = useState(-1);

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
            if (temp.message === "getTourData" && temp.status === 0 && temp.tourData !== undefined) {
                setFetchedData(temp.tourData);
                socket.sendStrictMessage({ message: "getMatchIndex" });
                socket.sendStrictMessage({ message : "getDraftData"});
            }
            else if (temp.message === "setMatchIndex" && temp.status <= 1 && temp.status >= 0) socket.sendStrictMessage({ message: "getMatchIndex" });
            else if (temp.message === "getMatchIndex" && (temp.status === 0 || temp.status === 4) && temp.matchIndex !== undefined) setMatchIndex(temp.matchIndex);
            else if (temp.message === "appendDraftAction" && temp.status === 0) socket.sendStrictMessage({ message : "getDraftData"});
            else if (temp.message === "getDraftData" && temp.status === 0 && temp.draftData !== undefined) setDraftData(temp.draftData);
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
                                <button style={{ margin: "10px 10% 0px 10%", width: "80%", borderRadius: "10px 10px 0px 0px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }} onClick={() => socket.sendStrictMessage({ message: "fetchTourData" })}>refetch</button>
                                <button style={{ margin: "0px 10% 10px 10%", width: "80%", borderRadius: "0px 0px 10px 10px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }} onClick={() => socket.sendStrictMessage({ message: "getTourData" })}>apply fetched</button>
                                <div style={{ margin: "10px 10px 10px 10px", width: "90%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                    <div style={{ color: "white" }}>Round</div>
                                    <RoundSelect fetchedData={fetchedData} setIndexFunction={setRoundSelect} />
                                </div>
                                <div style={{ margin: "10px 10px 10px 10px", width: "90%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                    <div style={{ color: "white" }}>Match</div>
                                    {<MatchSelect fetchedData={fetchedData} index={roundSelect} />}
                                </div>
                                <button style={{ margin: "10px 10% 10px 10%", width: "80%", borderRadius: "10px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }} onClick={() => socket.sendStrictMessage({ message: "setMatchIndex", matchIndex: Matchvalue(fetchedData) })}>set match</button>
                                <div style={{ color: "white", margin: "10px 10px 10px 10px", width: "90%", display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length &&
                                        <div>Round : {fetchedData[matchIndex.round].round} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length &&
                                        <div>Match : {fetchedData[matchIndex.round].matches[matchIndex.match].match} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length &&
                                        <div>Time : {fetchedData[matchIndex.round].matches[matchIndex.match].dateTime} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].leftSide !== undefined &&
                                        <div>LeftSide : {fetchedData[matchIndex.round].matches[matchIndex.match].leftSide} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].rightSide !== undefined &&
                                        <div>RightSide : {fetchedData[matchIndex.round].matches[matchIndex.match].rightSide} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].referee !== undefined &&
                                        <div>Referee : {fetchedData[matchIndex.round].matches[matchIndex.match].referee} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].streamer !== undefined &&
                                        <div>Streamer : {fetchedData[matchIndex.round].matches[matchIndex.match].streamer} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].comms1 !== undefined &&
                                        <div>1st Comms : {fetchedData[matchIndex.round].matches[matchIndex.match].comms1} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].comms2 !== undefined &&
                                        <div>2nd comms : {fetchedData[matchIndex.round].matches[matchIndex.match].comms2} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].leftScore !== undefined &&
                                        <div>LeftScore : {fetchedData[matchIndex.round].matches[matchIndex.match].leftScore} </div>}
                                    {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length && fetchedData[matchIndex.round].matches[matchIndex.match].rightScore !== undefined &&
                                        <div>RightScore : {fetchedData[matchIndex.round].matches[matchIndex.match].rightScore} </div>}
                                </div>
                            </div>
                        } />
                        { /* Draft */}
                        <Route path="/draft" element={
                            <div>
                                <DraftSide tourData={fetchedData} matchIndex={matchIndex} currentSide={actionSide} setSideFunction={setActionSide} />
                                <DraftAction tourData={fetchedData} matchIndex={matchIndex} currentAction={action} setActionFunction={setAction} />
                                {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length &&
                                    <button style={{ margin: "5px 10% 10px 10%", width: "80%", borderRadius: "10px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }} onClick={() => socket.sendStrictMessage({message: "appendDraftAction", draftAction: {side: actionSide, action: action, mapIndex: "PLACEHOLDER"}})}>Set placeholder</button>}
                                <DraftMaps tourData={fetchedData} matchIndex={matchIndex} currentMapIndex={mapIndex} setMapIndexFunction={setMapIndex}/>
                                {matchIndex.round >= 0 && matchIndex.round < fetchedData.length && matchIndex.match >= 0 && matchIndex.match < fetchedData[matchIndex.round].matches.length &&
                                    <button disabled={!(mapIndex >= 0 && mapIndex < fetchedData[matchIndex.round].maps.length)} style={{ margin: "5px 10% 10px 10%", width: "80%", borderRadius: "10px", fontSize: "25px", backgroundColor: mapIndex >= 0  && mapIndex < fetchedData[matchIndex.round].maps.length ? "#8F8F8FFF" : "#0F0F0FFF", color: "white" }} onClick={() => socket.sendStrictMessage({message: "appendDraftAction", draftAction: {side: actionSide, action: action, mapIndex: mapIndex}})}>{action.toUpperCase()}!</button>}
                                {draftData !== undefined && <div style={{ color: "white", margin: "10px 10px 10px 10px", width: "90%"}}>{draftData.toString()}</div>}
                            </div>
                        } />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

function RoundSelect(props: { fetchedData: TourData[], setIndexFunction: setNumberFunction }) {
    const { fetchedData, setIndexFunction } = props;
    function setIndex(): void {
        const select = document.getElementsByName("round")[0] as HTMLSelectElement;
        if (select === undefined) return;
        setIndexFunction(select.selectedIndex - 2);
    }
    if (fetchedData.length <= 0) return (<select name="round" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}><option key={"R-2"} value={-1}>Please apply fetch</option></select>);
    const roundOptions: JSX.Element[] = [];
    fetchedData.map(((tourData, index) => {
        roundOptions.push(<option key={"R" + index} value={index}>{tourData.round}</option>);
    }))
    return (<select name="round" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }} onChange={setIndex} ><option key={"R-1"} value={-1}>Please select</option><option disabled>──────────</option>{roundOptions}</select>);
}

function MatchSelect(props: { fetchedData: TourData[], index: number }) {
    const { fetchedData, index } = props;
    if (fetchedData.length <= 0) return (<select name="match" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}><option key={"M-2"} value={-1}>Please apply fetch</option></select>);
    const matchOptions: JSX.Element[] = [];
    if (index < 0) return (<select name="match" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}></select>);
    fetchedData[index].matches.map((match, index) => {
        matchOptions.push(<option key={"M" + index} value={index}>{match.match}</option>);
    })
    return (<select name="match" style={{ width: "200px", borderRadius: "5px", fontSize: "25px", backgroundColor: "#8F8F8FFF", color: "white" }}><option key={"M-1"} value={-1}>Please select</option><option disabled>──────────</option>{matchOptions}</select>);
}

function Matchvalue(tourData: TourData[]) {
    if (parseInt((document.getElementsByName("round")[0] as HTMLSelectElement).value) === undefined) return { round: -1, match: -1 };
    const roundIndex = parseInt((document.getElementsByName("round")[0] as HTMLSelectElement).value);
    if (roundIndex < 0 || roundIndex >= tourData.length) return { round: -1, match: -1 };
    if (parseInt((document.getElementsByName("match")[0] as HTMLSelectElement).value) === undefined) return { round: roundIndex, match: -1 };
    const matchIndex = parseInt((document.getElementsByName("match")[0] as HTMLSelectElement).value);
    if (matchIndex < 0 || matchIndex >= tourData[roundIndex].matches.length) return { round: roundIndex, match: -1 };
    return { round: roundIndex, match: matchIndex };
}

//-------------------------------------------------------------------------

function DraftSide(props: { tourData: TourData[], matchIndex: { round: number, match: number }, currentSide: "left" | "right", setSideFunction: setSideFunction }) {
    const { tourData, matchIndex, currentSide, setSideFunction } = props;
    if (matchIndex.round < 0 || matchIndex.round >= tourData.length) return <div style={{  margin: "0px 10px 10px 0px", color: "white", fontSize: "50px", textAlign: "center"  }}>No match chosen</div>;
    if (matchIndex.match < 0 || matchIndex.round >= tourData[matchIndex.round].matches.length) return <div style={{  margin: "0px 10px 10px 0px", color: "white", fontSize: "50px", textAlign: "center" }}>No match chosen</div>;
    return (
        <div style={{margin: "0px 10px 0px 10px", width: "90%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button style={{ width: "50%", height: "35px", borderRadius: "10px 0px 0px 0px", fontSize: "25px", backgroundColor: currentSide === "left" ? "#C7C7C7" : "#8F8F8FFF" , color: "white" }} onClick={() => setSideFunction("left")}><Textfit mode="single" max={25}>{tourData[matchIndex.round].matches[matchIndex.match].leftSide}</Textfit></button>
            <button style={{ width: "50%", height: "35px", borderRadius: "0px 10px 0px 0px", fontSize: "25px", backgroundColor: currentSide === "right" ? "#C7C7C7" : "#8F8F8FFF", color: "white" }} onClick={() => setSideFunction("right")}><Textfit mode="single" max={25}>{tourData[matchIndex.round].matches[matchIndex.match].rightSide}</Textfit></button>
        </div>
    );
}

function DraftAction(props: { tourData: TourData[], matchIndex: { round: number, match: number }, currentAction: "pick" | "ban", setActionFunction : setActionFunction }) {
    const { tourData, matchIndex, currentAction, setActionFunction } = props;
    if (matchIndex.round < 0 || matchIndex.round >= tourData.length) return <div/>;
    if (matchIndex.match < 0 || matchIndex.round >= tourData[matchIndex.round].matches.length) return <div/>;
    return (
        <div style={{margin: "0px 10px 10px 10px", width: "90%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button style={{ width: "50%", height: "35px", borderRadius: "0px 0px 0px 10px", fontSize: "25px", backgroundColor: currentAction === "pick" ? "#C7C7C7" : "#8F8F8FFF", color: "white"  }} onClick={() => setActionFunction("pick")}>Pick</button>
            <button style={{ width: "50%", height: "35px", borderRadius: "0px 0px 10px 0px", fontSize: "25px", backgroundColor: currentAction === "ban" ? "#C7C7C7" : "#8F8F8FFF", color: "white" }} onClick={() => setActionFunction("ban")}>Ban</button>
        </div>
    );
}

function DraftMaps(props: { tourData: TourData[], matchIndex: { round: number, match: number }, currentMapIndex: number, setMapIndexFunction: setNumberFunction}) {
    const { tourData, matchIndex, currentMapIndex, setMapIndexFunction} = props;
    if (matchIndex.round < 0 || matchIndex.round >= tourData.length) { setMapIndexFunction(-1); return <div/>;}
    if (matchIndex.match < 0 || matchIndex.round >= tourData[matchIndex.round].matches.length) { setMapIndexFunction(-1); return <div/>;}
    if (currentMapIndex >= tourData[matchIndex.round].maps.length) setMapIndexFunction(-1);
    const maps: JSX.Element[] = []
    tourData[matchIndex.round].maps.map((map, index) => {
        maps.push(<button key={"Map"+index} style={{margin:"1%", width: "23%", height: "50px", borderRadius: "10px", fontSize: "25px", backgroundColor: currentMapIndex === index ? "#C7C7C7" : "#8F8F8FFF" , color: "white" }} onClick={() => setMapIndexFunction(index)}><Textfit mode="single" max={25}>{map.mod}</Textfit></button>);
    })
    return (
        <div style={{margin: "0px 10px 10px 10px", width: "90%", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}}>
            {maps}
        </div>
    );
}