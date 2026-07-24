import axios from "axios";
import type { SignInFormValues } from "@/schemas/signInSchema";
import type { SignUpFormValues } from "@/schemas/signUpSchema";

export async function signInUser(data: SignInFormValues) {
	const response = await axios.post("/api/auth/sign-in", data);
	return response.data;
}

export async function signUpUser(data: SignUpFormValues) {
	const response = await axios.post("/api/auth/sign-up", data);
	return response.data;
}