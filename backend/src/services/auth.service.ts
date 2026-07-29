import {
	type SignInFormValues as SignInInput,
	type SignUpFormValues as SignUpInput,
} from "../models/auth.model.js";
import { ApiError } from "../utils/apiError.ts";

export type AuthUser = {
	id: string;
	email: string;
	password: string;
	username: string;
};

type AuthResult = {
	message: string;
	user: Omit<AuthUser, "username" | "password">;
};

export type SignInResult = AuthResult & {
	token: string;
};

export type SignUpResult = Omit<AuthResult, "user"> & {
	userId: AuthResult["user"]["id"];
	message: string;
};

//* These are only for demonstration purposes and (basic) testing
//* Latter on, I will obviously use a database to store users and their credentials
const ValidUsers: AuthUser[] = [
	{
		id: "1",
		email: "admin@gmail.com",
		username: "admin",
		password: "password123"
	},
	{
		id: "2",
		email: "saad@gmail.com",
		username: "saad",
		password: "12345678"
	},
];

/**
 * Authenticates a user using the provided sign-in credentials.
 * @param payload - The sign-in input data of type {@link SignInInput}.
 * @returns A promise resolving to {@link SignInResult}.
 * @throws An {@link ApiError} When the credentials are invalid.
 */
export async function signInService(payload: SignInInput): Promise<SignInResult> {
	const user = ValidUsers.find(
		(user) => user.username === payload.username && user.password === payload.password,
	);

	if (!user) {
		throw new ApiError(401, "Invalid credentials");
	}	

	return {
		token: "dummy-token", //* This will also be generated using JWT in the future
		message: "Signed in successfully",
		user: {
			id: user.id,
			email: user.email,
		},
	};
}

/**
 * Registers a new user with the provided sign-up payload.
 * @param payload - The sign-up input data of type {@link SignUpInput}.
 * @returns A promise resolving to {@link SignUpResult}.
 * @throws An {@link ApiError} When the email already exists.
 */
export async function signUpService(payload: SignUpInput): Promise<SignUpResult> {
	const existingUser = ValidUsers.find((user) => user.email === payload.email);
	if (existingUser) {
		throw new ApiError(400, "User already exists");
	}
	
	ValidUsers.push({
		id: String(ValidUsers.length + 1),
		email: payload.email,
		username: payload.username,
		password: payload.password,
	});

	// console.log("The newly added val is", ValidUsers.at(-1));

	return {
		message: "Signed up successfully",
		userId: String(ValidUsers.length),
	};
}