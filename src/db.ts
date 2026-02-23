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
    type TEXT NOT NULL,
    salary TEXT,
    description TEXT,
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

// Seed initial data if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  db.prepare('INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)').run(
    'admin-1', 'admin@freshergo.com', 'Super Admin', 'super_admin'
  );

  // Seed Universities
  const uniId = 'uni-1';
  db.prepare('INSERT INTO universities (id, name) VALUES (?, ?)').run(uniId, 'State Technical University');

  // Seed Courses
  const courseId = 'course-1';
  db.prepare('INSERT INTO courses (id, university_id, name) VALUES (?, ?, ?)').run(courseId, uniId, 'Computer Science Engineering');

  // Seed Semesters
  for (let i = 1; i <= 8; i++) {
    db.prepare('INSERT INTO semesters (id, course_id, number) VALUES (?, ?, ?)').run(`sem-${i}`, courseId, i);
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
    { id: 'job-1', title: 'Software Engineer Intern', company: 'TechCorp', location: 'Remote', type: 'Internship', salary: '$45k - $60k' },
    { id: 'job-2', title: 'Frontend Developer', company: 'DesignFlow', location: 'Bangalore', type: 'Full-time', salary: '$80k - $120k' },
    { id: 'job-3', title: 'Data Analyst', company: 'DataViz', location: 'Hyderabad', type: 'Full-time', salary: '$70k - $90k' },
  ];

  for (const job of jobs) {
    db.prepare('INSERT INTO jobs (id, title, company, location, type, salary) VALUES (?, ?, ?, ?, ?, ?)').run(
      job.id, job.title, job.company, job.location, job.type, job.salary
    );
  }
}

export default db;
