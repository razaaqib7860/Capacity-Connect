import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { PlusCircle, Plus, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react';

export const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cloud Computing');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState('4 Weeks');
  const [objectives, setObjectives] = useState<string[]>(['Master core principles', 'Complete hands-on implementation']);
  const [lectures, setLectures] = useState<any[]>([
    { title: 'Lecture 1: Fundamental Concepts', duration: '25 min', summary: 'Introduction to subject domain.' }
  ]);
  const [materials, setMaterials] = useState<any[]>([
    { title: 'Reference Slide Deck', fileUrl: '#', fileType: 'PDF' }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddObjective = () => setObjectives([...objectives, '']);
  const handleUpdateObjective = (idx: number, val: string) => {
    const copy = [...objectives];
    copy[idx] = val;
    setObjectives(copy);
  };
  const handleRemoveObjective = (idx: number) => setObjectives(objectives.filter((_, i) => i !== idx));

  const handleAddLecture = () => setLectures([...lectures, { title: 'New Recorded Lecture', duration: '30 min', summary: 'Lecture topic summary.' }]);
  const handleUpdateLecture = (idx: number, field: string, val: string) => {
    const copy = [...lectures];
    copy[idx][field] = val;
    setLectures(copy);
  };
  const handleRemoveLecture = (idx: number) => setLectures(lectures.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.createCourse({
        title,
        description,
        category,
        difficulty,
        duration,
        learningObjectives: objectives,
        lectures,
        studyMaterials: materials,
        competencyTags: [category, difficulty]
      });
      setMessage('Course created successfully!');
      setTimeout(() => navigate('/trainer/dashboard'), 1000);
    } catch (err: any) {
      setMessage('Failed to create course.');
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
          <PlusCircle className="w-6 h-6 text-teal-400" /> Create New Course
        </h1>
        <p className="text-xs text-slate-400">Publish recorded lectures, study materials, and learning objectives</p>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-teal-400" /> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Course Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Basic Course Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced Cloud Security & DevSecOps"
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive summary of what trainees will learn..."
                rows={3}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="DevOps & Docker">DevOps & Docker</option>
                <option value="Leadership">Leadership</option>
                <option value="Data Analytics">Data Analytics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lectures List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <h2 className="text-base font-bold text-white">Recorded Lectures & Modules</h2>
            <button
              type="button"
              onClick={handleAddLecture}
              className="px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Lecture
            </button>
          </div>

          <div className="space-y-3">
            {lectures.map((lec, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-400">Lecture {idx + 1}</span>
                  <button type="button" onClick={() => handleRemoveLecture(idx)} className="text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={lec.title}
                  onChange={(e) => handleUpdateLecture(idx, 'title', e.target.value)}
                  placeholder="Lecture Title"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
                <input
                  type="text"
                  value={lec.summary}
                  onChange={(e) => handleUpdateLecture(idx, 'summary', e.target.value)}
                  placeholder="Summary of lecture topic"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition"
          >
            {loading ? 'Publishing Course...' : 'Publish Course'}
          </button>
        </div>

      </form>

    </div>
  );
};
