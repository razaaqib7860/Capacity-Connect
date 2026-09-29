import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Megaphone, Plus, CheckCircle2, Sparkles } from 'lucide-react';

export const AdminAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Platform Update');
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.getAnnouncements();
      setAnnouncements(res);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setMessage('');
    try {
      await api.createAnnouncement({ title, content, category });
      setMessage('Announcement published successfully!');
      setTitle('');
      setContent('');
      fetchAnnouncements();
    } catch (err) {
      setMessage('Failed to publish announcement.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading Announcements...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono mb-2 border border-purple-500/30">
          <Megaphone className="w-3.5 h-3.5" /> SYSTEM ANNOUNCEMENTS
        </div>
        <h1 className="text-3xl font-extrabold text-white">Publish Announcements & Achievements</h1>
        <p className="text-xs text-slate-400 mt-1">Broadcast new course tracks, platform features, and capacity milestones</p>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-teal-400" /> {message}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white mb-2">Create New Announcement</h2>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 🚀 Launching Advanced DevOps Track for Trainees"
            required
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Announcement Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Detailed broadcast content..."
            rows={3}
            required
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Platform Update">Platform Update</option>
            <option value="New Course">New Course Track</option>
            <option value="Achievement">Capacity Milestone Achievement</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={publishing}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow transition"
        >
          {publishing ? 'Publishing...' : 'Publish Announcement'}
        </button>
      </form>

      {/* ANNOUNCEMENTS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Recent System Broadcasts</h2>
        {announcements.map((ann) => (
          <div key={ann._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded font-mono">
                {ann.category}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(ann.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">{ann.title}</h3>
            <p className="text-xs text-slate-300">{ann.content}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
