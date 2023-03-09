import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./App.css";

function App() {
  const url = "ws://192.168.0.9:8000/ws/" + "room" + "/";
  const [urlInput, setUrlInput] = useState(url);
  const [socketUrl, setSocketUrl] = useState(url);
  const [messageHistory, setMessageHistory] = useState([]);
  const [messageInput, setMessageInput] = useState(
    JSON.stringify({
      type: "type",
      text: "text",
      sender: "sender",
    })
  );

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(
        "🚀 ~ file: App.jsx:22 ~ useEffect ~ lastMessage:",
        lastMessage
      );
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="container">
      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        value={messageInput}
        onChange={(e) => {
          console.log(e.target.value);
          setMessageInput(e.target.value);
        }}
      />
      <label htmlFor="room">URL</label>
      <input
        id="room"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
      />
      <button onClick={() => setSocketUrl(urlInput)}>
        Click Me to change Socket Url
      </button>
      <button
        onClick={() => sendMessage(messageInput)}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
}

export default App;
