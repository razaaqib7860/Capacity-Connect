import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { GraduationCap, Award, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export const TrainerTraineesPage: React.FC = () => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const res = await api.getTraineePerformance();
      setAttempts(res);
    } catch (err) {
      console.error('Error fetching trainee performance:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading Trainee Performance Matrix...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2 border border-cyan-500/30">
          <GraduationCap className="w-3.5 h-3.5" /> TRAINEE PERFORMANCE TRACKER
        </div>
        <h1 className="text-3xl font-extrabold text-white">Trainee Performance & Assessments</h1>
        <p className="text-xs text-slate-400 mt-1">Review assessment attempts, score distributions, and certified completions</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Trainee Name</th>
                <th className="p-3.5">Course Name</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Percentage</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Attempt Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No trainee assessment attempts logged yet.
                  </td>
                </tr>
              ) : (
                attempts.map((att) => (
                  <tr key={att._id} className="hover:bg-slate-950/60 transition">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                        {att.trainee?.name ? att.trainee.name.charAt(0) : 'R'}
                      </div>
                      {att.trainee?.name || 'Rahul Kumar'}
                    </td>
                    <td className="p-3.5 text-slate-300">{att.course?.title || 'AWS Foundations'}</td>
                    <td className="p-3.5 font-mono text-white font-bold">{att.score} / {att.totalMarks}</td>
                    <td className="p-3.5 font-mono text-teal-400 font-bold">{att.percentage}%</td>
                    <td className="p-3.5">
                      {att.passed ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> PASSED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold font-mono inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-400 text-[11px]">
                      {new Date(att.attemptedAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
