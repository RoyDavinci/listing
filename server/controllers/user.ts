import db from "../db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req: Request, res: Response) => {
	const { first_name, last_name, email, password } = req.body;
	try {
		const hashedPassword: string = await bcrypt.hash(password, 10);
		const { rows } = await db.query(
			"INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING * ",
			[first_name, last_name, email, hashedPassword]
		);
		const token = await jwt.sign(
			{ user: rows[0].user_id },
			`${process.env.JWT_SECRET_KEY}`,
			{ expiresIn: "1d" }
		);
		res.status(200).json({ message: "data collected", rows, token });
	} catch (error) {
		let errorMessage = "Failed";
		if (error instanceof Error) {
			errorMessage = error.message;
		}
		res
			.status(500)
			.json({ message: "error on controller", error: errorMessage });
		throw error;
	}
};
const getUser = async (req: Request, res: Response) => {
	try {
		const { rows } = await db.query("SELECT * FROM users");
		res.status(200).json({ message: "data collected", rows });
	} catch (error) {
		throw error;
	}
};

const getSingleUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const { rows } = await db.query("SELECT * FROM users WHERE user_id = $1", [
			id,
		]);
		res.status(200).json({ message: "data collected", rows });
		return rows;
	} catch (error) {
		let errorMessage = "Failed";
		if (error instanceof Error) {
			errorMessage = error.message;
		}
		res
			.status(500)
			.json({ message: "error on controller", error: errorMessage });
		throw error;
	}
};

const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { password, first_name, last_name, email } = req.body;
	try {
		if (password) {
			const hashedPassword: string = await bcrypt.hash(password, 10);
			let { rows } = await db.query(
				"UPDATE users SET password = $1, first_name = $2, last_name=$3, email = $4 WHERE user_id = $5 RETURNING *",
				[hashedPassword, first_name, last_name, email, id]
			);
			res.status(200).json({ message: "data collected", rows });
		}
	} catch (error) {
		let errorMessage = "Failed";
		if (error instanceof Error) {
			errorMessage = error.message;
		}
		res
			.status(500)
			.json({ message: "error on controller", error: errorMessage });
		throw error;
	}
};

export { createUser, getUser, getSingleUser, updateUser };
