import Thread from "../models/Thread.js";
import User from "../models/User.js";
import Subreddit from "../models/Subreddit.js";
import { createAppError } from "../utils/createAppError.js";

export const fetchAllThreads = async () => {
  const threads = await Thread.find()
    .populate({ path: "author", model: User })
    .populate({ path: "subreddit", model: Subreddit })
    .sort({ createdAt: -1 });

  return threads;
};

export const fetchThreadById = async (id) => {
  const thread = await Thread.findById(id)
    .populate({ path: "author" })
    .populate({ path: "subreddit" });

  if (!thread) {
    throw createAppError("Thread not found", 404);
  }

  return thread;
};

export const createNewThread = async (title, content, author, subreddit) => {
  const newThread = new Thread({ title, content, author, subreddit });
  await newThread.save();

  const populatedThread = await Thread.findById(newThread._id)
    .populate({ path: "subreddit", select: "name description" })
    .populate({ path: "author", select: "name" });

  if (!populatedThread) {
    throw createAppError("Failed to create thread", 500);
  }

  return populatedThread;
};

export const updateThreadById = async (id, updateData, userId) => {
  const thread = await Thread.findById(id);

  if (!thread) {
    throw createAppError("Thread not found", 404);
  }

  if (thread.author.toString() !== userId.toString()) {
    throw createAppError("Forbidden: you can only edit your own threads", 403);
  }

  const { title, content } = updateData;
  const sanitizedUpdate = {};
  if (title !== undefined) sanitizedUpdate.title = String(title);
  if (content !== undefined) sanitizedUpdate.content = String(content);

  const updatedThread = await Thread.findByIdAndUpdate(id, sanitizedUpdate, {
    new: true,
    runValidators: true,
  });

  return updatedThread;
};

export const deleteThreadById = async (id, userId) => {
  const thread = await Thread.findById(id);

  if (!thread) {
    throw createAppError("Thread not found", 404);
  }

  if (thread.author.toString() !== userId.toString()) {
    throw createAppError("Forbidden: you can only delete your own threads", 403);
  }

  await Thread.findByIdAndDelete(id);

  return thread;
};