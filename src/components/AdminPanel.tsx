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
  Globe,
  ArrowLeft,
  Download,
  FileText,
  ChevronDown,
  X
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-full duration-300",
      type === 'success' ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
    )}>
      {type === 'success' ? <Globe className="w-5 h-5" /> : <X className="w-5 h-5" />}
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ colleges: 0, jobs: 0, users: 0, materials: 0, admins: 0, communities: 0 });
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>({ name: 'Suhrid', role: 'super_admin' });
  const [health, setHealth] = useState<any>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        setHealth({ status: 'error', message: 'Backend disconnected' });
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats({
          colleges: data.colleges.reduce((acc: number, curr: any) => acc + curr.count, 0),
          jobs: data.jobs.reduce((acc: number, curr: any) => acc + curr.count, 0),
          users: data.summary.users,
          materials: data.summary.materials,
          admins: data.summary.admins,
          communities: data.summary.communities
        });
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };
    fetchStats();
  }, []);

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isModerateAdmin = currentUser.role === 'moderate_admin' || isSuperAdmin;
  const isWriterAdmin = currentUser.role === 'writer_admin' || isModerateAdmin;

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
          
          {isModerateAdmin && (
            <>
              <SidebarLink active={activeTab === 'colleges'} onClick={() => setActiveTab('colleges')} icon={<Building2 className="w-5 h-5" />} label="Colleges" />
              <SidebarLink active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Briefcase className="w-5 h-5" />} label="Jobs" />
              <SidebarLink active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={<BookOpen className="w-5 h-5" />} label="Education" />
            </>
          )}

          {isWriterAdmin && (
            <SidebarLink active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} icon={<Globe className="w-5 h-5" />} label="Blogs" />
          )}

          {isSuperAdmin && (
            <>
              <SidebarLink active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users className="w-5 h-5" />} label="Users" />
              <SidebarLink active={activeTab === 'admins'} onClick={() => setActiveTab('admins')} icon={<Users className="w-5 h-5" />} label="Manage Admins" />
              <SidebarLink active={activeTab === 'communities'} onClick={() => setActiveTab('communities')} icon={<Users className="w-5 h-5" />} label="Communities" />
              <SidebarLink active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings className="w-5 h-5" />} label="System Settings" />
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex flex-col gap-2 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-navy-400 uppercase tracking-widest font-bold">System Status</span>
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                health?.status === 'ok' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              )} />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-xs font-bold">
                {currentUser.name[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{currentUser.name}</p>
                <p className="text-[10px] text-navy-400 uppercase tracking-wider">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
            {/* Role Switcher for Testing */}
            <select 
              className="mt-2 bg-navy-800 border border-white/10 rounded-lg text-[10px] p-1 text-white outline-none"
              value={currentUser.role}
              onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
            >
              <option value="super_admin">Super Admin</option>
              <option value="moderate_admin">Moderate Admin</option>
              <option value="writer_admin">Writer Admin</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Global Search..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'dashboard' && <DashboardView stats={stats} />}
          {activeTab === 'colleges' && isModerateAdmin && <CollegesView showToast={showToast} />}
          {activeTab === 'jobs' && isModerateAdmin && <JobsView userRole={currentUser.role} showToast={showToast} />}
          {activeTab === 'education' && isModerateAdmin && <EducationView showToast={showToast} />}
          {activeTab === 'blogs' && isWriterAdmin && <BlogsView showToast={showToast} />}
          {activeTab === 'users' && isSuperAdmin && <UsersView showToast={showToast} />}
          {activeTab === 'admins' && isSuperAdmin && <AdminsView showToast={showToast} />}
          {activeTab === 'communities' && isSuperAdmin && <CommunitiesView showToast={showToast} />}
          {activeTab === 'settings' && isSuperAdmin && <SettingsView />}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function SettingsView() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSeed = async () => {
    if (!confirm('This will trigger the seeding logic. Are you sure?')) return;
    setIsSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('Failed to trigger seeding.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Database Management</h3>
        <p className="text-slate-500 mb-6">Manage the core data structures of the application.</p>
        
        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
          <h4 className="font-bold text-amber-800 mb-1">Notice</h4>
          <p className="text-sm text-amber-700">Seeding only adds missing data. It will not delete your existing entries.</p>
        </div>

        <button 
          onClick={handleSeed}
          disabled={isSeeding}
          className="flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all disabled:opacity-50"
        >
          {isSeeding ? 'Processing...' : 'Trigger Database Seed'}
        </button>
        
        {message && (
          <p className="mt-4 text-sm font-medium text-blue-600">{message}</p>
        )}
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-2">System Information</h3>
        <div className="space-y-4 mt-6">
          <div className="flex justify-between py-3 border-b border-slate-50">
            <span className="text-slate-500">Environment</span>
            <span className="font-mono text-sm font-bold">{(import.meta.env.MODE) || 'development'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-50">
            <span className="text-slate-500">Platform</span>
            <span className="font-mono text-sm font-bold">AI Studio Preview</span>
          </div>
        </div>
      </div>
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
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load analytics');
        return res.json();
      })
      .then(setAnalytics)
      .catch(err => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  if (error) return (
    <div className="p-12 text-center bg-white rounded-[32px] border border-red-100 shadow-sm">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Analytics Unavailable</h3>
      <p className="text-slate-500 mb-6">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-navy-900 text-white rounded-xl font-bold text-sm"
      >
        Retry Connection
      </button>
    </div>
  );

  if (!analytics) return (
    <div className="p-24 text-center">
      <div className="w-12 h-12 border-4 border-navy-100 border-t-navy-900 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-500 font-medium">Initializing Dashboard...</p>
    </div>
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Colleges" value={stats.colleges} icon={<Building2 className="w-5 h-5" />} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Jobs" value={stats.jobs} icon={<Briefcase className="w-5 h-5" />} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Users" value={stats.users} icon={<Users className="w-5 h-5" />} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Materials" value={stats.materials} icon={<BookOpen className="w-5 h-5" />} color="text-amber-600" bg="bg-amber-50" />
        <StatCard label="Admins" value={stats.admins} icon={<Users className="w-5 h-5" />} color="text-rose-600" bg="bg-rose-50" />
        <StatCard label="Groups" value={stats.communities} icon={<Users className="w-5 h-5" />} color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Platform Growth
            </h3>
            <select className="text-xs font-bold text-slate-400 bg-slate-50 border-none rounded-lg p-2 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
            Recent Activity
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">Live</span>
          </h3>
          <div className="space-y-6 flex-1">
            {[
              { title: 'New Job: SDE Intern', time: '10 mins ago', icon: <Plus className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600' },
              { title: 'New Blog: Engineering Prep', time: '1 hour ago', icon: <FileText className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600' },
              { title: 'New College: IIT Bombay', time: '3 hours ago', icon: <Building2 className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600' },
              { title: 'User Signed Up: Amit Kumar', time: '5 hours ago', icon: <Users className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600' },
              { title: 'New Community: AI/ML', time: '8 hours ago', icon: <Plus className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-600' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", activity.color)}>
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{activity.title}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{activity.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors border-t border-slate-50">View All Activity</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Jobs by Category */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-500" />
            Jobs Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={analytics.jobs}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                  {analytics.jobs.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Colleges by Category */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" />
            College Categories
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.colleges}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="count"
                  nameKey="category"
                  stroke="none"
                >
                  {analytics.colleges.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
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

function JobsView({ userRole, showToast }: { userRole: string, showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', category: 'Engineering', sub_category: '', type: 'In Office', timing: 'Full Time',
    salary: '', is_internship: 0, is_competition: 0, is_featured: 0, user_type: 'Student', domain: '', course: '',
    content: '', experience: '', qualification: '', apply_url: ''
  });
  const isModerateAdmin = userRole === 'moderate_admin' || userRole === 'super_admin';

  useEffect(() => {
    fetch('/api/jobs').then(res => res.json()).then(setJobs);
  }, []);

  useEffect(() => {
    if (editingJob) {
      setFormData({ ...editingJob });
      setShowForm(true);
    }
  }, [editingJob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingJob ? 'PATCH' : 'POST';
    const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const savedJob = await res.json();
      if (editingJob) {
        setJobs(jobs.map(j => j.id === editingJob.id ? savedJob : j));
      } else {
        setJobs([savedJob, ...jobs]);
      }
      setShowForm(false);
      setEditingJob(null);
      setFormData({
        title: '', company: '', location: '', category: 'Engineering', sub_category: '', type: 'In Office', timing: 'Full Time',
        salary: '', is_internship: 0, is_competition: 0, is_featured: 0, user_type: 'Student', domain: '', course: '',
        content: '', experience: '', qualification: '', apply_url: ''
      });
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const toggleFeatured = async (job: any) => {
    if (!isModerateAdmin) return;
    const is_featured = job.is_featured === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured })
      });
      if (res.ok) {
        setJobs(jobs.map(j => j.id === job.id ? { ...j, is_featured } : j));
      }
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Jobs & Internships</h2>
        <div className="flex items-center gap-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search jobs or companies..." />
          <button 
            onClick={() => {
              setEditingJob(null);
              setFormData({
                title: '', company: '', location: '', category: 'Engineering', sub_category: '', type: 'In Office', timing: 'Full Time',
                salary: '', is_internship: 0, is_competition: 0, is_featured: 0, user_type: 'Student', domain: '', course: '',
                content: '', experience: '', qualification: '', apply_url: ''
              });
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add New Listing'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="md:col-span-2 flex justify-between items-center border-b border-slate-100 pb-4 mb-2">
            <h3 className="font-bold text-slate-900">{editingJob ? 'Edit Listing' : 'New Listing'}</h3>
            {editingJob && <button type="button" onClick={() => { setEditingJob(null); setShowForm(false); }} className="text-xs text-slate-400 hover:text-slate-600">Clear Edit</button>}
          </div>
          <input placeholder="Job Title" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <input placeholder="Company Name" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
          <input placeholder="Location" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
          <input placeholder="Salary Range" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
          <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            {['Engineering', 'Finance', 'Marketing', 'BCA', 'BSc', 'Others'].map(c => <option key={c}>{c}</option>)}
          </select>
          {formData.category === 'Engineering' && (
            <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})}>
              <option value="">Select Branch</option>
              {['CS', 'IT', 'ECE', 'EE', 'ME', 'CE', 'CH', 'AE', 'IE', 'AI/ML', 'Others'].map(b => <option key={b}>{b}</option>)}
            </select>
          )}
          <input placeholder="Experience (e.g. 0-2 years)" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
          <input placeholder="Qualification (e.g. B.Tech)" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
          <input placeholder="Apply URL" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.apply_url} onChange={e => setFormData({...formData, apply_url: e.target.value})} />
          <textarea placeholder="Job Article Content (Markdown supported)" className="md:col-span-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[150px]" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option>In Office</option>
            <option>Hybrid</option>
            <option>Remote</option>
          </select>
          <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.timing} onChange={e => setFormData({...formData, timing: e.target.value})}>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Freelance</option>
          </select>
          <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.user_type} onChange={e => setFormData({...formData, user_type: e.target.value})}>
            <option>Student</option>
            <option>Professional</option>
            <option>Fresher</option>
            <option>Experienced</option>
          </select>
          <input placeholder="Domain (e.g. Web Dev)" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} />
          <input placeholder="Course (e.g. B.Tech)" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} />
          <div className="flex items-center gap-6 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <input type="checkbox" checked={formData.is_internship === 1} onChange={e => setFormData({...formData, is_internship: e.target.checked ? 1 : 0})} />
              Internship
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <input type="checkbox" checked={formData.is_competition === 1} onChange={e => setFormData({...formData, is_competition: e.target.checked ? 1 : 0})} />
              Competition
            </label>
          </div>
          <button type="submit" className="md:col-span-2 py-3 bg-navy-900 text-white rounded-xl font-bold">
            {editingJob ? 'Update Opportunity' : 'Post Opportunity'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
                job.is_internship ? "bg-emerald-500" : "bg-blue-500"
              )}>
                {job.company[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
                <div className="flex gap-2 mt-2">
                  {job.is_featured === 1 && <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold uppercase">Featured</span>}
                  {job.is_internship === 1 && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold uppercase">Internship</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isModerateAdmin && (
                <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-amber-50 hover:border-amber-200 transition-all group/feat">
                  <input 
                    type="checkbox" 
                    checked={job.is_featured === 1} 
                    onChange={() => toggleFeatured(job)}
                    className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    job.is_featured === 1 ? "text-amber-700" : "text-slate-500 group-hover/feat:text-amber-600"
                  )}>
                    Featured
                  </span>
                </label>
              )}
              <div className="flex gap-2">
                <button onClick={() => setEditingJob(job)} className="p-2 text-slate-400 hover:text-navy-700 transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(job.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationView({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const [showCatForm, setShowCatForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);

  const [newCatName, setNewCatName] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newMaterial, setNewMaterial] = useState({ title: '', download_url: '' });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (url: string, setter: (data: any) => void) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData('/api/education/categories', setCategories);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchData(`/api/education/branches?category_id=${selectedCategory.id}`, setBranches);
      setSelectedBranch(null);
      setSemesters([]);
      setSelectedSemester(null);
      setSubjects([]);
      setSelectedSubject(null);
      setMaterials([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedBranch) {
      fetchData(`/api/education/semesters?branch_id=${selectedBranch.id}`, setSemesters);
      setSelectedSemester(null);
      setSubjects([]);
      setSelectedSubject(null);
      setMaterials([]);
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedSemester) {
      fetchData(`/api/education/subjects?semester_id=${selectedSemester.id}`, setSubjects);
      setSelectedSubject(null);
      setMaterials([]);
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSubject) {
      fetchData(`/api/education/materials?subject_id=${selectedSubject.id}`, setMaterials);
    }
  }, [selectedSubject]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/education/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName })
      });
      if (res.ok) {
        const data = await res.json();
        setCategories([...categories, data]);
        setNewCatName('');
        setShowCatForm(false);
        showToast('Category added successfully');
      } else {
        showToast('Failed to add category', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBranch = async () => {
    if (!newBranchName.trim() || !selectedCategory) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/education/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: selectedCategory.id, name: newBranchName })
      });
      if (res.ok) {
        const data = await res.json();
        setBranches([...branches, data]);
        setNewBranchName('');
        setShowBranchForm(false);
        showToast('Branch added successfully');
      } else {
        showToast('Failed to add branch', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSubject = async () => {
    if (!newSubjectName.trim() || !selectedSemester) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/education/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semester_id: selectedSemester.id, name: newSubjectName })
      });
      if (res.ok) {
        const data = await res.json();
        setSubjects([...subjects, data]);
        setNewSubjectName('');
        setShowSubjectForm(false);
        showToast('Subject added successfully');
      } else {
        showToast('Failed to add subject', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMaterial = async () => {
    if (!newMaterial.title.trim() || !selectedSubject) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/education/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject_id: selectedSubject.id, ...newMaterial })
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials([...materials, data]);
        setNewMaterial({ title: '', download_url: '' });
        setShowMaterialForm(false);
        showToast('Material added successfully');
      } else {
        showToast('Failed to add material', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    try {
      const res = await fetch(`/api/education/materials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMaterials(materials.filter(m => m.id !== id));
        showToast('Material deleted successfully');
      } else {
        showToast('Failed to delete material', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 overflow-x-auto whitespace-nowrap pb-2">
          <button onClick={() => setSelectedCategory(null)} className={cn("hover:text-blue-600 transition-colors", !selectedCategory && "text-blue-600")}>Categories</button>
          {selectedCategory && (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <button onClick={() => setSelectedBranch(null)} className={cn("hover:text-blue-600 transition-colors", !selectedBranch && "text-blue-600")}>{selectedCategory.name}</button>
            </>
          )}
          {selectedBranch && (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <button onClick={() => setSelectedSemester(null)} className={cn("hover:text-blue-600 transition-colors", !selectedSemester && "text-blue-600")}>{selectedBranch.name}</button>
            </>
          )}
          {selectedSemester && (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <button onClick={() => setSelectedSubject(null)} className={cn("hover:text-blue-600 transition-colors", !selectedSubject && "text-blue-600")}>Semester {selectedSemester.number}</button>
            </>
          )}
          {selectedSubject && (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="text-blue-600">{selectedSubject.name}</span>
            </>
          )}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
          title="Refresh Data"
        >
          <Globe className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      {isLoading && !error && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Categories View */}
      {!selectedCategory && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{cat.name}</h3>
              <p className="text-sm text-slate-500 mt-2">Manage branches and materials for {cat.name}.</p>
            </button>
          ))}
          <button onClick={() => setShowCatForm(true)} className="bg-slate-50 p-8 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group">
            <Plus className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm font-bold text-slate-400 group-hover:text-blue-600">Add Category</span>
          </button>
        </div>
      )}

      {/* Branches View */}
      {selectedCategory && !selectedBranch && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {branches.map(br => (
            <button key={br.id} onClick={() => setSelectedBranch(br)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{br.name}</h3>
            </button>
          ))}
          <button onClick={() => setShowBranchForm(true)} className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group">
            <Plus className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
            <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600">Add Branch</span>
          </button>
        </div>
      )}

      {/* Semesters View */}
      {selectedBranch && !selectedSemester && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {semesters.map(sem => (
            <button key={sem.id} onClick={() => setSelectedSemester(sem)} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all text-center group">
              <span className="text-3xl font-black text-slate-100 group-hover:text-blue-100 transition-colors block mb-2">{sem.number}</span>
              <h3 className="font-bold text-slate-900">Semester {sem.number}</h3>
            </button>
          ))}
        </div>
      )}

      {/* Subjects View */}
      {selectedSemester && !selectedSubject && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Subjects for Semester {selectedSemester.number}</h3>
            <button onClick={() => setShowSubjectForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map(sub => (
              <button key={sub.id} onClick={() => setSelectedSubject(sub)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between group">
                <span className="font-bold text-slate-900 group-hover:text-blue-600">{sub.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Materials View */}
      {selectedSubject && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Materials for {selectedSubject.name}</h3>
            <div className="flex items-center gap-4">
              <SearchInput value={search} onChange={setSearch} placeholder="Search materials..." />
              <button onClick={() => setShowMaterialForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shrink-0">
                <Plus className="w-4 h-4" />
                Add Material
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredMaterials.map(mat => (
              <div key={mat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{mat.title}</p>
                    <a href={mat.download_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                      <Download className="w-3 h-3" />
                      Download Link
                    </a>
                  </div>
                </div>
                <button onClick={() => deleteMaterial(mat.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {filteredMaterials.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No materials found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showCatForm && (
        <Modal title="Add Category" onClose={() => setShowCatForm(false)}>
          <input 
            placeholder="Category Name (e.g. Engineering)" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            value={newCatName} 
            onChange={e => setNewCatName(e.target.value)} 
            disabled={isSubmitting}
          />
          <button 
            onClick={addCategory} 
            disabled={isSubmitting || !newCatName.trim()}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : 'Create Category'}
          </button>
        </Modal>
      )}

      {showBranchForm && (
        <Modal title="Add Branch" onClose={() => setShowBranchForm(false)}>
          <input 
            placeholder="Branch Name (e.g. CS)" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            value={newBranchName} 
            onChange={e => setNewBranchName(e.target.value)} 
            disabled={isSubmitting}
          />
          <button 
            onClick={addBranch} 
            disabled={isSubmitting || !newBranchName.trim()}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : 'Create Branch'}
          </button>
        </Modal>
      )}

      {showSubjectForm && (
        <Modal title="Add Subject" onClose={() => setShowSubjectForm(false)}>
          <input 
            placeholder="Subject Name" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            value={newSubjectName} 
            onChange={e => setNewSubjectName(e.target.value)} 
            disabled={isSubmitting}
          />
          <button 
            onClick={addSubject} 
            disabled={isSubmitting || !newSubjectName.trim()}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : 'Create Subject'}
          </button>
        </Modal>
      )}

      {showMaterialForm && (
        <Modal title="Add Material" onClose={() => setShowMaterialForm(false)}>
          <input 
            placeholder="Book/Material Title" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            value={newMaterial.title} 
            onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} 
            disabled={isSubmitting}
          />
          <input 
            placeholder="Drive/Download URL" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            value={newMaterial.download_url} 
            onChange={e => setNewMaterial({...newMaterial, download_url: e.target.value})} 
            disabled={isSubmitting}
          />
          <button 
            onClick={addMaterial} 
            disabled={isSubmitting || !newMaterial.title.trim()}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : 'Add Material'}
          </button>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder = "Search..." }: { value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
    </div>
  );
}

function UsersView({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        showToast('User deleted successfully');
      } else {
        showToast('Failed to delete user', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Users</h2>
        <SearchInput value={search} onChange={setSearch} placeholder="Search users by name or email..." />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="w-8 h-8 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {user.name?.[0] || 'U'}
                    </div>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-500">Recently</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CommunitiesView({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [communities, setCommunities] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', type: 'State', state: '', description: '', image_url: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/communities').then(res => res.json()).then(setCommunities);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newComm = await res.json();
        setCommunities([...communities, newComm]);
        setShowForm(false);
        setFormData({ name: '', type: 'State', state: '', description: '', image_url: '' });
        showToast('Community created successfully');
      } else {
        showToast('Failed to create community', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this community?')) return;
    try {
      const res = await fetch(`/api/communities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCommunities(communities.filter(c => c.id !== id));
        showToast('Community deleted successfully');
      } else {
        showToast('Failed to delete community', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.state && c.state.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Communities</h2>
        <div className="flex items-center gap-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search communities..." />
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Create Community'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Community Name</label>
            <input placeholder="e.g. Maharashtra Students Hub" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
            <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option>State</option>
              <option>Department</option>
              <option>Interest</option>
              <option>Exam Prep</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">State (Optional)</label>
            <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}>
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea placeholder="Describe this community..." className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Image URL</label>
            <input placeholder="https://..." className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
          </div>

          <button type="submit" disabled={isLoading} className="md:col-span-2 py-3 bg-navy-900 text-white rounded-xl font-bold disabled:opacity-50">
            {isLoading ? 'Launching...' : 'Launch Community'}
          </button>
        </form>
      )}

      {filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map(comm => (
            <div key={comm.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="h-32 bg-slate-100 relative">
                {comm.image_url ? (
                  <img src={comm.image_url} alt={comm.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy-50 text-navy-200">
                    <Users className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <button onClick={() => handleDelete(comm.id)} className="p-2 bg-white/90 backdrop-blur text-red-600 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{comm.name}</h3>
                  {comm.state && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">{comm.state}</span>}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{comm.description || 'No description provided.'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-navy-500 uppercase tracking-tighter bg-navy-50 px-1.5 py-0.5 rounded">{comm.type}</span>
                  <p className="text-[10px] text-slate-400 font-medium">{comm.members || 0} Members</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[40px] border border-slate-100 text-center">
          <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-navy-700" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">No Communities Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your search or create a new community.</p>
        </div>
      )}
    </div>
  );
}
function BlogsView({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'Engineering', author_id: 'admin-1',
    location: '', type: '', timing: '', user_type: ''
  });

  useEffect(() => {
    fetch('/api/blogs').then(res => res.json()).then(setBlogs);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newBlog = await res.json();
        setBlogs([newBlog, ...blogs]);
        setShowForm(false);
        setFormData({
          title: '', content: '', category: 'Engineering', author_id: 'admin-1',
          location: '', type: '', timing: '', user_type: ''
        });
        showToast('Blog published successfully');
      } else {
        showToast('Failed to publish blog', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== id));
        showToast('Blog deleted successfully');
      } else {
        showToast('Failed to delete blog', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Blogs</h2>
        <div className="flex items-center gap-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search blogs..." />
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Write Blog'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 gap-4 animate-in fade-in zoom-in-95 duration-200">
          <input placeholder="Blog Title" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <textarea placeholder="Content" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[200px]" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              {['Engineering', 'Finance', 'Marketing', 'BCA', 'BSc', 'Others'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Location" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="">Select Type</option>
              <option>In Office</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </select>
            <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.timing} onChange={e => setFormData({...formData, timing: e.target.value})}>
              <option value="">Select Timing</option>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Contract</option>
            </select>
            <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.user_type} onChange={e => setFormData({...formData, user_type: e.target.value})}>
              <option value="">Select User Type</option>
              <option>Student</option>
              <option>Professional</option>
              <option>Fresher</option>
            </select>
          </div>
          <button type="submit" className="py-3 bg-navy-900 text-white rounded-xl font-bold">Publish Blog</button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredBlogs.map(blog => (
          <div key={blog.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{blog.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase">{blog.category}</span>
                  {blog.location && <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-bold uppercase">{blog.location}</span>}
                  {blog.user_type && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold uppercase">{blog.user_type}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-navy-700 transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => deleteBlog(blog.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminsView({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'writer_admin' });

  useEffect(() => {
    fetch('/api/admins').then(res => res.json()).then(setAdmins);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newAdmin = await res.json();
        setAdmins([...admins, newAdmin]);
        setShowForm(false);
        setFormData({ name: '', email: '', role: 'writer_admin' });
        showToast('Admin added successfully');
      } else {
        showToast('Failed to add admin', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Admins</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Admin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-200">
          <input placeholder="Name" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input placeholder="Email" type="email" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="super_admin">Super Admin</option>
            <option value="moderate_admin">Moderate Admin</option>
            <option value="writer_admin">Writer Admin</option>
          </select>
          <button type="submit" className="md:col-span-3 py-3 bg-navy-900 text-white rounded-xl font-bold">Create Admin Account</button>
        </form>
      )}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{admin.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{admin.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-navy-50 text-navy-700 rounded text-[10px] font-bold uppercase">{admin.role.replace('_', ' ')}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CollegesView({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [colleges, setColleges] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [editingCollege, setEditingCollege] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Engineering', city: '', state: '', nirf_rank: '', website: ''
  });

  useEffect(() => {
    fetch('/api/colleges').then(res => res.json()).then(setColleges);
  }, []);

  useEffect(() => {
    if (editingCollege) {
      setFormData({ ...editingCollege });
      setShowForm(true);
    }
  }, [editingCollege]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCollege ? 'PATCH' : 'POST';
    const url = editingCollege ? `/api/colleges/${editingCollege.id}` : '/api/colleges';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const savedCol = await res.json();
        if (editingCollege) {
          setColleges(colleges.map(c => c.id === editingCollege.id ? savedCol : c));
          showToast('College updated successfully');
        } else {
          setColleges([...colleges, savedCol]);
          showToast('College added successfully');
        }
        setShowForm(false);
        setEditingCollege(null);
        setFormData({ name: '', category: 'Engineering', city: '', state: '', nirf_rank: '', website: '' });
      } else {
        showToast('Failed to save college', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Delete this college?')) {
      try {
        const res = await fetch(`/api/colleges/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setColleges(colleges.filter(c => c.id !== id));
          showToast('College deleted successfully');
        } else {
          showToast('Failed to delete college', 'error');
        }
      } catch (err) {
        showToast('Network error', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Colleges</h2>
        <div className="flex items-center gap-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search colleges, cities or states..." />
          <button 
            onClick={() => {
              setEditingCollege(null);
              setFormData({ name: '', category: 'Engineering', city: '', state: '', nirf_rank: '', website: '' });
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add College'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="md:col-span-2 flex justify-between items-center border-b border-slate-100 pb-4 mb-2">
            <h3 className="font-bold text-slate-900">{editingCollege ? 'Edit College' : 'New College'}</h3>
            {editingCollege && <button type="button" onClick={() => { setEditingCollege(null); setShowForm(false); }} className="text-xs text-slate-400 hover:text-slate-600">Clear Edit</button>}
          </div>
          <input placeholder="College Name" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option>Engineering</option>
            <option>Medical</option>
            <option>Management</option>
            <option>Law</option>
          </select>
          <input placeholder="City" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
          <input placeholder="State" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
          <input placeholder="NIRF Rank" type="number" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.nirf_rank} onChange={e => setFormData({...formData, nirf_rank: e.target.value})} />
          <input placeholder="Website URL" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
          <button type="submit" className="md:col-span-2 py-3 bg-navy-900 text-white rounded-xl font-bold">
            {editingCollege ? 'Update College' : 'Save College'}
          </button>
        </form>
      )}

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
            {filteredColleges.map(col => (
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
                    <button onClick={() => setEditingCollege(col)} className="p-1.5 text-slate-400 hover:text-navy-700 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(col.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
