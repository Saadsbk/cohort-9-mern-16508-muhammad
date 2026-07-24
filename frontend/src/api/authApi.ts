import axios from "axios";
import type { SignInFormValues } from "@/schemas/signInSchema";
import type { SignUpFormValues } from "@/schemas/signUpSchema";

export async function signInUser(data: SignInFormValues) {
	try {
		const response = await axios.post("/api/auth/sign-in", data);
		return response.data;
	} catch (error) {
		// Simulated api working (for now)
		await new Promise((resolve) => setTimeout(resolve, 600));
		if (
			data.username.toLowerCase() === "fail" ||
			data.password === "error123"
		) {
			throw new Error("Invalid credentials", { cause: error });
		}

		return { success: true, message: "Sign in successful" };
	}
}

export async function signUpUser(data: SignUpFormValues) {
	try {
		const response = await axios.post("/api/auth/sign-up", data);
		// console.log("data", data);
		return response.data;
	} catch (error) {
		// Simulated api working (for now)
		await new Promise((resolve) => setTimeout(resolve, 600));
		if (data.username.toLowerCase() === "fail") {
			throw new Error("Registration failed", { cause: error });
		}

		return { success: true, message: "Sign up successful" };
	}
}
