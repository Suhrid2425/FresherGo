import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";
import { v4 as uuidv4 } from 'uuid';

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Jobs API
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC').all();
    res.json(jobs);
  });

  app.post("/api/jobs", (req, res) => {
    const { title, company, location, type, salary, description } = req.body;
    const id = uuidv4();
    db.prepare('INSERT INTO jobs (id, title, company, location, type, salary, description) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      id, title, company, location, type, salary, description
    );
    res.json({ id });
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
