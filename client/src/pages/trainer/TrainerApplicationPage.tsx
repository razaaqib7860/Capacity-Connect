import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Users, FileText, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const TrainerApplicationPage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [highestQualification, setHighestQualification] = useState('');
  const [institution, setInstitution] = useState('');
  const [experienceYears, setExperienceYears] = useState(8);
  const [currentOrganization, setCurrentOrganization] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [expertise, setExpertise] = useState('Cloud Computing, AWS, DevOps');
  const [teachingExperience, setTeachingExperience] = useState('');
  const [publications, setPublications] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await api.submitTrainerApplication({
        fullName,
        email,
        phone,
        location,
        highestQualification,
        institution,
        experienceYears,
        currentOrganization,
        resumeUrl,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        expertiseAreas: expertise.split(',').map(s => s.trim()),
        teachingExperience,
        publications
      });
      setMessage('Trainer Application submitted! Status is PENDING admin review.');
      setStatus(res.application);
    } catch (err: any) {
      setMessage(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2 border border-cyan-500/30">
          <Users className="w-3.5 h-3.5" /> TRAINER ONBOARDING APPLICATION
        </div>
        <h1 className="text-3xl font-extrabold text-white">Apply to Become a Certified Trainer</h1>
        <p className="text-xs text-slate-400 mt-1">Submit your qualifications and credentials for Admin Review & Verification</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> {message}
        </div>
      )}

      {status && (
        <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-2 font-mono">
          <span className="text-xs text-slate-400 block">APPLICATION STATUS</span>
          <div className="text-xl font-bold text-cyan-300 uppercase">{status.status}</div>
          <p className="text-xs text-slate-400 font-sans">
            Your application is currently under review by System Administrators. Once approved, you will receive full access to the Trainer Studio.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">Trainer Onboarding Form</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. Ananya Sharma"
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ananya@capacityconnect.in"
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Highest Qualification</label>
            <input
              type="text"
              value={highestQualification}
              onChange={(e) => setHighestQualification(e.target.value)}
              placeholder="Ph.D. in Computer Science"
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institution / University</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="IISc Bangalore"
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Experience (Years)</label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Organization</label>
            <input
              type="text"
              value={currentOrganization}
              onChange={(e) => setCurrentOrganization(e.target.value)}
              placeholder="Cloud Innovation Labs"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resume URL / CV Link</label>
            <input
              type="text"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://capacityconnect.in/resumes/cv.pdf"
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn Profile URL</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/trainer-demo"
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Areas of Expertise (Comma Separated)</label>
            <input
              type="text"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="Cloud Computing, AWS, DevOps, System Design"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Teaching & Corporate Training Experience</label>
            <textarea
              value={teachingExperience}
              onChange={(e) => setTeachingExperience(e.target.value)}
              placeholder="Detail your prior training experience, corporate clients, or academic lectures..."
              rows={3}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition"
          >
            {submitting ? 'Submitting Application...' : 'Submit Application for Admin Approval'}
          </button>
        </div>

      </form>

    </div>
  );
};
