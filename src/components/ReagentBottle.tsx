import { Reagent } from '../types';

export function ReagentBottle({ 
  reagent, 
  onClick, 
  disabled 
}: { 
  reagent: Reagent, 
  onClick: () => void,
  disabled: boolean
}) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-105 active:scale-95'}`}
    >
      <div className="w-10 h-14 rounded-t-lg rounded-b-xl border-[2px] border-white/20 relative overflow-hidden flex items-end shadow-inner">
        <div className="w-full h-3/4 relative" style={{ backgroundColor: reagent.color }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-[50%] -mt-[2px]"></div>
        </div>
        {/* Bottle cap */}
        <div className="absolute top-0 left-1 right-1 h-3 bg-slate-700 rounded-sm border border-slate-600"></div>
      </div>
      <span className="text-[11px] text-blue-100 text-center font-medium leading-tight">{reagent.label}</span>
    </button>
  );
}
