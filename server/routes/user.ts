import express, { Request, Response, Express, Router } from "express";
import {
	createUser,
	getUser,
	getSingleUser,
	updateUser,
} from "../controllers/user";

const router: Router = express.Router();

router.post("/create", createUser);
router.get("/", getUser);
router.get("/:id", getSingleUser);
router.put("/:id", updateUser);

export default router;
