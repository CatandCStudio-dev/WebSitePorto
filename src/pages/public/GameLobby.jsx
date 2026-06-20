import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbCnc } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { generateBoard } from '../../utils/gameLogic';

export default function GameLobby() {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!nickname.trim()) return alert("Please enter a nickname!");
    
    // Generate random 4-character room code
    const newRoomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Generate Board
    const startingTeam = Math.random() > 0.5 ? "cat" : "coffee";
    const initialBoard = generateBoard(startingTeam);
    
    // Generate unique session ID for the user
    const sessionId = Math.random().toString(36).substring(2, 10);
    
    // Setup initial game state
    const gameRef = doc(dbCnc, "codenames_games", newRoomId);
    await setDoc(gameRef, {
      roomId: newRoomId,
      status: "waiting",
      turn: `${startingTeam}_master`,
      clue: { word: "", count: 0 },
      board: initialBoard,
      markedCards: [],
      players: [
        { sessionId, name: nickname, role: null, team: null, isHost: true, isOnline: true }
      ],
      winner: null
    });

    // Save credentials to local storage for the session
    sessionStorage.setItem("cn_nickname", nickname);
    sessionStorage.setItem("cn_sessionId", sessionId);
    navigate(`/games/codenames/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!nickname.trim()) return alert("Please enter a nickname!");
    if (!roomCode.trim()) return alert("Please enter a room code!");
    
    const sessionId = Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem("cn_nickname", nickname);
    sessionStorage.setItem("cn_sessionId", sessionId);
    navigate(`/games/codenames/${roomCode.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#141E30] bg-noise text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative ambient glow in background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-10 z-10">
        <i className="bi bi-chat-left-heart-fill text-4xl text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"></i>
        <h1 className="text-4xl md:text-5xl font-bold text-[#E2C792] text-center drop-shadow-md tracking-wider">
          CODENAMES
          <span className="block text-2xl md:text-3xl mt-2 text-white/90">Cat vs Coffee</span>
        </h1>
        <i className="bi bi-cup-hot-fill text-4xl text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]"></i>
      </div>
      
      <div className="bg-black/40 p-8 rounded-2xl w-full max-w-md backdrop-blur-md border border-white/10 shadow-2xl z-10">
        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-300 font-semibold uppercase tracking-wider">Your Nickname</label>
          <input 
            type="text" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/50 border border-white/20 text-white transition-all glow-focus-cat"
            placeholder="e.g. Master Meow"
          />
        </div>

        <div className="flex flex-col gap-5 mt-8">
          <button 
            onClick={handleCreateRoom}
            className="w-full py-4 bg-[#E2C792] text-[#141E30] font-bold rounded-xl soft-3d-button text-lg uppercase tracking-widest"
          >
            Create New Game
          </button>
          
          <div className="relative flex py-2 items-center justify-center">
            <div className="h-[1px] w-full divider-gradient"></div>
            <span className="absolute px-4 bg-[#141E30] text-gray-400 text-xs font-bold uppercase tracking-widest rounded-full">OR</span>
          </div>

          <div className="flex gap-3">
            <input 
              type="text" 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-black/50 border border-white/20 text-white uppercase text-center font-bold tracking-widest transition-all glow-focus-coffee"
              placeholder="ROOM CODE"
              maxLength={4}
            />
            <button 
              onClick={handleJoinRoom}
              className="px-8 py-3 bg-white/10 text-white border border-white/20 font-bold rounded-xl soft-3d-button hover:bg-white/20 transition-colors uppercase tracking-widest"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
