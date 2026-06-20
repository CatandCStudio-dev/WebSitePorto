import { useState } from 'react';

export default function GameControls({ turn, myRole, clue, markedCount = 0, onSubmitClue, onEndTurn, onConfirmMarked, onCancelMarked }) {
  const [wordInput, setWordInput] = useState('');
  const [countInput, setCountInput] = useState(1);

  const isMyTurn = turn === myRole;
  const isMasterTurn = turn && turn.includes('master');
  const isMyRoleMaster = myRole && myRole.includes('master');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wordInput.trim() || countInput < 0) return;
    onSubmitClue(wordInput.trim().toUpperCase(), parseInt(countInput));
    setWordInput('');
    setCountInput(1);
  };

  // Extract nicely formatted team/role name
  const formatTurnName = (t) => {
    if (!t) return 'someone';
    return t.replace('_', ' ').toUpperCase();
  };

  return (
    <div className={`w-full max-w-3xl mx-auto mt-6 border border-white/10 rounded-[2rem] p-8 relative transition-all duration-700 shadow-xl backdrop-blur-md z-10
      ${!isMyTurn ? 'animate-breathing' : 'bg-black/60'}
    `}>
      
      {/* Target marking UI (Floating slightly above controls) */}
      {markedCount > 0 && isMyTurn && !isMyRoleMaster && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-yellow-500/20 border-2 border-yellow-500 rounded-2xl px-6 py-4 shadow-[0_0_30px_rgba(250,204,21,0.3)] backdrop-blur-xl flex items-center gap-6 animate-bounce z-50">
          <span className="font-bold text-yellow-400 text-xl tracking-wider uppercase drop-shadow-md">
            {markedCount} Card{markedCount > 1 ? 's' : ''} Selected
          </span>
          <div className="flex gap-3">
            <button 
              onClick={onConfirmMarked}
              className="bg-yellow-500 text-black px-6 py-2 rounded-xl font-black hover:bg-white transition-all soft-3d-button tracking-widest uppercase"
            >
              Confirm
            </button>
            <button 
              onClick={onCancelMarked}
              className="bg-red-500/20 text-red-400 px-6 py-2 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-colors border border-red-500/50 tracking-widest uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Display Current Turn / Clue Status */}
      <div className="text-center mb-8">
        <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-widest drop-shadow-md transition-colors duration-500
          ${isMyTurn ? 'text-green-400' : 'text-[#E2C792]/80'}
        `}>
          {isMyTurn ? "IT'S YOUR TURN!" : `WAITING FOR ${formatTurnName(turn)}...`}
        </h3>
        
        {clue && clue.word && (
          <div className="mt-6 inline-flex items-center gap-4 bg-black/60 px-8 py-4 rounded-full border-2 border-[#E2C792]/30 shadow-[0_0_20px_rgba(226,199,146,0.15)]">
            <span className="text-sm md:text-base text-gray-400 uppercase tracking-widest font-semibold">CLUE:</span>
            <span className="text-3xl md:text-4xl font-black text-[#E2C792] drop-shadow-md">{clue.word}</span>
            <span className="bg-[#E2C792] text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-xl md:text-2xl shadow-inner">
              {clue.count === 0 ? '∞' : clue.count}
            </span>
          </div>
        )}
      </div>

      {/* Spymaster Controls */}
      {isMyTurn && isMyRoleMaster && (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mt-8">
          <input 
            type="text" 
            placeholder="TYPE ONE WORD CLUE..."
            value={wordInput}
            maxLength={30}
            onChange={(e) => setWordInput(e.target.value)}
            className="flex-1 bg-black/50 border-2 border-white/10 rounded-2xl px-6 py-4 text-white text-lg font-bold tracking-widest uppercase transition-all glow-focus-coffee"
            required
          />
          <select 
            value={countInput} 
            onChange={(e) => setCountInput(e.target.value)}
            className="bg-black/50 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-lg cursor-pointer hover:bg-black/70 transition-colors"
          >
            {[...Array(9)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
            <option value="0">Zero</option>
            <option value="99">Unlimited</option>
          </select>
          <button 
            type="submit"
            className="bg-[#E2C792] text-black font-black text-lg tracking-widest uppercase px-10 py-4 rounded-2xl hover:bg-white soft-3d-button"
          >
            GIVE CLUE
          </button>
        </form>
      )}

      {/* Operative Controls */}
      {isMyTurn && !isMyRoleMaster && clue && clue.word && markedCount === 0 && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={onEndTurn}
            className="bg-red-500/10 text-red-400 border-2 border-red-500/50 font-bold text-lg tracking-widest uppercase px-10 py-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all soft-3d-button shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            END TURN GUESSING
          </button>
        </div>
      )}

    </div>
  );
}
