import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Jobs API with filtering
app.get("/api/jobs", (req, res) => {
  const { 
    type, 
    is_internship, 
    is_competition, 
    is_featured, 
    category, 
    sub_category,
    domain, 
    course,
    user_type,
    search,
    sort
  } = req.query;
  
  let query = 'SELECT * FROM jobs WHERE (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)';
  const params: any[] = [];

  if (type) { query += ' AND type = ?'; params.push(type); }
  if (is_internship !== undefined) { query += ' AND is_internship = ?'; params.push(is_internship === 'true' ? 1 : 0); }
  if (is_competition !== undefined) { query += ' AND is_competition = ?'; params.push(is_competition === 'true' ? 1 : 0); }
  if (is_featured !== undefined) { query += ' AND is_featured = ?'; params.push(is_featured === 'true' ? 1 : 0); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  if (sub_category) { query += ' AND sub_category = ?'; params.push(sub_category); }
  if (domain) { query += ' AND domain = ?'; params.push(domain); }
  if (course) { query += ' AND course = ?'; params.push(course); }
  if (user_type) { query += ' AND user_type = ?'; params.push(user_type); }
  if (search) {
    query += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ? OR content LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  if (sort === 'oldest') {
    query += ' ORDER BY created_at ASC';
  } else {
    query += ' ORDER BY created_at DESC';
  }
  
  const jobs = db.prepare(query).all(...params);
  res.json(jobs);
});

app.post("/api/jobs", (req, res) => {
  const job = { id: uuidv4(), ...req.body };
  const stmt = db.prepare(`
    INSERT INTO jobs (
      id, title, company, location, type, timing, salary, 
      description, category, user_type, domain, course, 
      specialization, passout_year, is_featured, is_internship, 
      internship_type, is_competition, is_preparation,
      content, experience, qualification, apply_url, sub_category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    job.id, job.title, job.company, job.location, job.type, job.timing, job.salary,
    job.description, job.category, job.user_type, job.domain, job.course,
    job.specialization, job.passout_year, job.is_featured ? 1 : 0, 
    job.is_internship ? 1 : 0, job.internship_type, 
    job.is_competition ? 1 : 0, job.is_preparation ? 1 : 0,
    job.content, job.experience, job.qualification, job.apply_url, job.sub_category
  );
  res.json(job);
});

app.patch("/api/jobs/:id", (req, res) => {
  const { is_featured } = req.body;
  db.prepare('UPDATE jobs SET is_featured = ? WHERE id = ?').run(is_featured ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.delete("/api/jobs/:id", (req, res) => {
  db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Blogs API
app.get("/api/blogs", (req, res) => {
  const blogs = db.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
  res.json(blogs);
});

app.post("/api/blogs", (req, res) => {
  const blog = { id: uuidv4(), ...req.body };
  db.prepare(`
    INSERT INTO blogs (
      id, title, content, author_id, category, 
      location, type, timing, user_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    blog.id, blog.title, blog.content, blog.author_id, blog.category,
    blog.location, blog.type, blog.timing, blog.user_type
  );
  res.json(blog);
});

// Education Structure API
app.get("/api/education/categories", (req, res) => {
  const categories = db.prepare('SELECT * FROM education_categories').all();
  res.json(categories);
});

app.post("/api/education/categories", (req, res) => {
  const { name } = req.body;
  const id = uuidv4();
  db.prepare('INSERT INTO education_categories (id, name) VALUES (?, ?)').run(id, name);
  res.json({ id, name });
});

app.get("/api/education/branches", (req, res) => {
  const { category_id } = req.query;
  const branches = db.prepare('SELECT * FROM education_branches WHERE category_id = ?').all(category_id);
  res.json(branches);
});

app.post("/api/education/branches", (req, res) => {
  const { category_id, name } = req.body;
  const id = uuidv4();
  db.prepare('INSERT INTO education_branches (id, category_id, name) VALUES (?, ?, ?)').run(id, category_id, name);
  // Auto-create 8 semesters
  for (let i = 1; i <= 8; i++) {
    db.prepare('INSERT INTO education_semesters (id, branch_id, number) VALUES (?, ?, ?)').run(uuidv4(), id, i);
  }
  res.json({ id, category_id, name });
});

app.get("/api/education/semesters", (req, res) => {
  const { branch_id } = req.query;
  const semesters = db.prepare('SELECT * FROM education_semesters WHERE branch_id = ? ORDER BY number ASC').all(branch_id);
  res.json(semesters);
});

app.get("/api/education/subjects", (req, res) => {
  const { semester_id } = req.query;
  const subjects = db.prepare('SELECT * FROM education_subjects WHERE semester_id = ?').all(semester_id);
  res.json(subjects);
});

app.post("/api/education/subjects", (req, res) => {
  const { semester_id, name } = req.body;
  const id = uuidv4();
  db.prepare('INSERT INTO education_subjects (id, semester_id, name) VALUES (?, ?, ?)').run(id, semester_id, name);
  res.json({ id, semester_id, name });
});

app.get("/api/education/materials", (req, res) => {
  const { subject_id } = req.query;
  const materials = db.prepare('SELECT * FROM education_materials WHERE subject_id = ?').all(subject_id);
  res.json(materials);
});

app.post("/api/education/materials", (req, res) => {
  const { subject_id, title, download_url } = req.body;
  const id = uuidv4();
  db.prepare('INSERT INTO education_materials (id, subject_id, title, download_url) VALUES (?, ?, ?, ?)').run(id, subject_id, title, download_url);
  res.json({ id, subject_id, title, download_url });
});

// Analytics API
app.get("/api/analytics", (req, res) => {
  const jobStats = db.prepare('SELECT category, count(*) as count FROM jobs GROUP BY category').all();
  const blogStats = db.prepare('SELECT category, count(*) as count FROM blogs GROUP BY category').all();
  const collegeStats = db.prepare('SELECT category, count(*) as count FROM colleges GROUP BY category').all();
  
  // Mock user growth data
  const userGrowth = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 250 },
    { month: 'Mar', users: 450 },
    { month: 'Apr', users: 800 },
    { month: 'May', users: 1200 },
    { month: 'Jun', users: 1800 },
  ];

  res.json({
    jobs: jobStats,
    blogs: blogStats,
    colleges: collegeStats,
    userGrowth
  });
});

// Preparation Materials API
app.get("/api/preparation", (req, res) => {
  const materials = db.prepare('SELECT * FROM preparation_materials').all();
  res.json(materials);
});

// Admin Management API
app.get("/api/admins", (req, res) => {
  const admins = db.prepare("SELECT * FROM users WHERE role IN ('super_admin', 'moderate_admin', 'writer_admin')").all();
  res.json(admins);
});

app.post("/api/admins", (req, res) => {
  const admin = { id: uuidv4(), ...req.body };
  db.prepare('INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)')
    .run(admin.id, admin.email, admin.name, admin.role);
  res.json(admin);
});

// Colleges API
app.get("/api/colleges", (req, res) => {
  const colleges = db.prepare('SELECT * FROM colleges').all();
  res.json(colleges);
});

// Education API
app.get("/api/universities", (req, res) => {
  const universities = db.prepare('SELECT * FROM universities').all();
  res.json(universities);
});

app.get("/api/courses", (req, res) => {
  const { university_id } = req.query;
  let query = 'SELECT * FROM courses';
  const params = [];
  if (university_id) {
    query += ' WHERE university_id = ?';
    params.push(university_id);
  }
  const courses = db.prepare(query).all(...params);
  res.json(courses);
});

app.get("/api/communities", (req, res) => {
  const communities = db.prepare('SELECT * FROM communities').all();
  res.json(communities);
});

export { app };

async function startDevServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "production") {
  startDevServer();
}

export default app;
