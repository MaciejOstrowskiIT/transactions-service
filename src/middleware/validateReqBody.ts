import { NextFunction, Request, Response } from "express";

export const isValidLoginReq = (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	console.log( req.body );

	if ( !email || !password ) {
		return res.status( 400 ).send( "Missing required fields" );
	}

	if ( typeof email !== "string" || typeof password !== "string" ) {
		return res.status( 400 ).send( "Invalid data types" );
	}

	next();
};
export const isValidRegisterReq = (req: Request, res: Response, next: NextFunction) => {
	const { username, email, password } = req.body;
	console.log( req.body );

	if ( !email || !password || !username ) {
		return res.status( 400 ).send( "Missing required fields" );
	}

	if ( typeof email !== "string" || typeof password !== "string" || typeof username !== "string" ) {
		return res.status( 400 ).send( "Invalid data types" );
	}

	next();
};