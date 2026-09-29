import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  BookOpen, 
  BrainCircuit, 
  CheckCircle2, 
  Compass, 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Certificate Issued', text: 'AWS Cloud Foundations certificate generated', time: '10m ago', unread: true },
    { id: 2, title: 'Upcoming Assessment', text: 'Cloud Architecture MCQ due on Friday', time: '1h ago', unread: true },
    { id: 3, title: 'Announcement', text: 'New DevOps track available by Dr. Ananya', time: '1d ago', unread: false }
  ];

  const handleRoleSwitch = async (role: 'trainee' | 'trainer' | 'admin') => {
    await quickLogin(role);
    if (role === 'trainee') navigate('/trainee/dashboard');
    else if (role === 'trainer') navigate('/trainer/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                CAPACITY <span className="text-teal-400 font-semibold">CONNECT</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest block uppercase font-mono">
                SIH Capacity Platform
              </span>
            </div>
          </Link>

          {/* Quick Nav Links (If Logged In) */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              {user.role === 'trainee' && (
                <>
                  <Link to="/trainee/dashboard" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname === '/trainee/dashboard' ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </Link>
                  <Link to="/trainee/competencies" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname === '/trainee/competencies' ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <BrainCircuit className="w-3.5 h-3.5 text-teal-300" /> Competency Engine
                  </Link>
                  <Link to="/courses" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname.startsWith('/courses') ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <BookOpen className="w-3.5 h-3.5" /> Courses
                  </Link>
                  <Link to="/trainee/certificates" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname === '/trainee/certificates' ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <Award className="w-3.5 h-3.5" /> Certificates
                  </Link>
                </>
              )}

              {user.role === 'trainer' && (
                <>
                  <Link to="/trainer/dashboard" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname === '/trainer/dashboard' ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <LayoutDashboard className="w-3.5 h-3.5" /> Trainer Studio
                  </Link>
                  <Link to="/courses" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname.startsWith('/courses') ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <BookOpen className="w-3.5 h-3.5" /> All Courses
                  </Link>
                  <Link to="/trainer/trainees" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname === '/trainer/trainees' ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <GraduationCap className="w-3.5 h-3.5" /> Trainees Performance
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname === '/admin/dashboard' ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <LayoutDashboard className="w-3.5 h-3.5" /> Analytics Overview
                  </Link>
                  <Link to="/admin/users" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname === '/admin/users' ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <ShieldCheck className="w-3.5 h-3.5" /> Manage Users
                  </Link>
                  <Link to="/courses" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname.startsWith('/courses') ? 'bg-teal-500 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <BookOpen className="w-3.5 h-3.5" /> Catalog
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Switch Pill */}
            <div className="hidden lg:flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1 text-[11px] text-slate-300">
              <span className="px-2 font-mono text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Switch Demo:
              </span>
              <button 
                onClick={() => handleRoleSwitch('trainee')}
                className={`px-2 py-0.5 rounded transition ${user?.role === 'trainee' ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40' : 'hover:text-white'}`}
              >
                Trainee
              </button>
              <button 
                onClick={() => handleRoleSwitch('trainer')}
                className={`px-2 py-0.5 rounded transition ${user?.role === 'trainer' ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40' : 'hover:text-white'}`}
              >
                Trainer
              </button>
              <button 
                onClick={() => handleRoleSwitch('admin')}
                className={`px-2 py-0.5 rounded transition ${user?.role === 'admin' ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40' : 'hover:text-white'}`}
              >
                Admin
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition relative"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <span className="font-semibold text-xs text-white">Notifications</span>
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-mono">2 New</span>
                      </div>
                      <div className="space-y-2.5">
                        {notifications.map(n => (
                          <div key={n.id} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-semibold text-teal-300">{n.title}</span>
                              <span className="text-[10px] text-slate-400">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-0.5">{n.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 border border-slate-700/60 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-semibold leading-none text-white">{user.name}</div>
                      <div className="text-[10px] text-teal-400 capitalize font-mono mt-0.5">{user.role}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-slate-800">
                        <p className="text-xs font-semibold text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {user.role === 'trainee' && (
                          <Link 
                            to="/trainee/profile" 
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-teal-400" /> Professional Profile
                          </Link>
                        )}
                        <button 
                          onClick={() => { setShowUserMenu(false); logout(); navigate('/login'); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="bg-teal-500 hover:bg-teal-400 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-lg shadow-teal-500/25 transition">
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
