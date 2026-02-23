import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  BookOpen, 
  Users, 
  Settings, 
  Plus, 
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ChevronRight,
  MapPin,
  Globe
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ colleges: 0, jobs: 0, users: 0, materials: 0 });

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const [colRes, jobRes] = await Promise.all([
          fetch('/api/colleges'),
          fetch('/api/jobs')
        ]);
        const colleges = await colRes.json();
        const jobs = await jobRes.json();
        setStats({
          colleges: colleges.length,
          jobs: jobs.length,
          users: 1,
          materials: 0
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-navy-900 font-bold">FG</div>
          <span className="font-bold tracking-tight">FG Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
          <SidebarLink active={activeTab === 'colleges'} onClick={() => setActiveTab('colleges')} icon={<Building2 className="w-5 h-5" />} label="Colleges" />
          <SidebarLink active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Briefcase className="w-5 h-5" />} label="Jobs" />
          <SidebarLink active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={<BookOpen className="w-5 h-5" />} label="Education" />
          <SidebarLink active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users className="w-5 h-5" />} label="Users" />
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <SidebarLink active={false} onClick={() => {}} icon={<Settings className="w-5 h-5" />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-slate-900 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center text-navy-700 font-bold text-xs">SA</div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'dashboard' && <DashboardView stats={stats} />}
          {activeTab === 'colleges' && <CollegesView />}
          {activeTab === 'jobs' && <JobsView />}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
        active ? "bg-white/10 text-white" : "text-navy-300 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DashboardView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Colleges" value={stats.colleges} icon={<Building2 className="w-6 h-6" />} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Active Jobs" value={stats.jobs} icon={<Briefcase className="w-6 h-6" />} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Total Users" value={stats.users} icon={<Users className="w-6 h-6" />} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Materials" value={stats.materials} icon={<BookOpen className="w-6 h-6" />} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">New College Added</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg }: { label: string, value: number, icon: React.ReactNode, color: string, bg: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm", bg, color)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function CollegesView() {
  const [colleges, setColleges] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/colleges').then(res => res.json()).then(setColleges);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Colleges</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all">
          <Plus className="w-4 h-4" />
          Add College
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">College Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">NIRF</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {colleges.map(col => (
              <tr key={col.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{col.name}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase">{col.category}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span>{col.city}, {col.state}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-700">#{col.nirf_rank}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-navy-700 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobsView() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/jobs').then(res => res.json()).then(setJobs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Jobs</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all">
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-4">{job.company}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{job.type}</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{job.location}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <p className="text-sm font-bold text-navy-700">{job.salary}</p>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-navy-700 transition-colors"><Edit className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
