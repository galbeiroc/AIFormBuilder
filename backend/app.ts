import express from "express";
import cors from "cors";

import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import { notFound, errorHander } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || env.clientUrls.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is healty",
    uptime: process.uptime(),
  });
});

app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHander);

export default app;
