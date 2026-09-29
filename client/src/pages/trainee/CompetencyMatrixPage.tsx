import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AIAdviceCard } from '../../components/AIAdviceCard';
import { 
  BrainCircuit, 
  Sparkles, 
  Target, 
  TrendingUp, 
  UserCheck, 
  BookOpen, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompetencyMatrixPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    fetchCompetencyData();
    fetchAIAdvice();
  }, []);

  const fetchCompetencyData = async () => {
    try {
      const res = await api.getTraineeProfile();
      setData(res);
    } catch (err) {
      console.error('Error loading competency matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIAdvice = async () => {
    try {
      const res = await api.getAICompetencyAnalysis();
      setAiAnalysis(res);
    } catch (err) {
      console.error('Error loading AI advice:', err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Initializing Competency Engine Matrix...
      </div>
    );
  }

  const profile = data?.profile;
  const analysis = data?.competencyAnalysis;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-mono mb-2 border border-teal-500/30">
            <BrainCircuit className="w-3.5 h-3.5" /> CAPACITY CONNECT ENGINE
          </div>
          <h1 className="text-3xl font-extrabold text-white">Competency & Skill-Gap Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">
            Target Competency Goal: <strong className="text-white">{analysis?.targetCompetency || 'Technical Project Lead'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">OVERALL COMPETENCY SCORE</span>
            <div className="text-2xl font-black text-white flex items-baseline gap-1">
              {analysis?.overallCompetencyScore || 72} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent flex items-center justify-center text-xs font-mono font-bold text-teal-400">
            {analysis?.overallCompetencyScore || 72}%
          </div>
        </div>
      </div>

      {/* GEMINI AI ROADMAP SECTION */}
      <AIAdviceCard advice={aiAnalysis?.aiAdvice} loading={aiLoading} />

      {/* IDENTIFIED SKILL GAPS MATRIX */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-400" /> Skill-Gap Breakdown & Required Thresholds
            </h2>
            <p className="text-xs text-slate-400">Comparing your current skill level against target competency standard</p>
          </div>
          <span className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            {analysis?.identifiedGaps?.length || 0} Gaps Identified
          </span>
        </div>

        <div className="space-y-4">
          {analysis?.identifiedGaps?.map((gap: any, idx: number) => {
            const isHigh = gap.gapLevel === 'HIGH GAP';
            const isMed = gap.gapLevel === 'MEDIUM GAP';

            return (
              <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${isHigh ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : isMed ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'bg-teal-500/10 border border-teal-500/30 text-teal-400'}`}>
                      {gap.gapLevel}
                    </span>
                    <h3 className="text-base font-bold text-white">{gap.skill}</h3>
                  </div>

                  <div className="text-xs font-mono text-slate-400">
                    Current: <strong className="text-white">{gap.currentScore}%</strong> / Target: <strong className="text-teal-400">{gap.requiredScore}%</strong>
                  </div>
                </div>

                {/* Progress bar comparison */}
                <div className="relative w-full bg-slate-900 h-3 rounded-full overflow-hidden mb-2">
                  {/* Current Score */}
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-teal-500'}`}
                    style={{ width: `${gap.currentScore}%` }}
                  ></div>
                  {/* Target Score Marker Line */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-teal-400 shadow"
                    style={{ left: `${gap.requiredScore}%` }}
                  ></div>
                </div>

                <p className="text-xs text-slate-400">{gap.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECOMMENDED TRAINERS MATCHING SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] text-teal-400 font-mono uppercase font-semibold">AUTOMATED MATCHMAKING ALGORITHM</span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <UserCheck className="w-5 h-5 text-teal-400" /> Recommended Trainers for Your Skill Gaps
          </h2>
          <p className="text-xs text-slate-400">Matched based on domain expertise, subject mastery, and trainee ratings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis?.recommendedTrainers?.map((item: any, idx: number) => (
            <div key={idx} className="bg-slate-950 border border-teal-500/30 rounded-2xl p-6 flex flex-col justify-between hover:border-teal-500/60 transition shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-lg shadow">
                      {item.trainer?.user?.name ? item.trainer.user.name.charAt(0) : 'D'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{item.trainer?.user?.name || 'Dr. Ananya Sharma'}</h3>
                      <p className="text-xs text-slate-400">{item.trainer?.title || 'Senior Enterprise Architect'}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-teal-400 font-mono">{item.matchPercentage}%</span>
                    <span className="text-[10px] text-slate-400 block font-mono">MATCH</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 mb-4 text-xs text-slate-300">
                  <span className="text-xs font-semibold text-teal-300 block mb-1">Match Rationale:</span>
                  <p className="whitespace-pre-line text-slate-400 text-[11px] leading-relaxed">{item.why}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(item.trainer?.expertise || ['Cloud Computing', 'AWS', 'DevOps']).map((exp: string, i: number) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to="/courses"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow"
              >
                Explore Trainer's Courses <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
