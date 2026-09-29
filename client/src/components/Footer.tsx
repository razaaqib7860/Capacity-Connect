import React from 'react';
import { BrainCircuit, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span>CAPACITY CONNECT</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Smart Digital Capacity Building & Competency Management Engine for Government Organizations, Enterprise Teams, and Trainees.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-teal-400 font-mono">
            <ShieldCheck className="w-4 h-4" /> Smart India Hackathon (SIH) Edition
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Core Engine</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/trainee/competencies" className="hover:text-teal-400 transition">Competency Matrix</a></li>
            <li><a href="/trainee/competencies" className="hover:text-teal-400 transition">Skill Gap Identifier</a></li>
            <li><a href="/courses" className="hover:text-teal-400 transition">Course Catalog</a></li>
            <li><a href="/trainee/competencies" className="hover:text-teal-400 transition">Trainer Matchmaking</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">User Roles</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/trainee/dashboard" className="hover:text-teal-400 transition">Trainee Portal</a></li>
            <li><a href="/trainer/dashboard" className="hover:text-teal-400 transition">Trainer Studio</a></li>
            <li><a href="/admin/dashboard" className="hover:text-teal-400 transition">Admin Analytics</a></li>
            <li><a href="/trainee/certificates" className="hover:text-teal-400 transition">Digital Verification</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Platform Philosophy</h4>
          <p className="text-xs text-slate-400 italic mb-3">
            "We don't just track what people learn. We track what they become capable of."
          </p>
          <div className="text-[11px] text-slate-500">
            Powered by Node.js, Express, MongoDB, React, Tailwind CSS & Gemini AI.
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 CAPACITY CONNECT. Built for SIH Digital Capacity Building Problem Statement.</p>
        <p className="flex items-center gap-1 mt-2 md:mt-0">
          Crafted for Enterprise Competency Excellence
        </p>
      </div>
    </footer>
  );
};
