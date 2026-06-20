export default function GameBoard({ board, markedCards = [], onCardClick, myRole }) {
  // Master sees all colors. Agents only see revealed colors, unrevealed are gray.
  const isMaster = myRole === "cat_master" || myRole === "coffee_master";

  const getCardColor = (card) => {
    if (card.isRevealed || isMaster) {
      switch (card.team) {
        case 'cat': return 'bg-blue-600 text-white shadow-blue-900/50'; // Team Cat
        case 'coffee': return 'bg-amber-700 text-white shadow-amber-900/50'; // Team Coffee
        case 'assassin': return 'bg-black text-red-500 shadow-black/80';
        case 'neutral': return 'bg-[#E2C792] text-black shadow-amber-900/20'; // Sand/Neutral
        default: return 'bg-gray-400';
      }
    }
    // Unrevealed state for Agents
    return 'bg-slate-200 text-slate-800 hover:bg-white shadow-slate-900/30';
  };

  return (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 w-full max-w-5xl mx-auto my-8 p-4">
      {board.map((card, index) => {
        const colorClass = getCardColor(card);
        const isClickable = !card.isRevealed && !isMaster;
        const isMarked = markedCards.includes(card.id);

        return (
          <div 
            key={index} 
            onClick={() => isClickable && onCardClick(card)}
            className={`
              tactile-card aspect-[4/3] flex flex-col items-center justify-center
              transition-all duration-300 select-none
              ${colorClass}
              ${isClickable ? 'cursor-pointer hover:scale-[1.03] hover:-translate-y-1' : ''}
              ${card.isRevealed && !isMaster ? 'ring-4 ring-white/50 scale-95 opacity-90' : ''}
              ${card.isRevealed && isMaster ? 'opacity-40 grayscale-[60%]' : ''}
              ${isMarked && !card.isRevealed ? 'ring-4 ring-yellow-400 scale-[0.98] shadow-[0_0_20px_rgba(250,204,21,0.6)] z-10' : ''}
            `}
          >
            <span className={`z-10 relative text-lg md:text-2xl font-black uppercase tracking-wider text-center px-2 drop-shadow-sm ${!card.isRevealed && !isMaster ? 'text-slate-700' : ''}`}>
              {card.word}
            </span>
            
            {/* Show an indicator for masters if the card was picked */}
            {card.isRevealed && isMaster && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
                <i className="bi bi-x-lg text-white/50 text-4xl"></i>
              </div>
            )}

            {/* Show target icon for marked cards */}
            {isMarked && !card.isRevealed && (
              <div className="absolute top-2 right-2 text-yellow-400 animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,1)] text-xl">
                <i className="bi bi-crosshair"></i>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
