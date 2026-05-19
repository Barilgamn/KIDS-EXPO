import express from "express";
import path from "path";
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Add a basic health check for deployment verification
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve from the 'dist' directory created by 'vite build'
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Handle SPA routing: serve index.html for any unknown routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

startServer();
