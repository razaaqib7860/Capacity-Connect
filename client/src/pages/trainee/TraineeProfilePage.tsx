import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  User, 
  GraduationCap, 
  FileText, 
  Link as LinkIcon, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Save, 
  Award,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const TraineeProfilePage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Step 1: Basic
  const [headline, setHeadline] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Step 2: Education & Role
  const [qualification, setQualification] = useState('');
  const [institution, setInstitution] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(2023);
  const [currentRole, setCurrentRole] = useState('');
  const [experience, setExperience] = useState<any[]>([]);

  // Step 3: Resume
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeText, setResumeText] = useState('');

  // Step 4: Social / Links
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Step 5: Skills & Competencies
  const [targetCompetency, setTargetCompetency] = useState('');
  const [skills, setSkills] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [careerInterests, setCareerInterests] = useState<string[]>([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.getTraineeProfile();
      const p = res.profile || {};
      setProfile(p);
      setHeadline(p.headline || '');
      setPhone(p.phone || '');
      setLocation(p.location || '');
      setQualification(p.highestQualification || 'B.Tech in Computer Science');
      setInstitution(p.institution || 'IIT Delhi');
      setGraduationYear(p.graduationYear || 2023);
      setCurrentRole(p.currentRole || 'Junior Software Engineer');
      setExperience(p.workExperience || [{ title: 'Junior Software Engineer', company: 'Digital India Tech', duration: '2 Years' }]);
      setResumeUrl(p.resumeUrl || '');
      setResumeText(p.resumeText || '');
      setLinkedinUrl(p.linkedinUrl || '');
      setGithubUrl(p.githubUrl || '');
      setPortfolioUrl(p.portfolioUrl || '');
      setTargetCompetency(p.targetCompetency || 'Technical Project Lead');
      setSkills(p.currentSkills || []);
      setCertifications(p.certifications || []);
      setAchievements(p.achievements || []);
      setCareerInterests(p.careerInterests || []);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionPercentage = () => {
    let score = 0;
    if (headline) score += 15;
    if (qualification && institution) score += 20;
    if (resumeUrl || resumeText) score += 20;
    if (linkedinUrl || githubUrl) score += 15;
    if (skills.length > 0) score += 20;
    if (targetCompetency) score += 10;
    return Math.min(100, score);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const compPct = calculateCompletionPercentage();
      const res = await api.updateTraineeProfile({
        headline,
        phone,
        location,
        highestQualification: qualification,
        institution,
        graduationYear,
        currentRole,
        workExperience: experience,
        resumeUrl,
        resumeText,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        targetCompetency,
        currentSkills: skills,
        certifications,
        achievements,
        careerInterests,
        profileCompletionPercentage: compPct
      });
      setMessage('Profile updated successfully! AI Competency Engine refreshed.');
      setProfile(res.profile);
    } catch (err: any) {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => setSkills([...skills, { skill: 'New Skill', level: 'Beginner', score: 40 }]);
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));
  const updateSkill = (i: number, field: string, value: any) => {
    const updated = [...skills];
    updated[i][field] = value;
    setSkills(updated);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading Step-Based Professional Profile...
      </div>
    );
  }

  const completionPct = calculateCompletionPercentage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER & PROGRESS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-mono mb-2 border border-teal-500/30">
              <User className="w-3.5 h-3.5" /> PROFESSIONAL PROFILE BUILDER
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trainee Profile & Career Credentials
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Complete your profile steps to unlock precise Gemini AI skill-gap analysis
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shrink-0 text-right">
            <span className="text-[10px] text-slate-400 font-mono block">PROFILE COMPLETION</span>
            <div className="text-2xl font-black text-teal-400 font-mono">{completionPct}%</div>
            <div className="w-36 bg-slate-900 h-2 rounded-full overflow-hidden mt-1 border border-slate-800">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full" style={{ width: `${completionPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-teal-400" /> {message}
        </div>
      )}

      {/* STEP NAVIGATION PIPES */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
        {[
          { step: 1, title: 'Step 1: Account' },
          { step: 2, title: 'Step 2: Education' },
          { step: 3, title: 'Step 3: Resume' },
          { step: 4, title: 'Step 4: Links' },
          { step: 5, title: 'Step 5: Skills' },
          { step: 6, title: 'Step 6: Complete' }
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            className={`py-2.5 px-3 rounded-xl border text-center transition text-xs font-bold font-mono ${activeStep === s.step ? 'bg-teal-500 text-slate-950 border-teal-400 shadow' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* STEP 1: ACCOUNT & BASIC */}
      {activeStep === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">Step 1: Basic Information & Headline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Software Engineer & Aspiring Cloud Specialist"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="New Delhi, India"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={() => setActiveStep(2)} className="px-5 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1">
              Next: Education <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EDUCATION & EXPERIENCE */}
      {activeStep === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">Step 2: Education & Work Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Highest Qualification</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="B.Tech in Computer Science"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institution / University</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="IIT Delhi"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Graduation Year</label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Role</label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="Junior Software Engineer"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setActiveStep(1)} className="px-5 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button onClick={() => setActiveStep(3)} className="px-5 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1">
              Next: Resume <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RESUME UPLOAD */}
      {activeStep === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">Step 3: Resume Upload & Key Text</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resume File URL / Document Link</label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://capacityconnect.in/resumes/rahul_kumar_resume.pdf"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resume Summary Text for AI Engine</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={4}
                placeholder="Paste key experience highlights, tech stack used, and key projects..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setActiveStep(2)} className="px-5 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button onClick={() => setActiveStep(4)} className="px-5 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1">
              Next: Social Links <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LINKEDIN / GITHUB / PORTFOLIO */}
      {activeStep === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">Step 4: LinkedIn, GitHub & Portfolio URLs</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/rahulkumar-demo"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub Profile URL</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/rahulkumar-demo"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Portfolio Website URL</label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://rahulkumar.dev"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setActiveStep(3)} className="px-5 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button onClick={() => setActiveStep(5)} className="px-5 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1">
              Next: Skills & Goals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SKILLS & GOALS */}
      {activeStep === 5 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <h2 className="text-base font-bold text-white">Step 5: Current Skills & Target Competency</h2>
            <button
              type="button"
              onClick={addSkill}
              className="px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Competency Goal</label>
            <select
              value={targetCompetency}
              onChange={(e) => setTargetCompetency(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="Technical Project Lead">Technical Project Lead</option>
              <option value="Cloud Infrastructure Architect">Cloud Infrastructure Architect</option>
              <option value="DevOps & Security Specialist">DevOps & Security Specialist</option>
              <option value="Data Engineering Lead">Data Engineering Lead</option>
            </select>
          </div>

          <div className="space-y-3">
            {skills.map((s, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    value={s.skill}
                    onChange={(e) => updateSkill(idx, 'skill', e.target.value)}
                    placeholder="Skill Name"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
                <div className="w-full sm:w-1/4">
                  <select
                    value={s.level}
                    onChange={(e) => updateSkill(idx, 'level', e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={s.score}
                    onChange={(e) => updateSkill(idx, 'score', parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <span className="text-[10px] text-teal-400 font-mono float-right">{s.score}%</span>
                </div>
                <button type="button" onClick={() => removeSkill(idx)} className="text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setActiveStep(4)} className="px-5 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button onClick={() => setActiveStep(6)} className="px-5 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1">
              Next: Review & Complete <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: COMPLETE & SAVE */}
      {activeStep === 6 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Profile Ready for AI Competency Engine</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your profile completion is calculated at <strong className="text-teal-400 font-mono">{completionPct}%</strong>.
            Click below to save credentials and run Gemini AI Gap Analysis.
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 inline-flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving & Analyzing...' : 'Save Profile & Run AI Engine'}
          </button>
        </div>
      )}

    </div>
  );
};
