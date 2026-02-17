import { Router } from "express";
import { getUsers, getUsersByRole, login } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.get("/role/:role", getUsersByRole);
router.post("/login", login);

export default router;
