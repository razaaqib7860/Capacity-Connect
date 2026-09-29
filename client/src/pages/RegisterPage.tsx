import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Mail, Lock, User, ArrowRight, ShieldCheck, GraduationCap, Users } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'trainee' | 'trainer'>('trainee');
  const [headline, setHeadline] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, role, headline, organization });
      if (role === 'trainee') navigate('/trainee/dashboard');
      else navigate('/trainer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-md w-full space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center mb-3">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join CAPACITY CONNECT Platform</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('trainee')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${role === 'trainee' ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                <GraduationCap className="w-4 h-4" /> Trainee Learner
              </button>
              <button
                type="button"
                onClick={() => setRole('trainer')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${role === 'trainer' ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                <Users className="w-4 h-4" /> Course Trainer
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Kumar"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@domain.com"
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Organization / Department</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Ministry of Skill Development"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Already registered?{' '}
          <Link to="/login" className="text-teal-400 font-semibold hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};
