import React, { useEffect, useRef, useState } from 'react'
import ACTIONS from '../Actions';
import { Client, Editor } from '../components'
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("[+] Socket Error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, { 
          code: codeRef.current,
          socketId,
        });
      });


      // Listening for disconnected 
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter(client => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error("Could not copy the Room ID");
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }

  if (!location.state) {
    return <Navigate to="/" />
  }
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/code-sync.png" className="logoImage" alt="code-sync" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList" >
            {
              clients.map((client) => (
                <Client
                  key={client.socketId}
                  username={client.username}
                />
              ))
            }
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId} >Copy ROOM ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className="editorWrap">
        <Editor socketRef={socketRef} roomId={roomId} OnCodeChange={
          (code) => {codeRef.current = code;
        }} />
      </div>

    </div>
  )
}

export default EditorPage