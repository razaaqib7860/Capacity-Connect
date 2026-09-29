import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Sparkles, Lock, Mail, ArrowRight, UserCheck, ShieldCheck, GraduationCap, Users } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/trainee/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'trainee' | 'trainer' | 'admin') => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(role);
      if (role === 'trainee') navigate('/trainee/dashboard');
      else if (role === 'trainer') navigate('/trainer/dashboard');
      else navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center mb-3">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to CAPACITY CONNECT</h2>
          <p className="text-xs text-slate-400 mt-1">Access your role portal, competency engine & learning dashboard</p>
        </div>

        {/* ONE-CLICK DEMO LOGIN BUTTONS */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-teal-400 uppercase font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> SIH 1-Click Demo Accounts
            </span>
            <span className="text-[10px] text-slate-400 font-mono">No password required</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('trainee')}
              disabled={loading}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-teal-300">
                <GraduationCap className="w-3.5 h-3.5" /> Trainee
              </div>
              <span className="text-[10px] text-slate-400 block truncate">Rahul Kumar</span>
            </button>

            <button
              onClick={() => handleDemoLogin('trainer')}
              disabled={loading}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-300">
                <Users className="w-3.5 h-3.5" /> Trainer
              </div>
              <span className="text-[10px] text-slate-400 block truncate">Dr. Ananya</span>
            </button>

            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </div>
              <span className="text-[10px] text-slate-400 block truncate">System Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@capacityconnect.in"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};
