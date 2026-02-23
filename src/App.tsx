/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  Users, 
  ChevronRight,
  TrendingUp,
  Star,
  User,
  Home,
  ChevronDown,
  Search,
  Settings,
  LogOut,
  Heart,
  Share2,
  HelpCircle,
  Zap,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  ArrowRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NAV_ITEMS } from './data';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import AdminPanel from './components/AdminPanel';

type Page = 'home' | 'education' | 'jobs' | 'college' | 'community' | 'admin';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for admin route
  useEffect(() => {
    if (window.location.pathname === '/fg-admin/fgi') {
      setActivePage('admin');
    }
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} />;
      case 'education':
        return <EducationPage />;
      case 'jobs':
        return <JobsPage />;
      case 'college':
        return <CollegePage />;
      case 'community':
        return <CommunityPage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  if (activePage === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] pb-24 font-sans selection:bg-navy-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('home')}>
              <div className="w-9 h-9 bg-[#1e3a5f] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-navy-900/20">
                FG
              </div>
              <span className="text-xl font-bold text-navy-900 tracking-tight">FresherGo</span>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsStudentMenuOpen(!isStudentMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <User className="w-4 h-4 text-navy-700" />
                <span>Student</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isStudentMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isStudentMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden"
                  >
                    {!isLoggedIn ? (
                      <div className="px-4 py-3 border-b border-slate-50">
                        <button 
                          onClick={() => setIsLoggedIn(true)}
                          className="w-full py-2.5 bg-[#1e3a5f] text-white rounded-xl font-bold text-sm shadow-lg shadow-navy-900/20 hover:bg-navy-800 transition-all active:scale-95"
                        >
                          Login / Signup
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-3">
                        <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center text-navy-700 font-bold">
                          JD
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">John Doe</p>
                          <p className="text-xs text-slate-500">Student</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="py-1">
                      <MenuLink icon={<User className="w-4 h-4" />} label="Profile" />
                      <MenuLink icon={<Star className="w-4 h-4" />} label="My Skills" />
                      <MenuLink icon={<Building2 className="w-4 h-4" />} label="My University" />
                      <MenuLink icon={<Heart className="w-4 h-4" />} label="Saved Jobs" />
                      <MenuLink icon={<BookOpen className="w-4 h-4" />} label="Saved Materials" />
                      <MenuLink icon={<Share2 className="w-4 h-4" />} label="Referral Dashboard" />
                    </div>
                    
                    <div className="border-t border-slate-50 py-1">
                      <MenuLink icon={<HelpCircle className="w-4 h-4" />} label="Contact Support" />
                      <div className="px-4 py-2">
                        <button className="w-full flex items-center justify-between px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors">
                          <span className="flex items-center gap-2">
                            <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Upgrade to Pro
                          </span>
                          <span className="bg-amber-200 px-1.5 py-0.5 rounded text-[8px] uppercase">Soon</span>
                        </button>
                      </div>
                      {isLoggedIn && (
                        <button 
                          onClick={() => setIsLoggedIn(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Persistent Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 px-6 py-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <NavButton 
            active={activePage === 'education'} 
            onClick={() => setActivePage('education')}
            icon={<BookOpen className="w-6 h-6" />}
            label="Education"
          />
          <NavButton 
            active={activePage === 'jobs'} 
            onClick={() => setActivePage('jobs')}
            icon={<Briefcase className="w-6 h-6" />}
            label="Jobs"
          />
          
          <button 
            onClick={() => setActivePage('home')}
            className="relative -top-8 group"
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110 group-active:scale-95",
              activePage === 'home' ? "bg-[#1e3a5f] shadow-navy-900/30" : "bg-slate-400 shadow-slate-400/30"
            )}>
              <Home className="w-7 h-7" />
            </div>
          </button>

          <NavButton 
            active={activePage === 'college'} 
            onClick={() => setActivePage('college')}
            icon={<GraduationCap className="w-6 h-6" />}
            label="College"
          />
          <NavButton 
            active={activePage === 'community'} 
            onClick={() => setActivePage('community')}
            icon={<Users className="w-6 h-6" />}
            label="Community"
          />
        </div>
      </nav>
    </div>
  );
}

function MenuLink({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-navy-700 transition-colors">
      <span className="text-slate-400">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 p-2 transition-all hover:scale-110",
        active ? "text-[#1e3a5f]" : "text-slate-400"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function HomePage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="py-16 text-center px-4 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4 tracking-tight"
        >
          Welcome to FresherGo
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 text-lg font-medium max-w-2xl mx-auto"
        >
          Your complete student ecosystem for success
        </motion.p>
      </section>

      <section className="max-w-5xl mx-auto w-full px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {NAV_ITEMS.map((item, idx) => (
            <motion.button 
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActivePage(item.label.toLowerCase() as Page)}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 group"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm",
                item.bgColor
              )}>
                {item.label === 'Education' && <BookOpen className={cn("w-7 h-7", item.color)} />}
                {item.label === 'Jobs' && <Briefcase className={cn("w-7 h-7", item.color)} />}
                {item.label === 'College' && <GraduationCap className={cn("w-7 h-7", item.color)} />}
                {item.label === 'Community' && <Users className={cn("w-7 h-7", item.color)} />}
              </div>
              <span className="text-base font-bold text-slate-800">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-4 mb-16">
        <SectionHeader title="Trending Jobs" icon={<TrendingUp className="w-5 h-5" />} onSeeAll={() => setActivePage('jobs')} />
        <EmptyState icon={<Briefcase className="w-8 h-8" />} title="No jobs yet" description="Admin will add job listings soon. Stay tuned for exciting opportunities!" />
      </section>

      <section className="max-w-5xl mx-auto w-full px-4 mb-20">
        <SectionHeader title="Popular Materials" icon={<Star className="w-5 h-5" />} onSeeAll={() => setActivePage('education')} />
        <EmptyState icon={<BookOpen className="w-8 h-8" />} title="No materials yet" description="Admin will add study materials soon. Get ready to boost your learning!" />
      </section>
    </div>
  );
}

function SectionHeader({ title, icon, onSeeAll }: { title: string, icon: React.ReactNode, onSeeAll: () => void }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-navy-50 rounded-lg text-navy-700">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-navy-900">{title}</h2>
      </div>
      <button onClick={onSeeAll} className="text-sm font-bold text-navy-700 flex items-center gap-1 hover:underline group">
        View all
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white rounded-[32px] border-2 border-dashed border-slate-200 p-16 flex flex-col items-center justify-center text-center group hover:border-navy-200 transition-colors">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <span className="text-slate-300">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-navy-900 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-xs mx-auto">{description}</p>
    </div>
  );
}

function EducationPage() {
  const [view, setView] = useState<'hub' | 'study' | 'placement' | 'dept' | 'feed'>('hub');

  if (view === 'study') return <StudyMaterialView onBack={() => setView('hub')} />;
  if (view === 'placement') return <PlacementMaterialView onBack={() => setView('hub')} />;

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-extrabold text-navy-900 mb-8">Education Hub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <EduCard 
          onClick={() => setView('study')}
          title="Study Material" 
          desc="University notes, videos & questions" 
          icon={<BookOpen className="w-8 h-8" />} 
          color="bg-blue-500"
        />
        <EduCard 
          onClick={() => setView('placement')}
          title="Placement Material" 
          desc="Interview prep, DSA & Aptitude" 
          icon={<Zap className="w-8 h-8" />} 
          color="bg-amber-500"
        />
        <EduCard 
          onClick={() => setView('dept')}
          title="Department Wise" 
          desc="CSE, IT, AI & Data Science resources" 
          icon={<Users className="w-8 h-8" />} 
          color="bg-emerald-500"
        />
        <EduCard 
          onClick={() => setView('feed')}
          title="Personalized Feed" 
          desc="Materials based on your interests" 
          icon={<Star className="w-8 h-8" />} 
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Recent Updates</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-navy-700 shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Data Structures & Algorithms</p>
                  <p className="text-xs text-slate-500">New notes added for Semester 4</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudyMaterialView({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1); // 1: Uni, 2: Course, 3: Year/Sem, 4: Subject/Topic
  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-navy-700 font-bold mb-8 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back to Education
      </button>
      <h1 className="text-3xl font-extrabold text-navy-900 mb-8">Study Material</h1>
      
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Select University</h2>
            <div className="grid grid-cols-1 gap-4">
              {['State Technical University', 'National Institute of Tech', 'Global University'].map(u => (
                <button key={u} onClick={() => setStep(2)} className="p-6 text-left bg-slate-50 rounded-2xl font-bold text-slate-700 hover:bg-navy-50 hover:text-navy-700 transition-all border border-transparent hover:border-navy-100">
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Select Course</h2>
            <div className="grid grid-cols-1 gap-4">
              {['Computer Science', 'Information Technology', 'Electronics', 'Mechanical'].map(c => (
                <button key={c} onClick={() => setStep(3)} className="p-6 text-left bg-slate-50 rounded-2xl font-bold text-slate-700 hover:bg-navy-50 hover:text-navy-700 transition-all border border-transparent hover:border-navy-100">
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        {step >= 3 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-navy-700" />
            </div>
            <p className="text-slate-500 font-medium">Filtering logic implemented. Content coming soon!</p>
            <button onClick={() => setStep(1)} className="mt-6 text-navy-700 font-bold hover:underline">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PlacementMaterialView({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-navy-700 font-bold mb-8 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back to Education
      </button>
      <h1 className="text-3xl font-extrabold text-navy-900 mb-8">Placement Material</h1>
      
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search company (e.g. Google, TCS, Infosys)..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-lg focus:ring-2 focus:ring-navy-500 outline-none shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro'].map(c => (
          <button key={c} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-navy-700 font-bold text-xl group-hover:scale-110 transition-transform">
              {c[0]}
            </div>
            <span className="font-bold text-slate-800">{c}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EduCard({ title, desc, icon, color, onClick }: { title: string, desc: string, icon: React.ReactNode, color: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-6 p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-navy-900 mb-1 group-hover:text-navy-700 transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 font-medium">{desc}</p>
      </div>
    </button>
  );
}

function JobsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-navy-900">Job Portal</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-navy-500 outline-none transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-navy-700 border border-slate-100">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-900 group-hover:text-navy-700 transition-colors">Software Engineer Intern</h3>
                  <p className="text-slate-500 font-medium">TechCorp Solutions</p>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-navy-700 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <JobTag icon={<MapPin className="w-3 h-3" />} label="Remote" />
              <JobTag icon={<Clock className="w-3 h-3" />} label="Full-time" />
              <JobTag icon={<DollarSign className="w-3 h-3" />} label="$45k - $60k" />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-navy-50 text-navy-700 rounded-lg text-xs font-bold">React</span>
                <span className="px-3 py-1 bg-navy-50 text-navy-700 rounded-lg text-xs font-bold">Node.js</span>
              </div>
              <button className="px-6 py-2 bg-[#1e3a5f] text-white rounded-xl font-bold text-sm hover:bg-navy-800 transition-all active:scale-95">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobTag({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function CollegePage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [category, setCategory] = useState('Engineering');

  useEffect(() => {
    fetch('/api/colleges').then(res => res.json()).then(setColleges);
  }, []);

  const filteredColleges = colleges.filter(c => c.category === category);

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-extrabold text-navy-900 mb-8">College Directory</h1>
      
      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search colleges, courses..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-lg focus:ring-2 focus:ring-navy-500 outline-none shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <CategoryBtn label="Engineering" active={category === 'Engineering'} onClick={() => setCategory('Engineering')} />
        <CategoryBtn label="Management" active={category === 'Management'} onClick={() => setCategory('Management')} />
        <CategoryBtn label="Medical" active={category === 'Medical'} onClick={() => setCategory('Medical')} />
        <CategoryBtn label="Others" active={category === 'Others'} onClick={() => setCategory('Others')} />
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-navy-900">{category} Colleges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredColleges.length > 0 ? filteredColleges.map((col, i) => (
            <div key={col.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="h-48 bg-slate-200 relative">
                <img src={`https://picsum.photos/seed/${col.id}/800/400`} className="w-full h-full object-cover" alt="College" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-navy-700 shadow-sm">
                  NIRF #{col.nirf_rank}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">{col.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{col.city}, {col.state}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-slate-700">{col.rating}</span>
                  </div>
                  <button className="text-navy-700 font-bold text-sm flex items-center gap-1 hover:underline">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium">
              No colleges found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryBtn({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "py-4 rounded-2xl font-bold text-sm transition-all shadow-sm",
        active ? "bg-[#1e3a5f] text-white shadow-navy-900/20" : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}

function CommunityPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-navy-900 mb-2">Communities</h1>
          <p className="text-slate-500 font-medium">Connect, collaborate, and grow with your peers.</p>
        </div>
        <button className="px-6 py-3 bg-navy-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-navy-900/20 hover:bg-navy-800 transition-all active:scale-95 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Community
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <CommunityCategoryCard 
          title="State Groups" 
          count="28 Groups" 
          icon={<MapPin className="w-6 h-6" />} 
          color="bg-blue-500"
          desc="Connect with students from your home state."
        />
        <CommunityCategoryCard 
          title="Departments" 
          count="15 Groups" 
          icon={<Building2 className="w-6 h-6" />} 
          color="bg-emerald-500"
          desc="Discuss subjects with peers in your field."
        />
        <CommunityCategoryCard 
          title="Interests" 
          count="42 Groups" 
          icon={<Zap className="w-6 h-6" />} 
          color="bg-amber-500"
          desc="Find people who share your passions."
        />
      </div>

      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-navy-900/5 relative overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-64 h-64 bg-navy-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32 opacity-50 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-navy-900 rounded-[32px] flex items-center justify-center shadow-2xl shadow-navy-900/40 shrink-0">
            <Users className="w-12 h-12 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">The Hub is Evolving</h2>
            <p className="text-slate-500 text-lg max-w-xl mb-8 leading-relaxed">
              We're building a sophisticated space for student interactions. Admin-curated channels and moderated sections are coming soon to ensure a high-quality experience.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">Verified Members</span>
              <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">Resource Sharing</span>
              <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">Expert Mentorship</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-navy-900">Trending Communities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeaturedCommunityCard name="WB Engineers" members="12.4k" category="State" />
          <FeaturedCommunityCard name="UI/UX Designers" members="8.2k" category="Interest" />
          <FeaturedCommunityCard name="CSE 2026 Batch" members="5.1k" category="Department" />
          <FeaturedCommunityCard name="Competitive Coding" members="15.7k" category="Interest" />
        </div>
      </div>
    </div>
  );
}

function CommunityCategoryCard({ title, count, icon, color, desc }: { title: string, count: string, icon: React.ReactNode, color: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", color)}>
        {icon}
      </div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-navy-900">{title}</h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{count}</span>
      </div>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function FeaturedCommunityCard({ name, members, category }: { name: string, members: string, category: string }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-navy-700 font-bold group-hover:bg-navy-50 transition-colors">
          {name[0]}
        </div>
        <div>
          <p className="font-bold text-slate-900">{name}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{members} members</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-tighter">{category}</span>
          </div>
        </div>
      </div>
      <button className="px-4 py-1.5 bg-slate-50 text-navy-700 rounded-full text-xs font-bold hover:bg-navy-900 hover:text-white transition-all">
        Join
      </button>
    </div>
  );
}
