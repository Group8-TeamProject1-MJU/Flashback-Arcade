import * as signalR from "@microsoft/signalr";
import { useEffect, useState, useRef } from "react";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7284/chathub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export default function Chatting() {
    const initialMsg = Object.freeze([{
        username: "관리자",
        content: "채팅을 시작해보세요."
    }]);
    const [messages, setMessages] = useState(initialMsg);
    const [userName, setUserName] = useState(new Date().getTime());
    const [inputMsg, setInputMsg] = useState("Enter a message to send");
    const msgInputRef = useRef(null);

    useEffect(() => {
        connection.onreconnecting((cid) => {
            console.log("trying to reconnect to server...");
        });
        connection.onreconnected((cid) => {
            console.log("Reconnected");
        });
        connection.onclose((error) => {
            console.log(`Connection has closed...${error}`);
        })
        connection.on("ReceiveMessage", (username, message) => {
            var msgsClone = [...messages, { username: username, content: message }];
            setMessages(messages);
        });

        if (connection.state === "Disconnected") {

            connection.start();
        }

        return () => {
            // connection.stop();
            console.log("Connection has closed");
        };
    }, [])

    return (
        <>
            {connection.state === "Connected" && <>
                <label htmlFor="username">유저명</label>
                <input id="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <label htmlFor="message">Message:</label>
                <input id="message" type="text"
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === "Enter")
                            send();
                    }}
                    ref={msgInputRef} />
                <button onClick={e => {
                    e.preventDefault();
                    send();
                }}>Send</button>

                {messages.map((mes, idx) => {
                    return (
                        <div key={idx}>{mes.username}: {mes.content}</div>
                    );
                })}
            </>
            }

        </>
    );

    function send() {
        connection.send("SendMessage", userName, inputMsg).catch((err) => console.error(err.toString()));
        var msgsClone = [...messages, { username: userName, content: inputMsg }];
        setMessages(messages, msgsClone);
        console.log(`Sent ${inputMsg}`);
        msgInputRef.current.value = "";
        setInputMsg("");
    }
}
