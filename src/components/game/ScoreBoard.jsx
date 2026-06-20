export default function ScoreBoard({ board }) {
  const catLeft = board.filter(c => c.team === 'cat' && !c.isRevealed).length;
  const coffeeLeft = board.filter(c => c.team === 'coffee' && !c.isRevealed).length;

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto bg-black/30 rounded-2xl p-4 border border-white/10 mb-6">
      
      {/* Team Cat Score */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-blue-900/50">
          🐱
        </div>
        <div>
          <div className="text-xs text-blue-300 font-bold tracking-wider uppercase">Team Cat</div>
          <div className="text-3xl font-black text-white">{catLeft}</div>
        </div>
      </div>

      <div className="text-gray-500 font-bold px-4 tracking-widest text-sm">REMAINING</div>

      {/* Team Coffee Score */}
      <div className="flex items-center gap-4 text-right">
        <div>
          <div className="text-xs text-amber-500 font-bold tracking-wider uppercase">Team Coffee</div>
          <div className="text-3xl font-black text-white">{coffeeLeft}</div>
        </div>
        <div className="bg-amber-700 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-amber-900/50">
          ☕
        </div>
      </div>

    </div>
  );
}
