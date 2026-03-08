/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid,
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
  Plus,
  Code,
  BarChart,
  Megaphone,
  PenTool,
  Wrench,
  CheckCircle,
  X,
  Calendar,
  SortAsc,
  SortDesc,
  ArrowLeft,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  FileText,
  Download
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NAV_ITEMS } from './data';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import AdminPanel from './components/AdminPanel';
import AdSlot from './components/AdSlot';

type Page = 'home' | 'education' | 'jobs' | 'college' | 'community' | 'admin';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('education');
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  // Check for admin route
  useEffect(() => {
    if (window.location.pathname === '/fgi-admin') {
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
  const [trendingJobs, setTrendingJobs] = useState<any[]>([]);
  const [popularMaterials, setPopularMaterials] = useState<any[]>([]);
  const [featuredColleges, setFeaturedColleges] = useState<any[]>([]);
  const [trendingCommunities, setTrendingCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [jobsRes, prepRes, collegesRes, commsRes] = await Promise.all([
          fetch('/api/jobs?is_featured=true'),
          fetch('/api/preparation'),
          fetch('/api/colleges'),
          fetch('/api/communities')
        ]);
        setTrendingJobs(await jobsRes.json());
        setPopularMaterials(await prepRes.json());
        setFeaturedColleges(await collegesRes.json());
        setTrendingCommunities(await commsRes.json());
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8">
      {/* Quick Navigation - Now at the top */}
      <section className="max-w-7xl mx-auto w-full px-4 mb-16">
        <div className="flex flex-wrap justify-center gap-6">
          {NAV_ITEMS.map((item, idx) => (
            <motion.button 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActivePage(item.label.toLowerCase() as Page)}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3 group"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm",
                item.bgColor
              )}>
                {item.label === 'Education' && <BookOpen className={cn("w-6 h-6", item.color)} />}
                {item.label === 'Jobs' && <Briefcase className={cn("w-6 h-6", item.color)} />}
                {item.label === 'College' && <GraduationCap className={cn("w-6 h-6", item.color)} />}
                {item.label === 'Community' && <Users className={cn("w-6 h-6", item.color)} />}
              </div>
              <span className="text-base font-bold text-slate-800">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured Feed */}
      <div className="max-w-7xl mx-auto w-full px-4 space-y-20 pb-20">
        {/* Trending Jobs Section */}
        <section>
          <SectionHeader title="Featured Opportunities" icon={<TrendingUp className="w-5 h-5" />} onSeeAll={() => setActivePage('jobs')} />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[32px] animate-pulse" />)}
            </div>
          ) : trendingJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendingJobs.slice(0, 4).map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  featured 
                  onClick={() => {
                    // Navigate to jobs page and select this job
                    // For now, just navigate to jobs page
                    setActivePage('jobs');
                  }} 
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={<Briefcase className="w-8 h-8" />} title="No jobs yet" description="Admin will add job listings soon. Stay tuned for exciting opportunities!" />
          )}
        </section>

        <AdSlot slot="home_between_sections" />

        {/* Popular Materials Section */}
        <section>
          <SectionHeader title="Top Resources" icon={<Star className="w-5 h-5" />} onSeeAll={() => setActivePage('education')} />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[32px] animate-pulse" />)}
            </div>
          ) : popularMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularMaterials.slice(0, 3).map(prep => (
                <div key={prep.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                  <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center text-navy-700 mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{prep.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">Master {prep.role_name} concepts with curated resources.</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-navy-600 uppercase tracking-wider">{prep.type}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-navy-700 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<BookOpen className="w-8 h-8" />} title="No materials yet" description="Admin will add study materials soon. Get ready to boost your learning!" />
          )}
        </section>

        {/* Featured Colleges Section */}
        <section>
          <SectionHeader title="Top Rated Colleges" icon={<GraduationCap className="w-5 h-5" />} onSeeAll={() => setActivePage('college')} />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[32px] animate-pulse" />)}
            </div>
          ) : featuredColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredColleges.slice(0, 3).map(college => (
                <div key={college.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      NIRF #{college.nirf_rank}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold">{college.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2 line-clamp-1">{college.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {college.city}, {college.state}
                  </p>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-navy-600 uppercase tracking-tighter">{college.category}</span>
                    <button className="text-xs font-bold text-navy-700 hover:underline">Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<GraduationCap className="w-8 h-8" />} title="No colleges yet" description="We are adding more colleges to our database. Check back soon!" />
          )}
        </section>

        {/* Trending Communities Section */}
        <section>
          <SectionHeader title="Active Communities" icon={<Users className="w-5 h-5" />} onSeeAll={() => setActivePage('community')} />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-[32px] animate-pulse" />)}
            </div>
          ) : trendingCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingCommunities.slice(0, 4).map(comm => (
                <div key={comm.id} className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-700 font-bold group-hover:scale-110 transition-transform">
                    {comm.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{comm.name}</p>
                    <p className="text-[10px] font-bold text-navy-600 uppercase tracking-tighter">{comm.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Users className="w-8 h-8" />} title="No communities yet" description="Join or create a community to connect with other students!" />
          )}
        </section>
      </div>
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
  const [view, setView] = useState<'hub' | 'study' | 'placement' | 'dept' | 'feed'>('study');

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

      <AdSlot slot="education_hub_middle" />

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
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/education/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`/api/education/branches?category_id=${selectedCategory.id}`).then(res => res.json()).then(setBranches);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedBranch) {
      fetch(`/api/education/semesters?branch_id=${selectedBranch.id}`).then(res => res.json()).then(setSemesters);
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedSemester) {
      fetch(`/api/education/subjects?semester_id=${selectedSemester.id}`).then(res => res.json()).then(setSubjects);
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSubject) {
      fetch(`/api/education/materials?subject_id=${selectedSubject.id}`).then(res => res.json()).then(setMaterials);
    }
  }, [selectedSubject]);

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-navy-900" />
        </button>
        <h1 className="text-3xl font-extrabold text-navy-900">Study Materials</h1>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => { setSelectedCategory(null); setSelectedBranch(null); setSelectedSemester(null); setSelectedSubject(null); }} className={cn("hover:text-blue-600", !selectedCategory && "text-blue-600")}>Categories</button>
        {selectedCategory && (
          <>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <button onClick={() => { setSelectedBranch(null); setSelectedSemester(null); setSelectedSubject(null); }} className={cn("hover:text-blue-600", !selectedBranch && "text-blue-600")}>{selectedCategory.name}</button>
          </>
        )}
        {selectedBranch && (
          <>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <button onClick={() => { setSelectedSemester(null); setSelectedSubject(null); }} className={cn("hover:text-blue-600", !selectedSemester && "text-blue-600")}>{selectedBranch.name}</button>
          </>
        )}
        {selectedSemester && (
          <>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <button onClick={() => { setSelectedSubject(null); }} className={cn("hover:text-blue-600", !selectedSubject && "text-blue-600")}>Semester {selectedSemester.number}</button>
          </>
        )}
        {selectedSubject && (
          <>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-blue-600">{selectedSubject.name}</span>
          </>
        )}
      </div>

      {/* Selection Grid */}
      {!selectedCategory && (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[40px] animate-pulse" />)}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-slate-500">Access curated notes and resources for {cat.name}.</p>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState icon={<BookOpen className="w-8 h-8" />} title="No categories found" description="We are adding more study materials. Please check back later!" />
        )
      )}

      {selectedCategory && !selectedBranch && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {branches.map(br => (
            <button key={br.id} onClick={() => setSelectedBranch(br)} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group">
              <h3 className="font-bold text-navy-900 group-hover:text-blue-600 transition-colors">{br.name}</h3>
            </button>
          ))}
        </div>
      )}

      {selectedBranch && !selectedSemester && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {semesters.map(sem => (
            <button key={sem.id} onClick={() => setSelectedSemester(sem)} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
              <span className="text-4xl font-black text-slate-50 group-hover:text-blue-50 transition-colors block mb-2">{sem.number}</span>
              <h3 className="font-bold text-navy-900">Semester {sem.number}</h3>
            </button>
          ))}
        </div>
      )}

      {selectedSemester && !selectedSubject && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map(sub => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between group">
              <span className="font-bold text-navy-900 group-hover:text-blue-600">{sub.name}</span>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
          {subjects.length === 0 && (
            <div className="md:col-span-2 text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No subjects added for this semester yet.</p>
            </div>
          )}
        </div>
      )}

      {selectedSubject && (
        <div className="grid grid-cols-1 gap-4">
          {materials.map(mat => (
            <div key={mat.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-700">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900">{mat.title}</h3>
                  <p className="text-xs text-slate-500">Educational Resource</p>
                </div>
              </div>
              <a 
                href={mat.download_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-2xl font-bold text-sm hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          ))}
          {materials.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No materials available for this subject yet.</p>
            </div>
          )}
        </div>
      )}
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
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/api/jobs?sort=${sortOrder}`;
        if (activeCategory !== 'All') url += `&category=${encodeURIComponent(activeCategory)}`;
        if (activeSubCategory) url += `&sub_category=${encodeURIComponent(activeSubCategory)}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
        
        const res = await fetch(url);
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, activeSubCategory, searchQuery, sortOrder]);

  const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Engineering', icon: Building2, sub: ['CS', 'IT', 'ECE', 'EE', 'ME', 'CE', 'CH', 'AE', 'IE', 'AI/ML', 'Others'] },
    { name: 'Finance', icon: DollarSign },
    { name: 'Marketing', icon: Megaphone },
    { name: 'BCA', icon: Code },
    { name: 'BSc', icon: GraduationCap },
  ];

  if (selectedJob) {
    return <JobDetailView job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search jobs, companies, or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>

        {/* Sort and Category Filters */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filters & Sort</h2>
            <button 
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              {sortOrder === 'newest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>

          {/* Main Categories */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat.name} 
                onClick={() => {
                  setActiveCategory(cat.name);
                  setActiveSubCategory('');
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all shrink-0 shadow-sm",
                  activeCategory === cat.name 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                )}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sub Categories for Engineering */}
          {activeCategory === 'Engineering' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide bg-blue-50/50 p-2 rounded-2xl border border-blue-100"
            >
              <button 
                onClick={() => setActiveSubCategory('')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0",
                  activeSubCategory === '' ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-200"
                )}
              >
                All Branches
              </button>
              {categories.find(c => c.name === 'Engineering')?.sub?.map(sub => (
                <button 
                  key={sub} 
                  onClick={() => setActiveSubCategory(sub)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0",
                    activeSubCategory === sub ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-200"
                  )}
                >
                  {sub}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <AdSlot slot="jobs_top_banner" />

        {/* Jobs List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Fetching opportunities...</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map(job => <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />)
          ) : (
            <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, featured = false, onClick }: { job: any, featured?: boolean, onClick?: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        "bg-white p-6 rounded-[24px] border shadow-sm hover:shadow-md transition-all cursor-pointer group",
        featured ? "border-amber-200 bg-amber-50/10" : "border-slate-200"
      )}
    >
      {/* Line 1: Logo + Title & Company */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400 text-xl border border-slate-100 group-hover:border-blue-200 transition-colors overflow-hidden shrink-0 shadow-inner">
          {job.logo && (job.logo.startsWith('http') || job.logo.startsWith('data:')) ? (
            <img src={job.logo} alt={job.company} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
          ) : (
            <span>{job.logo || job.company[0]}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight mb-0.5">
            {job.title}
          </h3>
          <p className="text-sm font-bold text-blue-600 truncate">{job.company}</p>
        </div>
      </div>

      {/* Line 2: Job/Internship | Salary | Experience | Qualification */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-blue-500" />
          <span className="capitalize">{job.is_internship ? 'Internship' : 'Job'}</span>
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span>{job.salary || 'Not disclosed'}</span>
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>{job.experience || 'Fresher'}</span>
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-purple-500" />
          <span>{job.qualification || 'Any Graduate'}</span>
        </div>
      </div>
    </motion.div>
  );
}

function JobDetailView({ job, onBack }: { job: any, onBack: () => void }) {
  const shareUrl = window.location.href;
  
  const getShareLink = (platform: string) => {
    const utm = `?utm_source=${platform}&utm_medium=social&utm_campaign=job_share`;
    const finalUrl = encodeURIComponent(shareUrl + utm);
    const text = encodeURIComponent(`Check out this job: ${job.title} at ${job.company}`);
    
    switch (platform) {
      case 'facebook': return `https://www.facebook.com/sharer/sharer.php?u=${finalUrl}`;
      case 'twitter': return `https://twitter.com/intent/tweet?url=${finalUrl}&text=${text}`;
      case 'linkedin': return `https://www.linkedin.com/sharing/share-offsite/?url=${finalUrl}`;
      case 'whatsapp': return `https://api.whatsapp.com/send?text=${text}%20${finalUrl}`;
      default: return '';
    }
  };

  return (
    <div className="bg-white min-h-screen animate-in slide-in-from-right duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Jobs
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center font-bold text-slate-400 text-3xl border border-slate-100">
              {job.logo || job.company[0]}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{job.title}</h1>
              <p className="text-xl font-bold text-blue-600">{job.company}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <a 
              href={job.apply_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Apply Now
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="prose prose-slate max-w-none">
              <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-blue-500" />
                  Job Article
                </h2>
                <div className="markdown-body">
                  <Markdown>{job.content || job.description || 'No detailed description available.'}</Markdown>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Quick Info</h3>
              <div className="space-y-4">
                <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value={job.location} />
                <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Type" value={job.is_internship ? 'Internship' : 'Full-time Job'} />
                <InfoRow icon={<DollarSign className="w-4 h-4" />} label="Salary" value={job.salary || 'Not Disclosed'} />
                <InfoRow icon={<Clock className="w-4 h-4" />} label="Experience" value={job.experience || 'Fresher'} />
                <InfoRow icon={<GraduationCap className="w-4 h-4" />} label="Qualification" value={job.qualification || 'Any Graduate'} />
                <InfoRow icon={<Calendar className="w-4 h-4" />} label="Posted" value={new Date(job.created_at).toLocaleDateString()} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Share this Job</h3>
              <div className="grid grid-cols-4 gap-4">
                <ShareButton icon={<Facebook className="w-5 h-5" />} href={getShareLink('facebook')} color="bg-blue-600" />
                <ShareButton icon={<Twitter className="w-5 h-5" />} href={getShareLink('twitter')} color="bg-sky-500" />
                <ShareButton icon={<Linkedin className="w-5 h-5" />} href={getShareLink('linkedin')} color="bg-blue-700" />
                <ShareButton icon={<MessageCircle className="w-5 h-5" />} href={getShareLink('whatsapp')} color="bg-green-500" />
              </div>
            </div>

            <AdSlot slot="job_detail_sidebar" format="vertical" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-700 text-right">{value}</span>
    </div>
  );
}

function ShareButton({ icon, href, color }: { icon: React.ReactNode, href: string, color: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95",
        color
      )}
    >
      {icon}
    </a>
  );
}



function FilterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden">
        <div className="w-1/3 bg-slate-50/70 border-r border-slate-200 p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-6">All Filters</h2>
          <div className="space-y-2">
            {['Quick Filters', 'Categories', 'Locations', 'Type', 'Date Posted', 'Working Days', 'Timing', 'Roles'].map((item, i) => (
              <button key={item} className={cn(
                "w-full text-left px-4 py-2 rounded-lg font-semibold text-sm",
                i === 0 ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-200/60"
              )}>
                {item}
                {i === 0 && <span className="bg-blue-200 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2">1</span>}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button className="text-sm font-bold text-slate-600 hover:underline">Clear All</button>
        </div>
        <div className="w-2/3 p-8 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-6">Quick Filters</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-6 py-4 rounded-xl border-2 border-green-400 bg-green-50/50 flex items-center justify-between font-semibold text-green-800">
                Quick Apply
                <CheckCircle className="w-6 h-6 text-green-500" />
              </button>
              <button className="w-full text-left px-6 py-4 rounded-xl border border-slate-200 flex items-center justify-between font-semibold text-slate-700 hover:border-slate-400">
                Open to all
                <div className="w-6 h-6 rounded-md border-2 border-slate-300" />
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={onClose} className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all">
              Show Result
            </button>
          </div>
        </div>
      </div>
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/50 rounded-full hover:bg-white">
        <X className="w-6 h-6" />
      </button>
    </div>
  )
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
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/communities')
      .then(res => res.json())
      .then(data => {
        setCommunities(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const stateGroups = communities.filter(c => c.type === 'State');
  const departmentGroups = communities.filter(c => c.type === 'Department');
  const interestGroups = communities.filter(c => c.type === 'Interest' || c.type === 'Exam Prep');

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
          count={`${stateGroups.length} Groups`} 
          icon={<MapPin className="w-6 h-6" />} 
          color="bg-blue-500"
          desc="Connect with students from your home state."
        />
        <CommunityCategoryCard 
          title="Departments" 
          count={`${departmentGroups.length} Groups`} 
          icon={<Building2 className="w-6 h-6" />} 
          color="bg-emerald-500"
          desc="Discuss subjects with peers in your field."
        />
        <CommunityCategoryCard 
          title="Interests" 
          count={`${interestGroups.length} Groups`} 
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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-navy-100 border-t-navy-900 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communities.length > 0 ? communities.map(comm => (
              <FeaturedCommunityCard 
                key={comm.id}
                name={comm.name} 
                members={comm.members || '0'} 
                category={comm.type} 
                state={comm.state}
              />
            )) : (
              <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                No communities found.
              </div>
            )}
          </div>
        )}
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

function FeaturedCommunityCard({ name, members, category, state }: { name: string, members: string, category: string, state?: string }) {
  const [joined, setJoined] = useState(false);
  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-navy-700 font-bold group-hover:bg-navy-50 transition-colors">
          {name[0]}
        </div>
        <div>
          <p className="font-bold text-slate-900">{name}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{members} members</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-tighter">{category}</span>
            {state && (
              <>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{state}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setJoined(!joined);
        }}
        className={cn(
          "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
          joined ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-navy-700 hover:bg-navy-900 hover:text-white"
        )}
      >
        {joined ? 'Joined' : 'Join'}
      </button>
    </div>
  );
}
