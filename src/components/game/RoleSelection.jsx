export default function RoleSelection({ players, mySessionId, onJoinRole, onStartGame, onKickPlayer, onRandomize, status }) {
  
  const isHost = players.find(p => p.sessionId === mySessionId)?.isHost;
  const amIReady = players.find(p => p.sessionId === mySessionId && p.role !== null);

  const RoleCard = ({ team, role, title, iconClass, colorClass, maxLimit, bgClass, shadowClass }) => {
    const occupantsData = players.filter(p => p.team === team && p.role === role);
    const isFull = occupantsData.length >= maxLimit;
    const amIHere = occupantsData.some(p => p.sessionId === mySessionId);
    
    return (
      <div className={`p-5 rounded-2xl border-4 ${colorClass} ${bgClass} ${shadowClass} flex flex-col items-center gap-3 transition-all duration-300 relative overflow-hidden ${isFull && !amIHere ? 'opacity-80 grayscale-[20%]' : ''}`}>
        
        <div className={`text-5xl ${isFull ? 'text-gray-400' : ''}`}>
          <i className={`bi ${iconClass}`}></i>
        </div>
        
        <h3 className={`font-bold text-xl text-center leading-tight tracking-wide ${isFull ? 'text-gray-300' : ''}`}>
          {title} <br/><span className="text-sm font-normal opacity-70">({occupantsData.length}/{maxLimit})</span>
        </h3>
        
        <div className="min-h-[50px] w-full flex flex-wrap justify-center content-start gap-2 mt-2 z-10">
          {occupantsData.length === 0 ? (
            <span className="italic text-gray-400 text-sm">Available</span>
          ) : (
            occupantsData.map((p, i) => (
              <span key={i} className="bg-black/60 px-3 py-1 rounded-md text-sm border border-white/20 font-bold text-green-400 shadow-sm">
                {p.name}
              </span>
            ))
          )}
        </div>

        {!isFull && !amIHere && (
          <button 
            onClick={() => onJoinRole(team, role)}
            className="mt-2 w-full py-2 rounded-xl bg-white/10 hover:bg-white/25 text-white font-bold uppercase tracking-widest transition-all soft-3d-button animate-pulse-soft hover:animate-none z-10"
          >
            {amIReady ? 'Switch Here' : 'Join'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-4 relative z-10">
      <h2 className="text-3xl font-bold mb-10 text-[#E2C792] drop-shadow-md tracking-widest uppercase">Select Your Role</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
        {/* TEAM CAT */}
        <div className="flex flex-col gap-6 p-8 bg-blue-950/40 rounded-[2rem] border-2 border-blue-500/50 shadow-[inset_0_0_40px_rgba(59,130,246,0.15)] relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl pointer-events-none"><i className="bi bi-heptagon-half"></i></div>
          <h3 className="text-3xl font-bold text-blue-400 text-center mb-2 border-b-2 border-blue-500/30 pb-4 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">TEAM CAT</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <RoleCard team="cat" role="master" title="Cat Master" iconClass="bi-incognito text-blue-300" colorClass="border-blue-500" bgClass="bg-blue-900/30" shadowClass="shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]" maxLimit={1} />
            <RoleCard team="cat" role="agent" title="Cat Agent" iconClass="bi-eyeglasses text-blue-300" colorClass="border-blue-400 border-dashed" bgClass="bg-blue-900/10" shadowClass="shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]" maxLimit={4} />
          </div>
        </div>

        {/* TEAM COFFEE */}
        <div className="flex flex-col gap-6 p-8 bg-amber-950/40 rounded-[2rem] border-2 border-amber-500/50 shadow-[inset_0_0_40px_rgba(245,158,11,0.15)] relative">
          <div className="absolute top-0 left-0 p-4 opacity-10 text-8xl pointer-events-none"><i className="bi bi-cup-hot"></i></div>
          <h3 className="text-3xl font-bold text-amber-500 text-center mb-2 border-b-2 border-amber-500/30 pb-4 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">TEAM COFFEE</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <RoleCard team="coffee" role="master" title="Head Barista" iconClass="bi-cup-hot-fill text-amber-300" colorClass="border-amber-600" bgClass="bg-amber-900/30" shadowClass="shadow-[inset_0_0_20px_rgba(245,158,11,0.3)]" maxLimit={1} />
            <RoleCard team="coffee" role="agent" title="Brewer" iconClass="bi-funnel-fill text-amber-300" colorClass="border-amber-500 border-dashed" bgClass="bg-amber-900/10" shadowClass="shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]" maxLimit={4} />
          </div>
        </div>
      </div>

      <div className="mt-16 w-full max-w-2xl bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
        <h3 className="font-bold text-xl mb-6 border-b border-white/20 pb-4 flex justify-between items-center text-gray-200">
          <span className="tracking-widest uppercase">Players in Room ({players.length})</span>
          {isHost && <span className="text-xs text-[#E2C792] font-bold border border-[#E2C792] px-3 py-1 rounded-full bg-[#E2C792]/10 uppercase tracking-widest">You are Host</span>}
        </h3>
        <ul className="space-y-3">
          {players.map((p, idx) => (
            <li key={idx} className="flex justify-between items-center text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${p.isOnline ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500'}`}></div>
                <span className={`text-lg font-semibold ${!p.isOnline ? 'line-through text-gray-500' : ''}`}>
                  {p.name} {p.isHost ? <span className="text-xs text-yellow-500 ml-1 opacity-70">(Host)</span> : ''}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs uppercase px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 ${p.team === 'cat' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : p.team === 'coffee' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/10 text-gray-400'}`}>
                  {p.team === 'cat' && <i className="bi bi-heptagon-half"></i>}
                  {p.team === 'coffee' && <i className="bi bi-cup-hot-fill"></i>}
                  {p.team ? `${p.team} ${p.role}` : 'unassigned'}
                </span>
                {isHost && p.sessionId !== mySessionId && (
                  <button onClick={() => onKickPlayer(p.sessionId)} className="text-red-400 hover:text-white hover:bg-red-500 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors border border-red-500/30">
                    Kick
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isHost && status === "waiting" && (
        <div className="flex gap-6 mt-12 mb-8">
          <button 
            onClick={onRandomize}
            className="px-8 py-4 bg-black/40 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/20 soft-3d-button uppercase tracking-widest"
          >
            Randomize Roles
          </button>
          <button 
            onClick={onStartGame}
            className="px-10 py-4 bg-[#E2C792] text-[#141E30] font-bold text-xl rounded-xl hover:bg-white transition-colors soft-3d-button uppercase tracking-widest"
          >
            START GAME
          </button>
        </div>
      )}
    </div>
  );
}
