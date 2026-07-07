import { motion } from 'motion/react';

export function TestTube({ contents, color, isShaken }: { contents: string[], color: string, isShaken: boolean }) {
  const height = Math.min(contents.length * 40, 85);
  
  return (
    <div className="relative w-32 h-64 flex justify-center pb-4">
      <motion.div 
        animate={isShaken ? { x: [-10, 10, -10, 10, -5, 5, 0], rotate: [-5, 5, -5, 5, -2, 2, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="relative w-16 h-full border-[3px] border-white/20 rounded-b-full bg-white/5 flex flex-col justify-end overflow-hidden z-10 backdrop-blur-sm"
        style={{ boxShadow: 'inset -5px -5px 15px rgba(255,255,255,0.05)' }}
      >
        <motion.div 
          className="w-full relative"
          animate={{ height: `${height}%`, backgroundColor: color }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Surface line */}
          {height > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 rounded-[50%] -mt-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.2)]"></div>
          )}
        </motion.div>
      </motion.div>
      <div className="absolute top-0 w-20 h-3 border-[3px] border-white/20 rounded-[50%] z-20 -mt-1.5 shadow-sm"></div>
      
      {/* Stand Base */}
      <div className="absolute bottom-0 w-32 h-3 bg-white/10 rounded-full z-0 blur-[1px]"></div>
    </div>
  );
}
