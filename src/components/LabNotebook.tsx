import { LogEntry } from '../types';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function LabNotebook({ logs }: { logs: LogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-5 flex flex-col h-full shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Lab Notebook</h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar min-h-[250px] scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Actions will be recorded here.
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-3 rounded-2xl border-l-4 bg-white/5 text-sm flex gap-3 shadow-sm ${
                log.type === 'error' ? 'border-red-500 text-red-200' :
                log.type === 'warning' ? 'border-amber-500 text-amber-200' :
                log.type === 'success' ? 'border-emerald-500 text-emerald-200' :
                'border-blue-500 text-blue-200'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {log.type === 'error' && <AlertTriangle size={16} />}
                {log.type === 'warning' && <AlertTriangle size={16} />}
                {log.type === 'success' && <CheckCircle size={16} />}
                {log.type === 'info' && <Info size={16} />}
              </div>
              <div className="flex-1">
                <p className="leading-relaxed">{log.text}</p>
                <span className="text-[10px] opacity-50 mt-1.5 block font-mono">{log.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
