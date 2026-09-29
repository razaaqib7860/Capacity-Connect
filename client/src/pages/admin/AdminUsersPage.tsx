import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, User, CheckCircle2, XCircle, Search, Sparkles, FileText, Check, X } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'users'>('applications');
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, usersRes] = await Promise.all([
        api.getTrainerApplications(),
        api.getAdminUsers()
      ]);
      setApplications(appsRes);
      setUsers(usersRes);
    } catch (err) {
      console.error('Error fetching admin user management data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewApplication = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.reviewTrainerApplication(id, { status, adminFeedback: `Reviewed and ${status.toLowerCase()} by Admin.` });
      setMessage(`Trainer application ${status.toLowerCase()} successfully.`);
      setSelectedApp(null);
      fetchData();
    } catch (err) {
      console.error('Error reviewing application:', err);
    }
  };

  const handleApproveUser = async (id: string) => {
    try {
      await api.approveUser(id);
      fetchData();
    } catch (err) {
      console.error('Error approving user:', err);
    }
  };

  const handleRejectUser = async (id: string) => {
    try {
      await api.rejectUser(id);
      fetchData();
    } catch (err) {
      console.error('Error rejecting user:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading Admin Verification Panel...
      </div>
    );
  }

  const pendingApps = applications.filter(a => a.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono mb-2 border border-purple-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> ADMIN VERIFICATION & USER CONTROL
        </div>
        <h1 className="text-3xl font-extrabold text-white">Trainer Applications & User Management</h1>
        <p className="text-xs text-slate-400 mt-1">Review trainer credentials, approve/reject applications, and manage platform access</p>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-teal-400" /> {message}
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-2 text-xs font-bold transition flex items-center gap-2 border-b-2 ${activeTab === 'applications' ? 'border-purple-400 text-purple-300' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          <FileText className="w-4 h-4" /> Trainer Applications ({pendingApps.length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-2 text-xs font-bold transition flex items-center gap-2 border-b-2 ${activeTab === 'users' ? 'border-purple-400 text-purple-300' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          <User className="w-4 h-4" /> All Platform Users ({users.length})
        </button>
      </div>

      {/* TAB 1: TRAINER APPLICATIONS REVIEW PANEL */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{app.fullName}</h3>
                    <p className="text-xs text-slate-400">{app.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${app.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : app.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {app.status}
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-1.5">
                  <div className="text-slate-300">Qualification: <strong className="text-white">{app.highestQualification}</strong></div>
                  <div className="text-slate-300">Institution: <strong className="text-white">{app.institution}</strong></div>
                  <div className="text-slate-300">Experience: <strong className="text-teal-400 font-mono">{app.experienceYears} Years</strong></div>
                  <div className="text-slate-300">Expertise: <span className="text-cyan-300">{app.expertiseAreas?.join(', ')}</span></div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <a href={app.resumeUrl || '#'} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline flex items-center gap-1 font-mono">
                    <FileText className="w-3.5 h-3.5" /> View Resume PDF
                  </a>

                  {app.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewApplication(app._id, 'REJECTED')}
                        className="px-3 py-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleReviewApplication(app._id, 'APPROVED')}
                        className="px-4 py-1.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Trainer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ALL USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-950/60 transition">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      {u.name}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{u.email}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold capitalize ${u.role === 'trainee' ? 'bg-teal-500/10 text-teal-300' : u.role === 'trainer' ? 'bg-cyan-500/10 text-cyan-300' : 'bg-purple-500/10 text-purple-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {u.isApproved ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {u.isApproved ? (
                        <button
                          onClick={() => handleRejectUser(u._id)}
                          className="px-3 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-[11px] font-bold rounded-lg transition"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveUser(u._id)}
                          className="px-3 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-[11px] font-bold rounded-lg transition"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
