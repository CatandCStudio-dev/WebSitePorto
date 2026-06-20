import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbCnc } from '../../firebase';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';

import RoleSelection from '../../components/game/RoleSelection';
import GameBoard from '../../components/game/GameBoard';
import ScoreBoard from '../../components/game/ScoreBoard';
import GameControls from '../../components/game/GameControls';

// Custom Toast Component
const Toast = ({ message, visible }) => (
  <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-[#E2C792] text-black font-bold px-6 py-3 rounded-full shadow-2xl transition-all duration-500 z-50 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
    {message}
  </div>
);

export default function GameRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  
  const [myNickname, setMyNickname] = useState('');
  const [mySessionId, setMySessionId] = useState('');
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const prevTurnRef = useRef(null);

  useEffect(() => {
    const savedName = sessionStorage.getItem("cn_nickname");
    const savedSession = sessionStorage.getItem("cn_sessionId");
    
    if (!savedName || !savedSession) {
      alert("Please set a nickname first!");
      navigate('/games/codenames');
      return;
    }
    setMyNickname(savedName);
    setMySessionId(savedSession);

    const gameRef = doc(dbCnc, "codenames_games", roomId);
    
    // Connection handling
    const setOnlineStatus = async (isOnline) => {
      const snap = await getDoc(gameRef);
      if (snap.exists()) {
        const p = snap.data().players;
        const idx = p.findIndex(x => x.sessionId === savedSession);
        if (idx !== -1) {
          p[idx].isOnline = isOnline;
          await updateDoc(gameRef, { players: p });
        }
      }
    };

    const unsubscribe = onSnapshot(gameRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Toast Notification for turn change
        if (prevTurnRef.current && prevTurnRef.current !== data.turn && data.status === 'playing' && !data.winner) {
          const teamColor = data.turn.includes('cat') ? 'Team Cat' : 'Team Coffee';
          const roleName = data.turn.includes('master') ? 'Master' : 'Agent';
          setToastMsg(`It's ${teamColor} ${roleName}'s turn!`);
          setToastVisible(true);
          setTimeout(() => setToastVisible(false), 3000);
        }
        prevTurnRef.current = data.turn;

        setGameState(data);

        // Auto-join or update online status
        const existingPlayer = data.players.find(p => p.sessionId === savedSession);
        if (!existingPlayer) {
          updateDoc(gameRef, {
            players: [...data.players, { sessionId: savedSession, name: savedName, role: null, team: null, isHost: data.players.length === 0, isOnline: true }]
          });
        } else if (!existingPlayer.isOnline) {
          // If marked offline but we are here, mark online
          const newPlayers = data.players.map(p => p.sessionId === savedSession ? { ...p, isOnline: true } : p);
          updateDoc(gameRef, { players: newPlayers });
        }
      } else {
        alert("Room not found!");
        navigate('/games/codenames');
      }
    });

    // Handle tab close / refresh
    const handleBeforeUnload = () => {
      setOnlineStatus(false);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setOnlineStatus(false);
    };
  }, [roomId, navigate]);

  if (!gameState) return <div className="min-h-screen bg-[#141E30] text-white flex items-center justify-center">Loading game state...</div>;

  const gameRef = doc(dbCnc, "codenames_games", roomId);
  const me = gameState.players.find(p => p.sessionId === mySessionId);
  const myRole = me && me.team && me.role ? `${me.team}_${me.role}` : null;
  const isHost = me?.isHost;

  // --- HOST CONTROLS ---
  const handleKickPlayer = async (targetSessionId) => {
    if (!isHost) return;
    const updatedPlayers = gameState.players.filter(p => p.sessionId !== targetSessionId);
    await updateDoc(gameRef, { players: updatedPlayers });
  };

  const handleRandomizeRoles = async () => {
    if (!isHost) return;
    const availableSlots = [
      { team: 'cat', role: 'master' },
      { team: 'coffee', role: 'master' },
      ...Array(4).fill({ team: 'cat', role: 'agent' }),
      ...Array(4).fill({ team: 'coffee', role: 'agent' })
    ];
    
    // Remove slots already taken by readied players
    const takenSlots = gameState.players.filter(p => p.team && p.role);
    takenSlots.forEach(p => {
      const idx = availableSlots.findIndex(s => s.team === p.team && s.role === p.role);
      if (idx !== -1) availableSlots.splice(idx, 1);
    });

    // Shuffle remaining slots
    const shuffledSlots = availableSlots.sort(() => Math.random() - 0.5);
    
    const updatedPlayers = gameState.players.map(p => {
      if (!p.team || !p.role) {
        const slot = shuffledSlots.pop();
        if (slot) return { ...p, team: slot.team, role: slot.role };
      }
      return p;
    });
    await updateDoc(gameRef, { players: updatedPlayers });
  };

  const handleBackToLobby = async () => {
    if (!isHost) return;
    // Reset board and keep players but maybe reset roles? No, let them keep roles if they want.
    // Resetting board is complex, usually we just set status to waiting. The board needs to be regenerated though.
    // We will just change status, the Lobby component is responsible for board generation.
    // Actually, we must regenerate the board here.
    import('../../utils/gameLogic').then(async ({ generateBoard }) => {
      const startingTeam = Math.random() > 0.5 ? "cat" : "coffee";
      const initialBoard = generateBoard(startingTeam);
      await updateDoc(gameRef, { 
        status: 'waiting', 
        winner: null, 
        board: initialBoard, 
        turn: `${startingTeam}_master`,
        clue: { word: "", count: 0 },
        markedCards: []
      });
    });
  };

  // --- PLAYER ACTIONS ---
  const handleJoinRole = async (team, role) => {
    const updatedPlayers = gameState.players.map(p => 
      p.sessionId === mySessionId ? { ...p, team, role } : p
    );
    await updateDoc(gameRef, { players: updatedPlayers });
  };

  const handleStartGame = async () => {
    await updateDoc(gameRef, { status: 'playing', markedCards: [] });
  };

  const handleCardClick = async (card) => {
    if (gameState.status !== 'playing' || gameState.winner) return;
    if (gameState.turn !== myRole) return; 
    if (myRole.includes('master')) return; 

    // Marking System: Just add/remove from markedCards
    let newMarked = [...(gameState.markedCards || [])];
    if (newMarked.includes(card.id)) {
      newMarked = newMarked.filter(id => id !== card.id);
    } else {
      newMarked.push(card.id);
    }

    await updateDoc(gameRef, { markedCards: newMarked });
  };

  const handleConfirmMarked = async () => {
    if (!gameState.markedCards || gameState.markedCards.length === 0) return;
    
    const newBoard = [...gameState.board];
    let newTurn = gameState.turn;
    let newWinner = gameState.winner;
    const currentTeam = me.team; 
    const enemyTeam = currentTeam === 'cat' ? 'coffee' : 'cat';
    let turnEnded = false;

    // Process all marked cards (in standard rules, you pick one by one, but for this custom rule we process all selected at once)
    // Wait, standard rules say if you hit an enemy/neutral, turn ends immediately and you can't guess more.
    // If they marked multiple, we evaluate them. If ANY of them is assassin, game over.
    // If ANY of them is enemy/neutral, turn ends.
    
    for (let id of gameState.markedCards) {
      const cardIndex = newBoard.findIndex(c => c.id === id);
      const card = newBoard[cardIndex];
      card.isRevealed = true;

      if (card.team === 'assassin') {
        newWinner = enemyTeam;
        turnEnded = true;
      } else if (card.team !== currentTeam) {
        newTurn = `${enemyTeam}_master`;
        turnEnded = true;
      }
    }

    // Check win condition
    const catLeft = newBoard.filter(c => c.team === 'cat' && !c.isRevealed).length;
    const coffeeLeft = newBoard.filter(c => c.team === 'coffee' && !c.isRevealed).length;
    if (catLeft === 0) newWinner = 'cat';
    if (coffeeLeft === 0) newWinner = 'coffee';

    const newClue = newTurn !== gameState.turn ? { word: "", count: 0 } : gameState.clue;

    await updateDoc(gameRef, { 
      board: newBoard, 
      turn: newTurn, 
      winner: newWinner,
      clue: newClue,
      markedCards: []
    });
  };

  const handleCancelMarked = async () => {
    await updateDoc(gameRef, { markedCards: [] });
  };

  const handleSubmitClue = async (word, count) => {
    const nextTurn = gameState.turn.replace('master', 'agent');
    await updateDoc(gameRef, {
      clue: { word, count },
      turn: nextTurn
    });
  };

  const handleEndTurn = async () => {
    const enemyTeam = me.team === 'cat' ? 'coffee' : 'cat';
    await updateDoc(gameRef, {
      turn: `${enemyTeam}_master`,
      clue: { word: "", count: 0 },
      markedCards: []
    });
  };

  return (
    <div className="min-h-screen bg-[#141E30] text-white p-6 font-sans">
      <Toast message={toastMsg} visible={toastVisible} />
      
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
          <h1 className="text-2xl font-bold text-[#E2C792]">Codenames: Cat vs Coffee</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {myNickname}
            </span>
            <div className="bg-white/10 px-4 py-2 rounded-lg font-mono text-xl tracking-widest border border-white/20">
              ROOM: {roomId}
            </div>
          </div>
        </header>

        {gameState.winner && (
          <div className={`w-full py-6 flex flex-col items-center justify-center rounded-2xl mb-8 border-4 uppercase tracking-widest
            ${gameState.winner === 'cat' ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'bg-amber-600/20 text-amber-500 border-amber-600'}
          `}>
            <div className="text-4xl font-black mb-4 animate-bounce">TEAM {gameState.winner} WINS!</div>
            {isHost && (
              <button 
                onClick={handleBackToLobby}
                className="mt-4 px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                BACK TO LOBBY
              </button>
            )}
          </div>
        )}

        {gameState.status === 'waiting' ? (
          <RoleSelection 
            players={gameState.players} 
            mySessionId={mySessionId} 
            onJoinRole={handleJoinRole} 
            onStartGame={handleStartGame}
            onKickPlayer={handleKickPlayer}
            onRandomize={handleRandomizeRoles}
            status={gameState.status}
          />
        ) : (
          <div className="flex flex-col">
            {myRole && !gameState.winner && (
              <div className="text-center mb-6">
                <span className="bg-white/10 px-6 py-2 rounded-full border border-white/20 text-lg tracking-widest text-[#E2C792]">
                  YOUR ROLE: <strong className="uppercase">{myRole.replace('_', ' ')}</strong>
                </span>
              </div>
            )}
            <ScoreBoard board={gameState.board} />
            <GameBoard 
              board={gameState.board} 
              markedCards={gameState.markedCards || []}
              onCardClick={handleCardClick} 
              myRole={myRole}
            />
            {!gameState.winner && (
              <GameControls 
                turn={gameState.turn}
                myRole={myRole}
                clue={gameState.clue}
                markedCount={(gameState.markedCards || []).length}
                onSubmitClue={handleSubmitClue}
                onEndTurn={handleEndTurn}
                onConfirmMarked={handleConfirmMarked}
                onCancelMarked={handleCancelMarked}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
