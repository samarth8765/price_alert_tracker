import { Router } from "express";
import { register } from "../controllers/register.js";
import { login } from "../controllers/login.js";

const router = Router()

router.post('/register', register);
router.post('/login', login);

export { router };

