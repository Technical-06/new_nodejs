import express from "express";

import { checkAuth } from "../middleware.js";

import {
  getUsers,
  createUser,
  signinUser,
  postUsers,
  viewArticles,
} from "../controllers/users.js";

const router = express.Router();
router.get("/", checkAuth, getUsers);
router.post("/users", postUsers);
router.get("/viewarticles", checkAuth, viewArticles);
router.post("/", createUser);
router.post("/login", signinUser);
export default router;
