import * as z from "zod";

export const signInSchema = z.object({
	username: z
		.string()
		.min(2, { message: "Username must be at least 2 characters." })
		.max(30, { message: "Username must be at most 30 characters." }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters." }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
