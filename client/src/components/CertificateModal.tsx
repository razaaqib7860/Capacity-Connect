import React from 'react';
import { Award, CheckCircle2, Download, Printer, ShieldCheck, X } from 'lucide-react';

interface CertificateModalProps {
  certificate: {
    certificateNumber: string;
    traineeName: string;
    courseTitle: string;
    trainerName: string;
    score: number;
    percentage: number;
    issueDate?: string;
    status?: string;
  } | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = certificate.issueDate 
    ? new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
        
        {/* Modal Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs">
            <ShieldCheck className="w-4 h-4" /> Official Verified Digital Certificate
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-8 sm:p-12 bg-gradient-to-b from-slate-900 to-slate-950 text-center relative overflow-hidden" id="printable-certificate">
          
          {/* Subtle Decorative Borders */}
          <div className="absolute inset-4 border-2 border-teal-500/20 rounded-xl pointer-events-none"></div>
          <div className="absolute inset-6 border border-teal-500/10 rounded-lg pointer-events-none"></div>

          {/* Header Seal */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-1 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-teal-300">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <span className="text-xs font-mono tracking-widest text-teal-400 uppercase font-semibold block mb-1">
            CAPACITY CONNECT CERTIFICATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Certificate of Competency Mastery
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            This certifies that the recipient has successfully completed the rigorous training program and passed the verified subject assessment.
          </p>

          <div className="py-4 border-y border-slate-800 my-6 max-w-lg mx-auto">
            <span className="text-xs text-slate-400 block mb-1 uppercase font-mono tracking-wider">This is awarded to</span>
            <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-white">
              {certificate.traineeName}
            </h3>
          </div>

          <div className="mb-8 max-w-xl mx-auto">
            <p className="text-xs text-slate-400 mb-1">For demonstrated excellence and competency acquisition in</p>
            <h4 className="text-lg font-bold text-white mb-2">{certificate.courseTitle}</h4>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Score Achieved: {certificate.score} / 100 ({certificate.percentage}%)
            </div>
          </div>

          {/* Signatures & Verification Info */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800/80 text-left max-w-lg mx-auto">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">CERTIFIED TRAINER</span>
              <p className="text-xs font-semibold text-white mt-1">{certificate.trainerName}</p>
              <p className="text-[10px] text-slate-400">Senior Domain Specialist</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">ISSUE DATE</span>
              <p className="text-xs font-semibold text-white mt-1">{formattedDate}</p>
              <p className="text-[10px] text-teal-400 font-mono mt-0.5">ID: {certificate.certificateNumber}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
