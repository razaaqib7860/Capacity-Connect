import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { BookOpen, Search, Filter, Clock, Users, Award, ArrowRight, Sparkles } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [search, selectedCategory, selectedDifficulty]);

  const fetchCourses = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (selectedCategory) query.append('category', selectedCategory);
      if (selectedDifficulty) query.append('difficulty', selectedDifficulty);

      const res = await api.getCourses(query.toString());
      setCourses(res);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-mono mb-2 border border-teal-500/30">
          <BookOpen className="w-3.5 h-3.5" /> COMPETENCY-ALIGNED CATALOG
        </div>
        <h1 className="text-3xl font-extrabold text-white">Course Catalog</h1>
        <p className="text-xs text-slate-400 mt-1">Explore expert-led courses designed to address critical skill gaps</p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-lg">
        
        {/* Search */}
        <div className="relative w-full md:w-1/2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course title or keyword (AWS, DevOps, Leadership)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-1/4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="">All Categories</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="DevOps & Docker">DevOps & Docker</option>
            <option value="Leadership">Leadership</option>
            <option value="Data Analytics">Data Analytics</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="w-full md:w-1/4">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

      </div>

      {/* COURSE CARDS GRID */}
      {loading ? (
        <div className="text-center py-12 text-teal-400 font-mono text-sm">
          <Sparkles className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading Course Catalog...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-teal-500/40 transition shadow-xl group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2.5 py-1 rounded-full font-mono border border-teal-500/20">
                    {course.category}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    {course.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition mb-2">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 border-t border-b border-slate-800/80 py-2.5 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-400" /> {course.duration || '4 Weeks'}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-cyan-400" /> {course.enrollmentsCount || 140} Enrolled</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-emerald-400" /> {course.completionRate || 90}% Pass Rate</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-300 font-medium">Trainer: {course.trainerName || 'Dr. Ananya'}</span>
                <Link
                  to={`/courses/${course._id}`}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1 transition shadow"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
