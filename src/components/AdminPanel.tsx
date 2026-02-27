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

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ colleges: 0, jobs: 0, users: 0, materials: 0 });
  const [currentUser, setCurrentUser] = useState<any>({ name: 'Suhrid', role: 'super_admin' }); // Mocking super admin for now

  useEffect(() => {
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
          users: 3,
          materials: 3
        });
      } catch (err) {
        console.error(err);
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
              <SidebarLink active={activeTab === 'admins'} onClick={() => setActiveTab('admins')} icon={<Users className="w-5 h-5" />} label="Manage Admins" />
              <SidebarLink active={activeTab === 'communities'} onClick={() => setActiveTab('communities')} icon={<Users className="w-5 h-5" />} label="Communities" />
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex flex-col gap-2 px-4 py-3">
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
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'dashboard' && <DashboardView stats={stats} />}
          {activeTab === 'colleges' && isModerateAdmin && <CollegesView />}
          {activeTab === 'jobs' && isModerateAdmin && <JobsView userRole={currentUser.role} />}
          {activeTab === 'education' && isModerateAdmin && <EducationView />}
          {activeTab === 'blogs' && isWriterAdmin && <BlogsView />}
          {activeTab === 'admins' && isSuperAdmin && <AdminsView />}
          {activeTab === 'communities' && isSuperAdmin && <CommunitiesView />}
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
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics').then(res => res.json()).then(setAnalytics);
  }, []);

  if (!analytics) return <div className="p-8 text-center">Loading analytics...</div>;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Colleges" value={stats.colleges} icon={<Building2 className="w-6 h-6" />} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Active Jobs" value={stats.jobs} icon={<Briefcase className="w-6 h-6" />} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Total Users" value={stats.users} icon={<Users className="w-6 h-6" />} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Materials" value={stats.materials} icon={<BookOpen className="w-6 h-6" />} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            User Growth (Monthly)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs by Category */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-500" />
            Jobs by Category
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={analytics.jobs}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {analytics.jobs.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Colleges by Category */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" />
            Colleges by Category
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.colleges}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="category"
                >
                  {analytics.colleges.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { title: 'New Job: SDE Intern', time: '10 mins ago', icon: <Plus className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600' },
              { title: 'New Blog: Engineering Prep', time: '1 hour ago', icon: <FileText className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600' },
              { title: 'New College: IIT Bombay', time: '3 hours ago', icon: <Building2 className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600' },
              { title: 'User Signed Up: Amit Kumar', time: '5 hours ago', icon: <Users className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", activity.color)}>
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
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

function JobsView({ userRole }: { userRole: string }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', category: 'Engineering', sub_category: '', type: 'In Office', timing: 'Full Time',
    salary: '', is_internship: 0, is_competition: 0, is_featured: 0, user_type: 'Student', domain: '', course: '',
    content: '', experience: '', qualification: '', apply_url: ''
  });
  const isModerateAdmin = userRole === 'moderate_admin' || userRole === 'super_admin';

  useEffect(() => {
    fetch('/api/jobs').then(res => res.json()).then(setJobs);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const newJob = await res.json();
      setJobs([newJob, ...jobs]);
      setShowForm(false);
      setFormData({
        title: '', company: '', location: '', category: 'Engineering', sub_category: '', type: 'In Office', timing: 'Full Time',
        salary: '', is_internship: 0, is_competition: 0, is_featured: 0, user_type: 'Student', domain: '', course: '',
        content: '', experience: '', qualification: '', apply_url: ''
      });
    }
  };

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
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add New Listing'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
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
              {['CS', 'IT', 'ECE', 'EE', 'ME', 'CE', 'CH', 'AE', 'IE', 'Others'].map(b => <option key={b}>{b}</option>)}
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
          <button type="submit" className="md:col-span-2 py-3 bg-navy-900 text-white rounded-xl font-bold">Post Opportunity</button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {jobs.map(job => (
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
                <button className="p-2 text-slate-400 hover:text-navy-700 transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(job.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationView() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);

  const [showCatForm, setShowCatForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);

  const [newCatName, setNewCatName] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newMaterial, setNewMaterial] = useState({ title: '', download_url: '' });

  useEffect(() => {
    fetch('/api/education/categories').then(res => res.json()).then(setCategories);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`/api/education/branches?category_id=${selectedCategory.id}`).then(res => res.json()).then(setBranches);
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
      fetch(`/api/education/semesters?branch_id=${selectedBranch.id}`).then(res => res.json()).then(setSemesters);
      setSelectedSemester(null);
      setSubjects([]);
      setSelectedSubject(null);
      setMaterials([]);
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedSemester) {
      fetch(`/api/education/subjects?semester_id=${selectedSemester.id}`).then(res => res.json()).then(setSubjects);
      setSelectedSubject(null);
      setMaterials([]);
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSubject) {
      fetch(`/api/education/materials?subject_id=${selectedSubject.id}`).then(res => res.json()).then(setMaterials);
    }
  }, [selectedSubject]);

  const addCategory = async () => {
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
    }
  };

  const addBranch = async () => {
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
    }
  };

  const addSubject = async () => {
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
    }
  };

  const addMaterial = async () => {
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
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Breadcrumbs */}
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

      {/* Categories View */}
      {!selectedCategory && (
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
            <button onClick={() => setShowMaterialForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
              <Plus className="w-4 h-4" />
              Add Material
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {materials.map(mat => (
              <div key={mat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
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
                <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No materials added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showCatForm && (
        <Modal title="Add Category" onClose={() => setShowCatForm(false)}>
          <input placeholder="Category Name (e.g. Engineering)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
          <button onClick={addCategory} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Create Category</button>
        </Modal>
      )}

      {showBranchForm && (
        <Modal title="Add Branch" onClose={() => setShowBranchForm(false)}>
          <input placeholder="Branch Name (e.g. CS)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4" value={newBranchName} onChange={e => setNewBranchName(e.target.value)} />
          <button onClick={addBranch} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Create Branch</button>
        </Modal>
      )}

      {showSubjectForm && (
        <Modal title="Add Subject" onClose={() => setShowSubjectForm(false)}>
          <input placeholder="Subject Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} />
          <button onClick={addSubject} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Create Subject</button>
        </Modal>
      )}

      {showMaterialForm && (
        <Modal title="Add Material" onClose={() => setShowMaterialForm(false)}>
          <input placeholder="Book/Material Title" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4" value={newMaterial.title} onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} />
          <input placeholder="Drive/Download URL" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4" value={newMaterial.download_url} onChange={e => setNewMaterial({...newMaterial, download_url: e.target.value})} />
          <button onClick={addMaterial} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Add Material</button>
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

function CommunitiesView() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'State' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mocking API call for now as backend endpoint isn't fully ready for communities
    const newComm = { id: Math.random().toString(36).substr(2, 9), ...formData, members: '0' };
    setCommunities([...communities, newComm]);
    setShowForm(false);
    setFormData({ name: '', type: 'State' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Communities</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Create Community'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
          <input placeholder="Community Name" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <select className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option>State</option>
            <option>Department</option>
            <option>Interest</option>
            <option>Exam Prep</option>
          </select>
          <button type="submit" className="md:col-span-2 py-3 bg-navy-900 text-white rounded-xl font-bold">Launch Community</button>
        </form>
      )}

      {communities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(comm => (
            <div key={comm.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{comm.name}</h3>
                <p className="text-xs text-slate-500">{comm.type} • {comm.members} Members</p>
              </div>
              <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[40px] border border-slate-100 text-center">
          <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-navy-700" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">No Communities Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Start by creating a new community for students to join and interact.</p>
        </div>
      )}
    </div>
  );
}
function BlogsView() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'Engineering', author_id: 'admin-1',
    location: '', type: '', timing: '', user_type: ''
  });

  useEffect(() => {
    fetch('/api/blogs').then(res => res.json()).then(setBlogs);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Blogs</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Write Blog'}
        </button>
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
        {blogs.map(blog => (
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
                <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminsView() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'writer_admin' });

  useEffect(() => {
    fetch('/api/admins').then(res => res.json()).then(setAdmins);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

function CollegesView() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'Engineering', city: '', state: '', nirf_rank: '', website: ''
  });

  useEffect(() => {
    fetch('/api/colleges').then(res => res.json()).then(setColleges);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/colleges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const newCol = await res.json();
      setColleges([...colleges, newCol]);
      setShowForm(false);
      setFormData({ name: '', category: 'Engineering', city: '', state: '', nirf_rank: '', website: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this college?')) {
      await fetch(`/api/colleges/${id}`, { method: 'DELETE' });
      setColleges(colleges.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Colleges</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm hover:bg-navy-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add College'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
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
          <button type="submit" className="md:col-span-2 py-3 bg-navy-900 text-white rounded-xl font-bold">Save College</button>
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
