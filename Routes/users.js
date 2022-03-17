import express from "express";
// import multer from "multer";
import { checkAuth } from "../middleware.js";

import {
  getUsers,
  createUser,
  // getUserByID,
  // deleteUser,
  // updateUser,
  signinUser,
  postUsers,
  viewArticles,
} from "../controllers/users.js";
// console.log(updateUser(null, null));
const router = express.Router();
// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "./uploads/");
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });
// router.patch("/update/:id", updateUser);
router.get("/", checkAuth, getUsers);
router.post("/users", postUsers);
router.get("/viewarticles", checkAuth, viewArticles);
router.post("/", createUser);
router.post("/login", signinUser);
// router.get("/:id", getUserByID);
// router.get('/showallusers', getAllUsers);

// router.delete("/delete/:id", deleteUser);
export default router;
