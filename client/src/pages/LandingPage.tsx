import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  CheckCircle2, 
  Compass, 
  GraduationCap, 
  ArrowRight, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800">
        
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH PROBLEM STATEMENT: Digital Capacity Building & LMS Portal</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white mb-6">
              From Learning to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400">Competency.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              <strong className="text-white">CAPACITY CONNECT</strong> is an intelligent learning and capacity-building platform that connects trainees, trainers and administrators through personalized learning, competency mapping and measurable skill development.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
              >
                Start Learning <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/courses" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <BookOpen className="w-4 h-4 text-teal-400" /> Explore Courses
              </Link>
            </div>

            {/* Quick Demo Switch Alert */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Pre-loaded Demo Accounts: Trainee (Rahul), Trainer (Dr. Ananya), Admin</span>
            </div>

          </div>

          {/* Core Vision Visual Flow */}
          <div className="mt-16 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            <div className="text-center mb-8">
              <span className="text-xs font-mono text-teal-400 tracking-wider uppercase">End-to-End Competency Trajectory</span>
              <h3 className="text-xl font-bold text-white mt-1">What does this trainee need to learn, and has their competency improved?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              
              {/* Step 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center relative group hover:border-teal-500/50 transition">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">1</div>
                <h4 className="text-sm font-bold text-white mb-1">LEARN</h4>
                <p className="text-xs text-slate-400">Access recorded lectures & structured study materials</p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center relative group hover:border-teal-500/50 transition">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">2</div>
                <h4 className="text-sm font-bold text-white mb-1">ASSESS</h4>
                <p className="text-xs text-slate-400">Attempt subject MCQ assessments & earn score</p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center relative group hover:border-teal-500/50 transition">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">3</div>
                <h4 className="text-sm font-bold text-white mb-1">IDENTIFY GAPS</h4>
                <p className="text-xs text-slate-400">Gemini AI analyzes skill gaps vs target competency</p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center relative group hover:border-teal-500/50 transition">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">4</div>
                <h4 className="text-sm font-bold text-white mb-1">IMPROVE</h4>
                <p className="text-xs text-slate-400">Matched with expert trainers & targeted courses</p>
              </div>

              {/* Step 5 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center relative group hover:border-teal-500/50 transition">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">5</div>
                <h4 className="text-sm font-bold text-white mb-1">CERTIFY</h4>
                <p className="text-xs text-slate-400">Generate verified certificate & update competency score</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono text-teal-400 tracking-wider uppercase font-semibold">Built for Organizational Excellence</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Comprehensive Features Across 3 Roles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Trainee Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/40 transition shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Trainee Portal</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Build professional profile, track competency scores, attempt subject MCQs, view identified skill gaps, get matched trainers & view earned certificates.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Interactive Skill Matrix</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Gemini AI Trajectory Advice</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Verified Certificate Record</li>
              </ul>
            </div>

            {/* Trainer Studio */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/40 transition shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Trainer Studio</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Manage courses, upload recorded lectures and presentation materials, configure MCQ questionnaires with passing limits, and monitor trainee participation.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Course & Module Manager</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> MCQ Question Builder</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Trainee Score Analytics</li>
              </ul>
            </div>

            {/* Admin Command Center */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/40 transition shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Admin Command Center</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Organization-wide analytics dashboard monitoring active trainees, trainers, competency gap distribution, pre vs post training improvement, and announcements.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Competency Gap Distribution</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Role Approval Management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> System Announcements</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* PHILOSOPHY BANNER */}
      <section className="py-16 border-t border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <blockquote className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4">
            “We don't just track what people learn. We track what they become capable of.”
          </blockquote>
          <p className="text-xs text-teal-400 font-mono">
            CAPACITY CONNECT — Production MERN Stack MVP
          </p>
        </div>
      </section>

    </div>
  );
};
