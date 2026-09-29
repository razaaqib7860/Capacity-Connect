import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CertificateModal } from '../../components/CertificateModal';
import { Award, ShieldCheck, Printer, CheckCircle2, Sparkles } from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.getMyCertificates();
      setCertificates(res);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading Verified Certificates...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-mono mb-2 border border-teal-500/30">
          <Award className="w-3.5 h-3.5" /> VERIFIED DIGITAL RECORDS
        </div>
        <h1 className="text-3xl font-extrabold text-white">Earned Certificates</h1>
        <p className="text-xs text-slate-400 mt-1">Official certificates generated upon passing subject competency assessments</p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-400 mb-6">Enroll in a course and pass its subject assessment to earn your official competency certificate.</p>
          <a href="/courses" className="px-5 py-2.5 bg-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow inline-block">
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-teal-500/40 transition shadow-xl group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-mono border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition mb-1">
                  {cert.courseTitle}
                </h3>
                <p className="text-xs text-slate-400 mb-3">Trainee: {cert.traineeName}</p>

                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1 mb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Score:</span>
                    <strong className="text-white">{cert.score} / 100 ({cert.percentage}%)</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Trainer:</span>
                    <strong className="text-slate-300">{cert.trainerName}</strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-teal-400 font-mono pt-1 border-t border-slate-800">
                    <span>ID:</span>
                    <span>{cert.certificateNumber}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(cert)}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" /> View & Print Certificate
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}

    </div>
  );
};
