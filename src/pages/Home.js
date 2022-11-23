import React, { useState } from 'react'
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  }

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      }
    });

  }

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  }


  return (
    <div className="homePageWrapper">
      <div className="formWrapper" >
        <img src="/code-sync.png" className="homePageLogo" alt="code-sync-logo" />
        <h4 className="mainLable" >Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input type="text" className="inputBox" placeholder="ROOM ID" onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleInputEnter} value={roomId} />
          <input type="text" className="inputBox" placeholder="USERNAME" onChange={(e) => setUsername(e.target.value)} onKeyUp={handleInputEnter} value={username} />
          <button className="btn joinBtn" onClick={joinRoom} >Join</button>
          <span className="createInfo" > If you don't an invite then create &nbsp;<a className='createNewBtn' href='/' onClick={createNewRoom} >new room</a></span>
        </div>
      </div>
      <footer>
        <h4> Built with ❤️ by <a href='/'>Mayank Srivastava</a></h4>
      </footer>
    </div>
  )
}

export default Home
