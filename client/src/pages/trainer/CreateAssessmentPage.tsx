import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CheckSquare, Plus, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react';

export const CreateAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Cloud Computing');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [passPercentage, setPassPercentage] = useState(70);
  const [questions, setQuestions] = useState<any[]>([
    {
      questionText: 'Sample Question 1: What is the primary benefit of containerization?',
      options: ['Higher power usage', 'Portability across environment', 'Slower deployment', 'Manual server wiring'],
      correctOptionIndex: 1,
      marks: 25
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.getTrainerCourses();
      setCourses(res);
      if (res.length > 0) setSelectedCourseId(res[0]._id);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: 'New MCQ Question',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 0,
        marks: 25
      }
    ]);
  };

  const handleUpdateQuestion = (qIdx: number, field: string, val: any) => {
    const copy = [...questions];
    copy[qIdx][field] = val;
    setQuestions(copy);
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    const copy = [...questions];
    copy[qIdx].options[optIdx] = val;
    setQuestions(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setMessage('Please select a course to attach this assessment.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await api.createAssessment({
        courseId: selectedCourseId,
        title,
        subject,
        durationMinutes,
        passPercentage,
        questions
      });
      setMessage('MCQ Assessment created successfully!');
      setTimeout(() => navigate('/trainer/dashboard'), 1000);
    } catch (err: any) {
      setMessage('Failed to create assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> Back to Studio
      </button>

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-cyan-400" /> Create MCQ Questionnaire
        </h1>
        <p className="text-xs text-slate-400">Configure subject assessment questions, passing marks, and attach to course</p>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-teal-400" /> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Assessment Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Attach to Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assessment Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Security & Lambda MCQ"
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pass Percentage Threshold (%)</label>
              <input
                type="number"
                value={passPercentage}
                onChange={(e) => setPassPercentage(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* MCQ Questions Builder */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <h2 className="text-base font-bold text-white">MCQ Questions</h2>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">Question {qIdx + 1}</span>
                  <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))} className="text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={q.questionText}
                  onChange={(e) => handleUpdateQuestion(qIdx, 'questionText', e.target.value)}
                  placeholder="Question text"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />

                <div className="grid grid-cols-2 gap-2">
                  {(q.options || []).map((opt: string, optIdx: number) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correctOptionIndex === optIdx}
                        onChange={() => handleUpdateQuestion(qIdx, 'correctOptionIndex', optIdx)}
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 block">Select radio button next to option to mark as correct answer.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition"
          >
            {loading ? 'Saving Assessment...' : 'Save MCQ Assessment'}
          </button>
        </div>

      </form>

    </div>
  );
};
