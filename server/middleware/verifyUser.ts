import express, { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface GetUserAuthInfoRequest extends Request {
	user: any;
}

const verifyUser = (
	req: GetUserAuthInfoRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, `${process.env.SECRET_KEY}`, (err, payload) => {
			if (err) {
				res.status(403).json("Token is not valid");
			}
			req.user = payload;
			next();
		});
	} else {
		res.status(401).json({ message: "You are not authenticated" });
	}
};
