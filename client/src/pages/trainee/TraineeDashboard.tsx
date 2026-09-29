import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Award, 
  BookOpen, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const TraineeDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, myCoursesRes] = await Promise.all([
        api.getTraineeDashboard(),
        api.getMyCourses().catch(() => [])
      ]);
      setData(dashRes);
      setMyCourses(myCoursesRes || []);
    } catch (err) {
      console.error('Error loading trainee dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading Trainee Competency Dashboard...
      </div>
    );
  }

  const welcomeName = data?.welcomeName || 'Rahul Kumar';
  const progress = data?.overallProgress || 78;
  const competencyScore = data?.competencyScore || 72;
  const skillGaps = data?.skillGaps || [
    { skill: 'Cloud Computing', gapLevel: 'HIGH GAP' },
    { skill: 'Leadership', gapLevel: 'HIGH GAP' }
  ];
  const recommendedCourses = data?.recommendedCourses || [];
  const trainer = data?.recommendedTrainer;
  const upcomingAssessment = data?.upcomingAssessment;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* PERSONALIZED WELCOME BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-mono mb-2 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Trainee Competency Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-teal-400">{welcomeName}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Target Competency: <strong className="text-white">{data?.targetCompetency || 'Technical Project Lead'}</strong>.
              Your competency score & personalized learning path update dynamically after every assessment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/trainee/competencies" 
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition"
            >
              <BrainCircuit className="w-4 h-4" /> Open Competency Engine
            </Link>
          </div>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Learning Progress Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-mono">
            <span>LEARNING PROGRESS</span>
            <span className="text-teal-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-3">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400">Average progress across enrolled courses</p>
        </div>

        {/* Current Competency Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1 font-mono">
            <span>CURRENT COMPETENCY</span>
            <span className="text-xs text-emerald-400 font-bold">+5% this week</span>
          </div>
          <div className="flex items-baseline gap-1 text-3xl font-black text-white">
            {competencyScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
          </div>
          <p className="text-[11px] text-teal-400 font-mono mt-1">Target Threshold: 85+</p>
        </div>

        {/* Skill Gaps Identified */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-mono mb-2">IDENTIFIED SKILL GAPS</div>
          <div className="flex flex-wrap gap-1.5">
            {skillGaps.map((g: any, i: number) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {g.skill}
              </span>
            ))}
          </div>
        </div>

        {/* Certificates Earned */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-mono mb-1">VERIFIED CERTIFICATES</div>
          <div className="text-3xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-teal-400" /> {data?.certificatesCount || 1}
          </div>
          <Link to="/trainee/certificates" className="text-[11px] text-teal-400 hover:underline mt-1 inline-block">
            View certificate records →
          </Link>
        </div>

      </div>

      {/* DASHBOARD DETAILED GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Enrolled Courses, Recommended Courses & Upcoming Assessment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* My Enrolled Courses Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-400" /> My Enrolled Courses
                </h2>
                <p className="text-xs text-slate-400">Your active learning paths & progress</p>
              </div>
              <span className="text-xs bg-teal-500/10 text-teal-300 px-3 py-1 rounded-full font-mono font-bold border border-teal-500/30">
                {myCourses.length} Active Courses
              </span>
            </div>

            {myCourses.length > 0 ? (
              <div className="space-y-4">
                {myCourses.map((item: any, idx: number) => {
                  const courseObj = item.course || item;
                  return (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-500/40 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-mono uppercase font-semibold">
                            {courseObj.category || 'General'}
                          </span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono uppercase font-bold">
                            ENROLLED ({item.status || 'IN_PROGRESS'})
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white">{courseObj.title}</h3>
                        <p className="text-xs text-slate-400">Instructor: {courseObj.trainerName || 'Dr. Ananya Sharma'}</p>
                      </div>

                      <div className="sm:text-right shrink-0 space-y-2">
                        <div className="text-xs text-teal-400 font-mono font-bold">{item.progress || 45}% Completed</div>
                        <div className="w-32 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div className="bg-teal-400 h-full" style={{ width: `${item.progress || 45}%` }}></div>
                        </div>
                        <Link
                          to={`/courses/${courseObj._id}`}
                          className="inline-block px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
                        >
                          Continue Learning →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-6 text-center bg-slate-950 rounded-2xl border border-slate-800">
                You have not enrolled in any courses yet. Browse recommended courses below and click <strong>Enroll</strong>.
              </div>
            )}
          </div>

          {/* Recommended Courses Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-400" /> Recommended Courses for You
                </h2>
                <p className="text-xs text-slate-400">Targeting your identified skill gaps</p>
              </div>
              <Link to="/courses" className="text-xs text-teal-400 hover:underline font-medium">
                View All Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedCourses.map((rec: any, idx: number) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-teal-500/40 transition group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-mono">
                        {rec.course?.category || 'Cloud'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {rec.relevanceScore}% Match
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition mb-1">
                      {rec.course?.title || 'AWS Cloud Foundations'}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {rec.course?.description || 'Learn AWS EC2, S3, IAM, and serverless Lambda deployment.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Trainer: {rec.course?.trainerName || 'Dr. Ananya'}</span>
                    <Link 
                      to={`/courses/${rec.course?._id || ''}`}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-slate-950 font-bold transition text-[11px]"
                    >
                      View & Enroll
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assessment Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" /> Upcoming MCQ Assessment
              </h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-mono">
                Due: Friday
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-teal-400 font-mono uppercase font-semibold">Subject Assessment</span>
                <h3 className="text-base font-bold text-white">{upcomingAssessment?.title || 'Cloud Fundamentals & AWS Architecture MCQ'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">5 Questions • 20 Minutes • Passing Mark: 70%</p>
              </div>

              <Link 
                to={upcomingAssessment?._id ? `/assessments/${upcomingAssessment._id}` : '/courses'}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 text-center transition shrink-0"
              >
                Attempt Quiz Now
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Recommended Trainer Match */}
        <div className="space-y-8">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4 mb-5">
              <span className="text-[10px] text-teal-400 font-mono uppercase font-semibold">Matched Trainer Specialist</span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <UserCheck className="w-5 h-5 text-teal-400" /> Recommended Trainer
              </h2>
            </div>

            {trainer ? (
              <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-lg shadow">
                    {trainer.trainer?.user?.name ? trainer.trainer.user.name.charAt(0) : 'A'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {trainer.trainer?.user?.name || 'Dr. Ananya Sharma'}
                    </h3>
                    <p className="text-xs text-teal-400 font-mono font-semibold">
                      {trainer.matchPercentage}% Competency Match
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="font-semibold text-teal-300 block mb-1">Why this trainer:</span>
                    <p className="whitespace-pre-line text-slate-400 text-[11px]">
                      {trainer.why || '✓ Matches Cloud competency gap\n✓ Relevant industry experience (12 yrs)\n✓ Teaches required subjects'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {(trainer.trainer?.expertise || ['Cloud', 'AWS', 'DevOps']).map((exp: string, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-800">
                      {exp}
                    </span>
                  ))}
                </div>

                <Link
                  to="/courses"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition"
                >
                  View Trainer's Courses <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-4">No specific trainer match calculated yet.</div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
