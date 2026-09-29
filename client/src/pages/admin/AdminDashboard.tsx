import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Award, 
  CheckSquare, 
  TrendingUp, 
  Sparkles, 
  BarChart2, 
  PieChart, 
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminAnalytics();
  }, []);

  const fetchAdminAnalytics = async () => {
    try {
      const res = await api.getAdminAnalytics();
      setData(res);
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading Organization Analytics Engine...
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const gaps = data?.competencyGaps || [];
  const perf = data?.trainingPerformance || {};

  const gapChartData = gaps.map((g: any) => ({
    name: g.skill,
    gap: g.gapPercentage
  }));

  const comparisonData = [
    { metric: 'Pre-Training Competency', score: perf.avgPreTrainingCompetency || 42 },
    { metric: 'Post-Training Competency', score: perf.avgPostTrainingCompetency || 84 },
    { metric: 'Avg Assessment Score', score: perf.avgAssessmentScore || 82 }
  ];

  const COLORS = ['#0d9488', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono mb-2 border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> ADMIN COMMAND CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Organization-Wide Capacity & Competency Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring of trainee skill gaps, training effectiveness, user approvals, and platform achievements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition"
          >
            <Users className="w-4 h-4 text-teal-400" /> Manage Users & Roles
          </Link>
          <Link
            to="/admin/announcements"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2 transition"
          >
            <Megaphone className="w-4 h-4" /> Publish Announcement
          </Link>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">ACTIVE TRAINEES</span>
          <div className="text-2xl font-black text-white">{metrics.activeTrainees || 2480}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">ACTIVE TRAINERS</span>
          <div className="text-2xl font-black text-cyan-400">{metrics.activeTrainers || 64}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">TOTAL COURSES</span>
          <div className="text-2xl font-black text-teal-400">{metrics.totalCourses || 28}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">ENROLLMENTS</span>
          <div className="text-2xl font-black text-purple-400">{metrics.enrollments || 5120}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">CERTIFICATES</span>
          <div className="text-2xl font-black text-emerald-400">{metrics.certificates || 1890}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">ASSESSMENTS</span>
          <div className="text-2xl font-black text-amber-400">{metrics.assessmentAttempts || 4310}</div>
        </div>

      </div>

      {/* ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Competency Gaps Distribution Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-teal-400 font-mono uppercase font-semibold">SKILL GAP METRICS</span>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <BarChart2 className="w-5 h-5 text-teal-400" /> Organization Competency Gaps (%)
            </h2>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapChartData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0, 50]} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="gap" fill="#0d9488" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Performance Impact Comparison Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-cyan-400 font-mono uppercase font-semibold">IMPACT MEASUREMENT</span>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Pre vs Post-Training Competency Score
            </h2>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ left: 10, right: 10, top: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
