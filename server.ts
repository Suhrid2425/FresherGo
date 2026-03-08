import express from "express";
import db from "./src/db.ts";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PATCH') {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// API Routes
app.get("/api/health", (req, res) => {
  try {
    const userCount = db.prepare('SELECT count(*) as count FROM users').get();
    res.json({ status: "ok", db: "connected", users: userCount });
  } catch (err) {
    res.status(500).json({ status: "error", message: err instanceof Error ? err.message : String(err) });
  }
});

// Seed Database Endpoint (Admin Only)
app.post("/api/admin/seed", (req, res) => {
  try {
    // This is a simple way to re-trigger the seeding logic if needed
    // In a real app, you'd want more security here
    res.json({ message: "Database seeding is handled on startup. If you need to reset, please contact support." });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
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
  if (jobs && jobs.length > 0) {
    return res.json(jobs);
  }
  // Fallback
  res.json([
    { id: 'job-1', title: 'SDE Intern', company: 'Google', location: 'Remote', type: 'remote', timing: 'full-time', is_featured: 1, category: 'SDE', user_type: 'student', domain: 'Engineering', course: 'B.Tech', skills: 'React,Node.js' },
    { id: 'job-2', title: 'Frontend Developer', company: 'Meta', location: 'London', type: 'hybrid', timing: 'full-time', is_featured: 1, category: 'IT', user_type: 'fresher', domain: 'Engineering', course: 'B.Tech', skills: 'Vue,Tailwind' }
  ]);
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

app.patch("/api/jobs/:id", (req, res) => {
  const fields = Object.keys(req.body);
  const sets = fields.map(f => `${f} = ?`).join(', ');
  const values = Object.values(req.body);
  db.prepare(`UPDATE jobs SET ${sets} WHERE id = ?`).run(...values, req.params.id);
  const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  res.json(updated);
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

app.delete("/api/blogs/:id", (req, res) => {
  db.prepare('DELETE FROM blogs WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Education Structure API
app.get("/api/education/categories", (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM education_categories').all();
    if (categories && categories.length > 0) {
      return res.json(categories);
    }
    // Fallback if DB is empty
    res.json([
      { id: 'edu-cat-1', name: 'Engineering' },
      { id: 'edu-cat-2', name: 'BCA' },
      { id: 'edu-cat-3', name: 'BSc' }
    ]);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.json([
      { id: 'edu-cat-1', name: 'Engineering' },
      { id: 'edu-cat-2', name: 'BCA' },
      { id: 'edu-cat-3', name: 'BSc' }
    ]);
  }
});

app.post("/api/education/categories", (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const id = uuidv4();
    db.prepare('INSERT INTO education_categories (id, name) VALUES (?, ?)').run(id, name);
    res.json({ id, name });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/education/branches", (req, res) => {
  try {
    const { category_id } = req.query;
    const branches = db.prepare('SELECT * FROM education_branches WHERE category_id = ?').all(category_id);
    if (branches && branches.length > 0) {
      return res.json(branches);
    }
    // Fallback
    if (category_id === 'edu-cat-1') {
      return res.json([
        { id: 'br-1', category_id: 'edu-cat-1', name: 'CS' },
        { id: 'br-2', category_id: 'edu-cat-1', name: 'IT' },
        { id: 'br-3', category_id: 'edu-cat-1', name: 'AI/ML' }
      ]);
    }
    res.json([]);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.json([]);
  }
});

app.post("/api/education/branches", (req, res) => {
  try {
    const { category_id, name } = req.body;
    if (!category_id || !name) return res.status(400).json({ error: "Missing required fields" });
    const id = uuidv4();
    db.prepare('INSERT INTO education_branches (id, category_id, name) VALUES (?, ?, ?)').run(id, category_id, name);
    // Auto-create 8 semesters
    for (let i = 1; i <= 8; i++) {
      db.prepare('INSERT INTO education_semesters (id, branch_id, number) VALUES (?, ?, ?)').run(uuidv4(), id, i);
    }
    res.json({ id, category_id, name });
  } catch (err) {
    console.error("Error creating branch:", err);
    res.status(500).json({ error: "Internal server error" });
  }
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
  try {
    const { semester_id, name } = req.body;
    if (!semester_id || !name) return res.status(400).json({ error: "Missing required fields" });
    const id = uuidv4();
    db.prepare('INSERT INTO education_subjects (id, semester_id, name) VALUES (?, ?, ?)').run(id, semester_id, name);
    res.json({ id, semester_id, name });
  } catch (err) {
    console.error("Error creating subject:", err);
    res.status(500).json({ error: "Internal server error" });
  }
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

app.delete("/api/education/materials/:id", (req, res) => {
  db.prepare('DELETE FROM education_materials WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Analytics API
app.get("/api/analytics", (req, res) => {
  try {
    const jobStats = db.prepare('SELECT category, count(*) as count FROM jobs GROUP BY category').all();
    const blogStats = db.prepare('SELECT category, count(*) as count FROM blogs GROUP BY category').all();
    const collegeStats = db.prepare('SELECT category, count(*) as count FROM colleges GROUP BY category').all();
    
    const totalUsers = db.prepare("SELECT count(*) as count FROM users WHERE role = 'student'").get().count;
    const totalAdmins = db.prepare("SELECT count(*) as count FROM users WHERE role != 'student'").get().count;
    const totalCommunities = db.prepare("SELECT count(*) as count FROM communities").get().count;
    const totalMaterials = db.prepare("SELECT count(*) as count FROM education_materials").get().count;

    // Mock user growth data
    const userGrowth = [
      { month: 'Jan', users: 120 },
      { month: 'Feb', users: 250 },
      { month: 'Mar', users: 450 },
      { month: 'Apr', users: 800 },
      { month: 'May', users: 1200 },
      { month: 'Jun', users: totalUsers || 1800 },
    ];

    res.json({
      jobs: jobStats,
      blogs: blogStats,
      colleges: collegeStats,
      userGrowth,
      summary: {
        users: totalUsers,
        admins: totalAdmins,
        communities: totalCommunities,
        materials: totalMaterials
      }
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
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

app.get("/api/users", (req, res) => {
  const users = db.prepare("SELECT * FROM users WHERE role = 'student'").all();
  res.json(users);
});

app.delete("/api/users/:id", (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ success: true });
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

app.delete("/api/colleges/:id", (req, res) => {
  db.prepare('DELETE FROM colleges WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.patch("/api/colleges/:id", (req, res) => {
  const { name, category, city, state, nirf_rank, website } = req.body;
  db.prepare('UPDATE colleges SET name = ?, category = ?, city = ?, state = ?, nirf_rank = ?, website = ? WHERE id = ?')
    .run(name, category, city, state, nirf_rank, website, req.params.id);
  const updated = db.prepare('SELECT * FROM colleges WHERE id = ?').get(req.params.id);
  res.json(updated);
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
  try {
    const { state } = req.query;
    let query = 'SELECT * FROM communities';
    const params = [];
    if (state) {
      query += ' WHERE state = ?';
      params.push(state);
    }
    const communities = db.prepare(query).all(...params);
    if (communities && communities.length > 0) {
      return res.json(communities);
    }
    // Fallback
    res.json([
      { id: 'comm-1', name: 'Maharashtra Students', type: 'State' },
      { id: 'comm-2', name: 'CSE Department', type: 'Department' },
      { id: 'comm-3', name: 'AI & ML Enthusiasts', type: 'Interest' }
    ]);
  } catch (err) {
    console.error("Error fetching communities:", err);
    res.json([
      { id: 'comm-1', name: 'Maharashtra Students', type: 'State' },
      { id: 'comm-2', name: 'CSE Department', type: 'Department' },
      { id: 'comm-3', name: 'AI & ML Enthusiasts', type: 'Interest' }
    ]);
  }
});

app.post("/api/communities", (req, res) => {
  try {
    const { name, type, state, description, image_url } = req.body;
    if (!name || !type) return res.status(400).json({ error: "Name and Type are required" });
    const id = uuidv4();
    db.prepare('INSERT INTO communities (id, name, type, state, description, image_url) VALUES (?, ?, ?, ?, ?, ?)').run(id, name, type, state || null, description || null, image_url || null);
    res.json({ id, name, type, state, description, image_url });
  } catch (err) {
    console.error("Error creating community:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/communities/:id", (req, res) => {
  try {
    db.prepare('DELETE FROM communities WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete community" });
  }
});

// Serve static files in production (only if not on Vercel)
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  // Handle SPA routing
  app.get("*", (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        // Fallback to root index.html if dist doesn't exist (e.g. during build/dev)
        res.sendFile(path.join(process.cwd(), "index.html"), (err2) => {
          if (err2) res.status(404).send("Not Found");
        });
      }
    });
  });
}

export { app };

async function startDevServer() {
  const { createServer: createViteServer } = await import("vite");
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

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  startDevServer().catch(err => {
    console.error("Failed to start dev server:", err);
  });
}

export default app;
