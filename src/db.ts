import Database from 'better-sqlite3';

const db = new Database('freshergo.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS universities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    university_id TEXT,
    name TEXT NOT NULL,
    FOREIGN KEY (university_id) REFERENCES universities(id)
  );

  CREATE TABLE IF NOT EXISTS semesters (
    id TEXT PRIMARY KEY,
    course_id TEXT,
    number INTEGER NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    semester_id TEXT,
    name TEXT NOT NULL,
    FOREIGN KEY (semester_id) REFERENCES semesters(id)
  );

  CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    subject_id TEXT,
    name TEXT NOT NULL,
    notes TEXT,
    youtube_url TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  );

  CREATE TABLE IF NOT EXISTS education_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS education_branches (
    id TEXT PRIMARY KEY,
    category_id TEXT,
    name TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES education_categories(id)
  );

  CREATE TABLE IF NOT EXISTS education_semesters (
    id TEXT PRIMARY KEY,
    branch_id TEXT,
    number INTEGER NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES education_branches(id)
  );

  CREATE TABLE IF NOT EXISTS education_subjects (
    id TEXT PRIMARY KEY,
    semester_id TEXT,
    name TEXT NOT NULL,
    FOREIGN KEY (semester_id) REFERENCES education_semesters(id)
  );

  CREATE TABLE IF NOT EXISTS education_materials (
    id TEXT PRIMARY KEY,
    subject_id TEXT,
    title TEXT NOT NULL,
    download_url TEXT,
    FOREIGN KEY (subject_id) REFERENCES education_subjects(id)
  );

  CREATE TABLE IF NOT EXISTS placement_companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL, -- in-office, hybrid, remote
    timing TEXT NOT NULL, -- full-time, part-time, contract
    salary TEXT,
    description TEXT,
    category TEXT, -- Engineering, HR, Finance, Legal, IT, Marketing, Design, Product, Sales, NGO, SDE
    user_type TEXT, -- student, fresher, professional
    domain TEXT, -- Management, Engineering, Arts, Science, Medicine, Law, Others
    course TEXT, -- B.Tech, M.Tech, MBA, MCA, BBA, BCA, MCM, PhD, Diploma
    specialization TEXT,
    passout_year INTEGER,
    is_featured BOOLEAN DEFAULT 0,
    is_internship BOOLEAN DEFAULT 0,
    internship_type TEXT, -- research, paid, unpaid
    is_competition BOOLEAN DEFAULT 0,
    is_preparation BOOLEAN DEFAULT 0,
    logo TEXT,
    skills TEXT,
    content TEXT,
    experience TEXT,
    qualification TEXT,
    apply_url TEXT,
    sub_category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT,
    category TEXT, -- College, Job, Education
    location TEXT,
    type TEXT,
    timing TEXT,
    user_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS preparation_materials (
    id TEXT PRIMARY KEY,
    role_name TEXT NOT NULL, -- SDE, HR, etc.
    title TEXT NOT NULL,
    content_url TEXT,
    type TEXT, -- Playlist, Question Set, Platform
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS job_skills (
    job_id TEXT,
    skill_name TEXT,
    PRIMARY KEY (job_id, skill_name),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  );

  CREATE TABLE IF NOT EXISTS colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Engineering, Management, Medical, Others
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    description TEXT,
    fees_pdf_url TEXT,
    nirf_rank INTEGER,
    rating REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL -- State, Department, Interest
  );
`);

// Migration for blogs table
try { db.exec('ALTER TABLE blogs ADD COLUMN location TEXT'); } catch (e) {}
try { db.exec('ALTER TABLE blogs ADD COLUMN type TEXT'); } catch (e) {}
try { db.exec('ALTER TABLE blogs ADD COLUMN timing TEXT'); } catch (e) {}
try { db.exec('ALTER TABLE blogs ADD COLUMN user_type TEXT'); } catch (e) {}

// Migration for jobs table
try { db.exec('ALTER TABLE jobs ADD COLUMN content TEXT'); } catch (e) {}
try { db.exec('ALTER TABLE jobs ADD COLUMN experience TEXT'); } catch (e) {}
try { db.exec('ALTER TABLE jobs ADD COLUMN qualification TEXT'); } catch (e) {}
try { db.exec('ALTER TABLE jobs ADD COLUMN apply_url TEXT'); } catch (e) {}
try { db.exec('ALTER TABLE jobs ADD COLUMN sub_category TEXT'); } catch (e) {}

// Seed initial data if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  db.prepare('INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)').run(
    'admin-1', 'suhrid@freshergo.com', 'Suhrid (Super Admin)', 'super_admin'
  );
  db.prepare('INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)').run(
    'admin-2', 'mod@freshergo.com', 'Moderate Admin', 'moderate_admin'
  );
  db.prepare('INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)').run(
    'admin-3', 'writer@freshergo.com', 'Writer Admin', 'writer_admin'
  );

  // Seed Universities
  const universities = [
    { id: 'uni-1', name: 'State Technical University' },
    { id: 'uni-2', name: 'National Institute of Technology' },
    { id: 'uni-3', name: 'Global University of Science' },
    { id: 'uni-4', name: 'Institute of Management & Research' }
  ];
  
  for (const uni of universities) {
    db.prepare('INSERT INTO universities (id, name) VALUES (?, ?)').run(uni.id, uni.name);
  }

  // Seed Courses
  const courses = [
    { id: 'course-1', uni: 'uni-1', name: 'Computer Science Engineering' },
    { id: 'course-2', uni: 'uni-1', name: 'Information Technology' },
    { id: 'course-3', uni: 'uni-2', name: 'Mechanical Engineering' },
    { id: 'course-4', uni: 'uni-2', name: 'Electronics & Communication' },
    { id: 'course-5', uni: 'uni-4', name: 'MBA - Marketing' },
    { id: 'course-6', uni: 'uni-4', name: 'MBA - Finance' }
  ];

  for (const c of courses) {
    db.prepare('INSERT INTO courses (id, university_id, name) VALUES (?, ?, ?)').run(c.id, c.uni, c.name);
  }

  // Seed Semesters
  for (let i = 1; i <= 8; i++) {
    db.prepare('INSERT INTO semesters (id, course_id, number) VALUES (?, ?, ?)').run(`sem-${i}`, 'course-1', i);
  }

  // Seed Colleges
  const colleges = [
    { id: 'col-1', name: 'Indian Institute of Technology (IIT)', category: 'Engineering', state: 'Maharashtra', city: 'Mumbai', nirf: 1, rating: 4.9 },
    { id: 'col-2', name: 'National Institute of Technology (NIT)', category: 'Engineering', state: 'Karnataka', city: 'Surathkal', nirf: 10, rating: 4.7 },
    { id: 'col-3', name: 'All India Institute of Medical Sciences (AIIMS)', category: 'Medical', state: 'Delhi', city: 'New Delhi', nirf: 1, rating: 4.9 },
    { id: 'col-4', name: 'Indian Institute of Management (IIM)', category: 'Management', state: 'Gujarat', city: 'Ahmedabad', nirf: 1, rating: 4.9 },
    { id: 'col-5', name: 'Birla Institute of Technology and Science (BITS)', category: 'Engineering', state: 'Rajasthan', city: 'Pilani', nirf: 25, rating: 4.8 },
    { id: 'col-6', name: 'Vellore Institute of Technology (VIT)', category: 'Engineering', state: 'Tamil Nadu', city: 'Vellore', nirf: 11, rating: 4.5 },
    { id: 'col-7', name: 'Christian Medical College (CMC)', category: 'Medical', state: 'Tamil Nadu', city: 'Vellore', nirf: 3, rating: 4.8 },
    { id: 'col-8', name: 'Faculty of Management Studies (FMS)', category: 'Management', state: 'Delhi', city: 'New Delhi', nirf: 5, rating: 4.7 },
    { id: 'col-9', name: 'St. Stephen\'s College', category: 'Others', state: 'Delhi', city: 'New Delhi', nirf: 2, rating: 4.8 },
    { id: 'col-10', name: 'Loyola College', category: 'Others', state: 'Tamil Nadu', city: 'Chennai', nirf: 4, rating: 4.7 },
    { id: 'col-11', name: 'Manipal Academy of Higher Education', category: 'Medical', state: 'Karnataka', city: 'Manipal', nirf: 7, rating: 4.6 },
    { id: 'col-12', name: 'XLRI - Xavier School of Management', category: 'Management', state: 'Jharkhand', city: 'Jamshedpur', nirf: 9, rating: 4.8 },
  ];

  for (const col of colleges) {
    db.prepare('INSERT INTO colleges (id, name, category, state, city, nirf_rank, rating) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      col.id, col.name, col.category, col.state, col.city, col.nirf, col.rating
    );
  }

  // Seed Jobs
  const jobs = [
    { 
      id: 'job-1', 
      title: 'Executive Office Manager', 
      company: 'Learner Circle', 
      location: 'Chennai', 
      type: 'in-office', 
      timing: 'full-time',
      salary: '₹ 20 K - 25 K /Month',
      category: 'SDE',
      user_type: 'student',
      domain: 'Engineering',
      course: 'B.Tech',
      is_internship: 0,
      is_featured: 1,
      logo: 'LC',
      skills: 'No prior experience required,Accountability,Communication skills,Microsoft Office Suite,+2',
      is_competition: 0
    },
    { 
      id: 'job-2', 
      title: 'Human Resources Consultant', 
      company: 'Hopscotch pvt ltd', 
      location: 'Only Office', 
      type: 'in-office', 
      timing: 'contract',
      salary: null,
      category: 'HR',
      user_type: 'fresher',
      domain: 'Management',
      course: 'MBA',
      is_featured: 1,
      logo: 'HOPS',
      skills: 'No prior experience required,Contract/Temporary,Only Office,Member',
      is_competition: 0
    },
    { 
      id: 'job-3', 
      title: 'Product Designer', 
      company: 'Airbnb', 
      location: 'San Francisco, CA', 
      type: 'hybrid', 
      timing: 'full-time',
      salary: '$120,000/yr',
      category: 'Design',
      user_type: 'professional',
      domain: 'Others',
      course: 'B.Des',
      is_featured: 1,
      logo: 'ABNB',
      skills: 'Figma,UI/UX,Prototyping,User Research',
      is_competition: 0
    },
    { 
      id: 'job-4', 
      title: 'Data Analyst Intern', 
      company: 'Amazon', 
      location: 'Hyderabad, India', 
      type: 'in-office', 
      timing: 'full-time',
      salary: '₹50,000/mo',
      category: 'IT',
      user_type: 'student',
      domain: 'Engineering',
      course: 'B.Tech',
      is_internship: 1,
      internship_type: 'paid',
      is_featured: 0,
      logo: 'AMZN',
      skills: 'SQL,Excel,Tableau,Data Analysis',
      is_competition: 0
    },
    { 
      id: 'job-5', 
      title: 'Marketing Specialist', 
      company: 'Spotify', 
      location: 'Stockholm, Sweden', 
      type: 'remote', 
      timing: 'full-time',
      salary: '€60,000/yr',
      category: 'Marketing',
      user_type: 'fresher',
      domain: 'Arts',
      course: 'MBA',
      is_featured: 1,
      logo: 'SPOT',
      skills: 'SEO,Social Media,Content Marketing,Analytics',
      is_competition: 0
    }
  ];

  for (const job of jobs) {
    db.prepare(`
      INSERT INTO jobs (
        id, title, company, location, type, timing, salary, 
        category, user_type, domain, course, is_internship, 
        internship_type, is_competition, is_featured, logo, skills
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      job.id, job.title, job.company, job.location, job.type, job.timing, job.salary || null,
      job.category || null, job.user_type || null, job.domain || null, job.course || null,
      job.is_internship || 0, job.internship_type || null, job.is_competition || 0, job.is_featured || 0,
      job.logo || null, job.skills || null
    );
  }

  // Seed Preparation Materials
  db.prepare('INSERT INTO preparation_materials (id, role_name, title, type, content_url) VALUES (?, ?, ?, ?, ?)').run(
    'prep-1', 'SDE', 'Top 100 LeetCode Questions', 'Question Set', 'https://leetcode.com/problemset/all/'
  );
  db.prepare('INSERT INTO preparation_materials (id, role_name, title, type, content_url) VALUES (?, ?, ?, ?, ?)').run(
    'prep-2', 'SDE', 'System Design Playlist', 'Playlist', 'https://youtube.com/playlist?list=...'
  );
  db.prepare('INSERT INTO preparation_materials (id, role_name, title, type, content_url) VALUES (?, ?, ?, ?, ?)').run(
    'prep-3', 'HR', 'HR Interview Guide', 'Platform', 'https://example.com/hr-prep'
  );

  // Seed Education Categories
  const eduCategories = [
    { id: 'edu-cat-1', name: 'Engineering' },
    { id: 'edu-cat-2', name: 'BCA' },
    { id: 'edu-cat-3', name: 'BSc' }
  ];
  for (const cat of eduCategories) {
    db.prepare('INSERT INTO education_categories (id, name) VALUES (?, ?)').run(cat.id, cat.name);
  }

  // Seed Engineering Branches
  const engBranches = [
    { id: 'br-1', name: 'CS' }, { id: 'br-2', name: 'IT' }, { id: 'br-3', name: 'AI/ML' },
    { id: 'br-4', name: 'ECE' }, { id: 'br-5', name: 'EE' }, { id: 'br-6', name: 'ME' },
    { id: 'br-7', name: 'CE' }, { id: 'br-8', name: 'CH' }, { id: 'br-9', name: 'AE' },
    { id: 'br-10', name: 'IE' }, { id: 'br-11', name: 'Others' }
  ];
  for (const br of engBranches) {
    db.prepare('INSERT INTO education_branches (id, category_id, name) VALUES (?, ?, ?)').run(br.id, 'edu-cat-1', br.name);
    // Seed Semesters 1-8 for each branch
    for (let i = 1; i <= 8; i++) {
      db.prepare('INSERT INTO education_semesters (id, branch_id, number) VALUES (?, ?, ?)').run(`${br.id}-sem-${i}`, br.id, i);
    }
  }

  // Seed Communities
  const communities = [
    { id: 'comm-1', name: 'Maharashtra Students', type: 'State' },
    { id: 'comm-2', name: 'CSE Department', type: 'Department' },
    { id: 'comm-3', name: 'AI & ML Enthusiasts', type: 'Interest' },
    { id: 'comm-4', name: 'Competitive Coding', type: 'Interest' }
  ];

  for (const comm of communities) {
    db.prepare('INSERT INTO communities (id, name, type) VALUES (?, ?, ?)').run(comm.id, comm.name, comm.type);
  }
}

export default db;
