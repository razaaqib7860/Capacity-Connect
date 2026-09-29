import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Users, 
  BookOpen, 
  PlusCircle, 
  CheckSquare, 
  Award, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const TrainerDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainerDashboard();
  }, []);

  const fetchTrainerDashboard = async () => {
    try {
      const res = await api.getTrainerDashboard();
      setData(res);
    } catch (err) {
      console.error('Error loading trainer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading Trainer Studio Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2 border border-cyan-500/30">
            <Users className="w-3.5 h-3.5" /> TRAINER STUDIO PORTAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, <span className="text-cyan-400">{data?.trainerName || 'Dr. Ananya Sharma'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your courses, study materials, MCQ assessments, and monitor trainee performance metrics
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/trainer/courses/create"
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" /> Create Course
          </Link>
          <Link
            to="/trainer/assessments/create"
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow flex items-center gap-2 transition"
          >
            <CheckSquare className="w-4 h-4" /> Create MCQ Assessment
          </Link>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-mono mb-1">MY COURSES</div>
          <div className="text-3xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-400" /> {data?.myCoursesCount || 4}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active in catalog</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-mono mb-1">ACTIVE TRAINEES</div>
          <div className="text-3xl font-black text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-cyan-400" /> {data?.activeTrainees || 142}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Enrolled learners</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-mono mb-1">AVG TRAINEE SCORE</div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {data?.avgTraineeScore || 84}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Subject MCQs average</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-mono mb-1">COURSE COMPLETION</div>
          <div className="text-3xl font-black text-purple-400 font-mono">
            {data?.courseCompletionRate || 88}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Successful cert rate</span>
        </div>

      </div>

      {/* RECENT COURSES TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">Managed Learning Content & Courses</h2>
          <Link to="/courses" className="text-xs text-teal-400 hover:underline">
            View Catalog →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Course Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Difficulty</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(data?.recentCourses || []).map((c: any) => (
                <tr key={c._id} className="hover:bg-slate-950/60 transition">
                  <td className="p-3.5 font-bold text-white">{c.title}</td>
                  <td className="p-3.5">
                    <span className="bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-mono text-[10px]">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{c.difficulty}</td>
                  <td className="p-3.5 font-mono">{c.duration}</td>
                  <td className="p-3.5 text-right">
                    <Link to={`/courses/${c._id}`} className="text-teal-400 hover:underline font-semibold">
                      View Content →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
