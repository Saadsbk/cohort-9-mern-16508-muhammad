import * as z from "zod";

export const signUpSchema = z
	.object({
		username: z
			.string()
			.min(2, { message: "Username must be at least 2 characters." })
			.max(30, { message: "Username must be at most 30 characters." }),
		email: z // Useful for password recovery if we want to add that in the future
			.email({ message: "Invalid email address." }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters." }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
