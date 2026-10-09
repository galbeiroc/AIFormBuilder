import { Router } from "express";
import {
  register,
  login,
  getMe,
  patchProfile,
  patchPassword,
  deleteAccount,
} from "../controllers/auth.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/profile", auth, patchProfile);
router.put("/password", auth, patchPassword);
router.delete("/me", auth, deleteAccount);

export default router;
