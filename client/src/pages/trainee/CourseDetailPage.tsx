import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award, 
  Users, 
  ArrowLeft, 
  Sparkles, 
  CheckSquare,
  Megaphone,
  Upload,
  FileCheck,
  Send
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'stream' | 'materials' | 'assignments' | 'assessments'>('stream');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeLecture, setActiveLecture] = useState<number>(0);
  const [message, setMessage] = useState('');

  // Trainee Submission Form State
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [submissionText, setSubmissionText] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  // Trainer Material/Announcement Form State
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialDesc, setNewMaterialDesc] = useState('');
  const [newMaterialType, setNewMaterialType] = useState('PDF');
  const [newMaterialUrl, setNewMaterialUrl] = useState('');
  const [addingMaterial, setAddingMaterial] = useState(false);

  const [announcementContent, setAnnouncementContent] = useState('');
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await api.getCourseById(id!);
      setData(res);
    } catch (err) {
      console.error('Error loading course details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      await api.enrollCourse(id!);
      setMessage('Successfully enrolled! Course is now active under My Enrolled Courses.');
      fetchCourse();
    } catch (err: any) {
      setMessage(err.message || 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleSubmitAssignmentWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId) return;
    setSubmittingAssignment(true);
    try {
      await api.submitAssignment({
        assignmentId: selectedAssignmentId,
        submissionText,
        fileUrl: 'https://capacityconnect.in/submissions/trainee_work.pdf'
      });
      setMessage('Assignment work submitted successfully!');
      setSubmissionText('');
      setSelectedAssignmentId('');
      fetchCourse();
    } catch (err) {
      setMessage('Failed to submit assignment.');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingMaterial(true);
    try {
      await api.addCourseMaterial(id!, {
        title: newMaterialTitle,
        description: newMaterialDesc,
        fileType: newMaterialType,
        fileUrl: newMaterialUrl || 'https://capacityconnect.in/docs/material.pdf'
      });
      setMessage('Material added to classroom!');
      setNewMaterialTitle('');
      setNewMaterialDesc('');
      fetchCourse();
    } catch (err) {
      setMessage('Failed to add material.');
    } finally {
      setAddingMaterial(false);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostingAnnouncement(true);
    try {
      await api.addCourseAnnouncement(id!, {
        title: 'Classroom Stream Update',
        content: announcementContent
      });
      setMessage('Announcement posted to classroom stream!');
      setAnnouncementContent('');
      fetchCourse();
    } catch (err) {
      setMessage('Failed to post announcement.');
    } finally {
      setPostingAnnouncement(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading Google Classroom Stream...
      </div>
    );
  }

  const course = data?.course;
  const isEnrolled = data?.isEnrolled;
  const enrollment = data?.enrollment;
  const assignments = data?.assignments || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {message && (
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-teal-400" /> {message}
        </div>
      )}

      {/* HERO CLASSROOM HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-teal-500/10 text-teal-300 px-3 py-1 rounded-full font-mono border border-teal-500/30">
                {course?.category}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono">
                {course?.difficulty}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {course?.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {course?.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Trainer: <strong className="text-white">{course?.trainerName || 'Dr. Ananya Sharma'}</strong></span>
              <span>Duration: <strong className="text-white">{course?.duration || '4 Weeks'}</strong></span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shrink-0 w-full lg:w-80 shadow-xl">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block uppercase mb-1">ENROLLMENT STATUS</span>
              {isEnrolled ? (
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-2">
                    <CheckCircle2 className="w-5 h-5" /> Enrolled Trainee
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Course Progress: {enrollment?.progress || 0}%</div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-4">
                    <div className="bg-teal-500 h-full" style={{ width: `${enrollment?.progress || 0}%` }}></div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-300 mb-4">
                  Enroll to unlock recorded lectures, study materials, and classroom assignments.
                </div>
              )}
            </div>

            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            ) : (
              <div className="text-center text-xs text-teal-400 font-mono">
                Active Trainee Membership
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CLASSROOM TABS NAVIGATION */}
      <div className="flex items-center border-b border-slate-800 space-x-4">
        {[
          { key: 'stream', label: 'Stream & Announcements', icon: Megaphone },
          { key: 'materials', label: 'Classwork & Materials', icon: FileText },
          { key: 'assignments', label: 'Assignments', icon: Upload },
          { key: 'assessments', label: 'MCQ Assessment', icon: CheckSquare }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`pb-3 px-2 text-xs font-bold transition flex items-center gap-2 border-b-2 ${activeTab === t.key ? 'border-teal-400 text-teal-300' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: STREAM & ANNOUNCEMENTS */}
      {activeTab === 'stream' && (
        <div className="space-y-6">
          {/* Post Announcement Form (Trainer/Admin) */}
          {(user?.role === 'trainer' || user?.role === 'admin') && (
            <form onSubmit={handlePostAnnouncement} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white">Announce something to your class</h3>
              <textarea
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                placeholder="Post updates, schedule reminders, or instructions..."
                rows={2}
                required
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
              <div className="flex justify-end">
                <button type="submit" disabled={postingAnnouncement} className="px-4 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> Post Announcement
                </button>
              </div>
            </form>
          )}

          {/* Announcements Stream */}
          <div className="space-y-4">
            {(course?.announcements || []).map((ann: any, idx: number) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{ann.authorName || 'Dr. Ananya Sharma'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CLASSWORK & MATERIALS */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* Add Material Form (Trainer/Admin) */}
          {(user?.role === 'trainer' || user?.role === 'admin') && (
            <form onSubmit={handleAddMaterial} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white">Add New Study Material</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  placeholder="Material Title"
                  required
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <input
                  type="text"
                  value={newMaterialDesc}
                  onChange={(e) => setNewMaterialDesc(e.target.value)}
                  placeholder="Description"
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <select
                  value={newMaterialType}
                  onChange={(e) => setNewMaterialType(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="PDF">PDF</option>
                  <option value="PPT">PPT</option>
                  <option value="Video">Video</option>
                  <option value="Document">Document</option>
                  <option value="External Link">External Link</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={addingMaterial} className="px-4 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl">
                  Add Material
                </button>
              </div>
            </form>
          )}

          {/* Materials List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(course?.materials || []).map((mat: any, idx: number) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start justify-between">
                <div>
                  <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-mono uppercase">
                    {mat.fileType}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{mat.title}</h4>
                  <p className="text-xs text-slate-400">{mat.description}</p>
                </div>
                <a href={mat.fileUrl || '#'} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-teal-300 font-mono text-xs rounded border border-slate-700">
                  Open
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="space-y-4">
            {assignments.map((asg: any) => (
              <div key={asg._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-base font-bold text-white">{asg.title}</h3>
                  <span className="text-xs text-amber-400 font-mono">
                    Due: {new Date(asg.deadline).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{asg.instructions}</p>

                {/* Trainee Submission Form */}
                {isEnrolled && (
                  <form onSubmit={handleSubmitAssignmentWork} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-bold text-teal-300 block">Submit Your Work for this Assignment</span>
                    <textarea
                      value={submissionText}
                      onChange={(e) => {
                        setSelectedAssignmentId(asg._id);
                        setSubmissionText(e.target.value);
                      }}
                      placeholder="Type your submission response or document link..."
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                    <button
                      type="submit"
                      onClick={() => setSelectedAssignmentId(asg._id)}
                      disabled={submittingAssignment}
                      className="px-4 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <FileCheck className="w-3.5 h-3.5" /> Submit Assignment
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MCQ ASSESSMENTS */}
      {activeTab === 'assessments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Subject MCQ Assessment</h3>
          {course?.assessment ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">AWS Cloud Foundations & Architecture MCQ</h4>
                <p className="text-xs text-slate-400">5 Questions • Pass percentage: 70%</p>
              </div>
              <Link
                to={`/assessments/${typeof course.assessment === 'object' ? course.assessment._id : course.assessment}`}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow"
              >
                Attempt Quiz Now
              </Link>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No assessment linked to this course yet.</p>
          )}
        </div>
      )}

    </div>
  );
};
