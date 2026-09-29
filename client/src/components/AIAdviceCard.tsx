import React from 'react';
import { Sparkles, Target, Compass, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

interface AIAdviceProps {
  advice: {
    summary: string;
    priorityFocusArea: string;
    learningRoadmap: Array<{
      phase: string;
      objective: string;
      recommendedAction: string;
    }>;
    expectedOutcome: string;
  } | null;
  loading?: boolean;
}

export const AIAdviceCard: React.FC<AIAdviceProps> = ({ advice, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-6 shadow-xl animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-teal-400 animate-spin" />
          <span className="text-xs font-mono text-teal-400">Gemini AI Competency Analysis Running...</span>
        </div>
        <div className="h-4 bg-slate-800 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-800 rounded w-1/2"></div>
      </div>
    );
  }

  if (!advice) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-teal-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Gemini AI Trajectory Analysis
            </h3>
            <span className="text-[10px] text-teal-400 font-mono">Structured JSON Output Engine</span>
          </div>
        </div>
        <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-full border border-teal-500/30 font-mono">
          Priority: {advice.priorityFocusArea}
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-5">
        {advice.summary}
      </p>

      {/* Structured Roadmap Phases */}
      <div className="space-y-3 mb-5">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-teal-400" /> Recommended Learning Trajectory
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {advice.learningRoadmap?.map((item, idx) => (
            <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 hover:border-teal-500/40 transition">
              <span className="text-[10px] text-teal-400 font-mono font-semibold block mb-1">{item.phase}</span>
              <p className="text-xs font-bold text-white mb-1">{item.objective}</p>
              <p className="text-[11px] text-slate-400 flex items-start gap-1">
                <ArrowRight className="w-3 h-3 text-teal-400 shrink-0 mt-0.5" />
                {item.recommendedAction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Outcome Banner */}
      <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-3 flex items-center gap-3 text-xs text-teal-200">
        <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
        <div>
          <span className="font-bold text-white block text-[11px]">Expected Competency Impact</span>
          <p className="text-slate-300 text-[11px]">{advice.expectedOutcome}</p>
        </div>
      </div>

    </div>
  );
};
