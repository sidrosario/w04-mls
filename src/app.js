import express from "express";
import cors from "cors";
import threadRoutes from "./routes/threads.js";
import subredditRoutes from "./routes/subreddits.js";
import auth from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import voteRoutes from "./routes/votes.js";
import errorHandler from "./middleware/errorHandler.js";

import "./models/Thread.js";
import "./models/Subreddit.js";
import "./models/User.js";

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : process.env.NODE_ENV === "production"
      ? false
      : true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
  }),
);

// Routes
app.use("/api/threads", threadRoutes);
app.use("/api/subreddits", subredditRoutes);
app.use("/api/auth", auth);
app.use("/api/comments", commentRoutes);
app.use("/api", voteRoutes);

app.use(errorHandler);

export default app;
