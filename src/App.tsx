import { useState } from 'react';
import { TestTube } from './components/TestTube';
import { ReagentBottle } from './components/ReagentBottle';
import { LabNotebook } from './components/LabNotebook';
import { EXPERIMENTS, REAGENTS, LogEntry, Experiment } from './types';
import { Shield, ShieldAlert, FlaskConical, RotateCcw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasGoggles, setHasGoggles] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  
  const [tubeContents, setTubeContents] = useState<string[]>([]);
  const [isReacted, setIsReacted] = useState(false);
  const [isShaken, setIsShaken] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random().toString(),
      text,
      type,
      time: new Date().toLocaleTimeString()
    }]);
  };

  const handleStart = () => {
    setShowWelcome(false);
    setHasGoggles(true);
    addLog("Template lab opened. Goggles on.", "success");
  };

  const toggleGoggles = () => {
    const next = !hasGoggles;
    setHasGoggles(next);
    addLog(next ? "Goggles are now on." : "Goggles are now off. Use caution.", next ? "success" : "warning");
  };

  const selectExperiment = (exp: Experiment) => {
    setSelectedExperiment(exp);
    setTubeContents([]);
    setIsReacted(false);
    addLog(`Selected ${exp.name}.`, "info");
  };

  const emptyTube = () => {
    setTubeContents([]);
    setIsReacted(false);
    addLog("Emptied test tube.", "info");
  };

  const addReagent = (reagentId: string) => {
    if (!hasGoggles) {
      addLog("Safety violation: Handle reagents with goggles on!", "error");
      return;
    }
    
    if (tubeContents.length >= 2) {
      addLog("Test tube is full. Empty it first.", "warning");
      return;
    }

    const reagent = REAGENTS[reagentId];
    
    // Prevent adding two samples or two halogens
    if (tubeContents.length === 1) {
      const existing = REAGENTS[tubeContents[0]];
      if (existing.type === reagent.type) {
        addLog(`Cannot add another ${reagent.type}.`, "warning");
        return;
      }
    }

    setTubeContents(prev => [...prev, reagentId]);
    setIsReacted(false);
    addLog(`Added ${reagent.label}.`, "info");
  };

  const shakeTube = () => {
    if (tubeContents.length === 0) {
      addLog("Nothing to shake.", "warning");
      return;
    }

    setIsShaken(true);
    setTimeout(() => setIsShaken(false), 600);

    // Check for reaction
    if (tubeContents.length === 2) {
      const hasCyclohexene = tubeContents.includes('cyclohexene');
      const hasHalogen = tubeContents.includes('bromine') || tubeContents.includes('iodine');
      
      if (hasCyclohexene && hasHalogen) {
        // Alkene reacts with halogen
        setTimeout(() => {
          setIsReacted(true);
          const halogen = tubeContents.includes('bromine') ? 'Bromine' : 'Iodine';
          addLog(`Reaction occurred! The double bond in cyclohexene broke to add ${halogen}. The solution decolorized.`, "success");
        }, 800);
      } else if (tubeContents.includes('hexane') && hasHalogen) {
        // Alkane does not react without UV light
        setTimeout(() => {
          addLog("No reaction. Saturated hydrocarbons (alkanes) do not react with halogens in the dark.", "info");
        }, 800);
      }
    } else {
      addLog("Shook the tube.", "info");
    }
  };

  // Determine current color
  let currentColor = 'transparent';
  if (tubeContents.length > 0) {
    if (isReacted) {
      currentColor = 'rgba(255,255,255,0.15)'; // Decolorized
    } else {
      const halogen = tubeContents.find(id => REAGENTS[id].type === 'halogen');
      if (halogen) {
        currentColor = REAGENTS[halogen].color;
      } else {
        currentColor = REAGENTS[tubeContents[0]].color;
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 font-sans selection:bg-blue-500/30">
      
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <div className="bg-slate-900 border border-blue-500/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-blue-900/20">
              <div className="text-center mb-8">
                <div className="text-6xl mb-6">🧪</div>
                <h1 className="text-3xl font-black mb-3">Hydrocarbon Lab</h1>
                <p className="text-slate-400">Test for saturated vs unsaturated hydrocarbons using halogenation experiments.</p>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-4 mb-8">
                <ShieldAlert className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-200 text-sm uppercase tracking-wider mb-1">Safety First</h3>
                  <p className="text-sm text-red-300/80 leading-relaxed">Bromine and Iodine are toxic and corrosive. Safety goggles are required at all times in this laboratory.</p>
                </div>
              </div>

              <button 
                onClick={handleStart}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
              >
                Enter Virtual Lab
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <header className="bg-slate-900/60 border border-white/10 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
              <FlaskConical className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Halogenation Simulator
              </h1>
              <p className="text-sm text-slate-400 font-medium">Saturated vs Unsaturated Hydrocarbons</p>
            </div>
          </div>

          <button 
            onClick={toggleGoggles}
            className={`px-5 py-2.5 rounded-full font-bold flex items-center gap-2 text-sm border transition-all shadow-sm ${
              hasGoggles 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <Shield size={16} />
            {hasGoggles ? 'Goggles ON' : 'Goggles OFF'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
              <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Experiments</h2>
              <div className="space-y-3">
                {EXPERIMENTS.map(exp => (
                  <button
                    key={exp.id}
                    onClick={() => selectExperiment(exp)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedExperiment?.id === exp.id
                        ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-slate-200">{exp.name}</div>
                    <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">{exp.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedExperiment && (
              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
                <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Procedure</h2>
                <ol className="space-y-4 text-sm text-slate-300 list-decimal pl-4">
                  {selectedExperiment.steps.map((step, i) => (
                    <li key={i} className="pl-2 leading-relaxed marker:text-blue-500 marker:font-bold">{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-9 bg-slate-900/60 border border-white/10 rounded-3xl p-6 lg:p-8 backdrop-blur-xl flex flex-col min-h-[600px]">
            
            {!selectedExperiment ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <FlaskConical size={64} className="mb-6 text-slate-400" />
                <h2 className="text-2xl font-bold mb-3">Select an experiment to begin</h2>
                <p className="max-w-md text-sm leading-relaxed text-slate-400">Choose from the available tests in the sidebar to load the required reagents and procedure.</p>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Reagents & Bench */}
                <div className="md:col-span-7 space-y-8 flex flex-col">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reagents Shelf</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-950/50 border border-white/5 shadow-inner">
                      {Object.values(REAGENTS).map(reagent => {
                        // Only show relevant halogen based on experiment
                        if (reagent.type === 'halogen') {
                          if (selectedExperiment.id === 'bromine_test' && reagent.id !== 'bromine') return null;
                          if (selectedExperiment.id === 'iodine_test' && reagent.id !== 'iodine') return null;
                        }
                        
                        return (
                          <ReagentBottle 
                            key={reagent.id} 
                            reagent={reagent} 
                            onClick={() => addReagent(reagent.id)}
                            disabled={!hasGoggles || tubeContents.length >= 2}
                          />
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-950/50 rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center shadow-inner relative">
                    
                    <div className="absolute top-6 w-full px-6 flex justify-center gap-3">
                      <button 
                        onClick={shakeTube}
                        disabled={tubeContents.length === 0}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full text-sm font-bold border border-white/10 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                      >
                        <RotateCcw size={16} />
                        Shake Tube
                      </button>
                      <button 
                        onClick={emptyTube}
                        disabled={tubeContents.length === 0}
                        className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full text-sm font-bold border border-red-500/20 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                      >
                        <Trash2 size={16} />
                        Empty
                      </button>
                    </div>

                    <div className="mt-12">
                      <TestTube contents={tubeContents} color={currentColor} isShaken={isShaken} />
                    </div>
                  </div>
                </div>

                {/* Notebook */}
                <div className="md:col-span-5 h-[400px] md:h-auto">
                  <LabNotebook logs={logs} />
                </div>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
