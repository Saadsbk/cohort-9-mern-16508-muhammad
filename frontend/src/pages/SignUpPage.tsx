import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import BackgroundLayout from "@/components/custom/BackgroundLayout";
import { signUpSchema, type SignUpFormValues } from "@/schemas/signUpSchema";
import { signUpUser } from "@/api/authApi";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	CardAction
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, XCircleIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function SignUpPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();	
	
	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const mutation = useMutation({
		mutationFn: signUpUser,
		onSuccess: () => {
			toast.add({
				title: "Sign up successful",
				type: "success",
			});
		},
		onError: (error) => {
			toast.add({
				title: "Sign up failed",
				description: error.message,
				type: "error",
			});
		},
	});

	function onSubmit(data: SignUpFormValues) {
		mutation.mutate(data);
	}

	return (
		<BackgroundLayout>
			<Card className="w-full sm:max-w-md bg-black/75 text-stone-200 backdrop-blur-md rounded-2xl">
				<CardHeader className="space-y-2">
					<CardTitle className="text-3xl font-semibold tracking-tight text-stone-200 text-center">
						Sign Up
					</CardTitle>
					<CardDescription className="text-stone-300 text-center text-sm">
						Create an account to get started.
					</CardDescription>
					<CardAction>
						<Button
							className="absolute right-3 top-3 bg-transparent hover:bg-transparent hover:cursor-pointer text-stone-400 hover:text-stone-50  transition-colors"
							onClick={() => navigate("/")}
						>
							<XCircleIcon className="absolute "></XCircleIcon>
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup className="gap-5">
							<Controller
								name="username"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel
											htmlFor="signup-username"
											className="text-stone-200 text-sm font-medium"
										>
											Username
										</FieldLabel>
										<Input
											{...field}
											id="signup-username"
											type="text"
											placeholder="Enter your username"
											aria-invalid={fieldState.invalid}
											autoComplete="username"
											className="bg-stone-900/80 border-stone-700 text-stone-100 placeholder:text-stone-400 focus-visible:ring-stone-400 focus-visible:ring-1"
										/>
										{fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
												className="text-red-400 text-xs"
											/>
										)}
									</Field>
								)}
							/>

							<Controller
								name="email"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel
											htmlFor="signup-email"
											className="text-stone-200 text-sm font-medium"
										>
											Email
										</FieldLabel>
										<Input
											{...field}
											id="signup-email"
											type="email"
											placeholder="Enter your email"
											aria-invalid={fieldState.invalid}
											autoComplete="email"
											className="bg-stone-900/80 border-stone-700 text-stone-100 placeholder:text-stone-400 focus-visible:ring-stone-400 focus-visible:ring-1"
										/>
										{fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
												className="text-red-400 text-xs"
											/>
										)}
									</Field>
								)}
							/>

							<Controller
								name="password"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel
											htmlFor="signup-password"
											className="text-stone-200 text-sm font-medium"
										>
											Password
										</FieldLabel>
										<div className="relative flex items-center">
											<Input
												{...field}
												id="signup-password"
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												aria-invalid={fieldState.invalid}
												autoComplete="new-password"
												className="bg-stone-900/80 border-stone-700 text-stone-100 placeholder:text-stone-400 focus-visible:ring-stone-400 focus-visible:ring-1 pr-10"
											/>
											<button
												type="button"
												onClick={() => setShowPassword((prev) => !prev)}
												className="cursor-pointer size-9 rounded-r-2xl absolute right-0 text-stone-400 hover:text-stone-50  transition-colors"
												aria-label={
													showPassword ? "Hide password" : "Show password"
												}
											>
												{showPassword ? (
													<EyeOff className="absolute h-4 w-4 right-3 top-2.5" />
												) : (
													<Eye className="absolute h-4 w-4 right-3 top-2.5" />
												)}
											</button>
										</div>
										{fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
												className="text-red-400 text-xs"
											/>
										)}
									</Field>
								)}
							/>

							<Controller
								name="confirmPassword"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel
											htmlFor="signup-confirm-password"
											className="text-stone-200 text-sm font-medium"
										>
											Confirm Password
										</FieldLabel>
										<div className="relative flex items-center">
											<Input
												{...field}
												id="signup-confirm-password"
												type={showConfirmPassword ? "text" : "password"}
												placeholder="••••••••"
												aria-invalid={fieldState.invalid}
												autoComplete="new-password"
												className="bg-stone-900/80 border-stone-700 text-stone-100 placeholder:text-stone-400 focus-visible:ring-stone-400 focus-visible:ring-1 pr-10"
											/>
											<button
												type="button"
												onClick={() => setShowConfirmPassword((prev) => !prev)}
												className="cursor-pointer size-9 rounded-r-2xl absolute right-0 text-stone-400 hover:text-stone-50  transition-colors"
												aria-label={
													showConfirmPassword
														? "Hide confirm password"
														: "Show confirm password"
												}
											>
												{showConfirmPassword ? (
													<EyeOff className="absolute h-4 w-4 right-3 top-2.5" />
												) : (
													<Eye className="absolute h-4 w-4 right-3 top-2.5" />
												)}
											</button>
										</div>
										{fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
												className="text-red-400 text-xs"
											/>
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col gap-4 pt-2">
					<div className="flex w-full justify-between gap-4">
						<Button
							type="button"
							variant="outline"
							disabled={mutation.isPending}
							className="w-[45%] rounded-full bg-black text-white hover:bg-stone-100 hover:text-black border border-stone-700 transition-colors duration-200"
							onClick={() => form.reset()}
						>
							Reset
						</Button>
						<Button
							type="submit"
							form="signup-form"
							disabled={mutation.isPending}
							className="w-[45%] rounded-full bg-black text-white hover:bg-stone-100 hover:text-black border border-stone-700 transition-colors duration-200"
						>
							{mutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing Up...
								</>
							) : (
								"Sign Up"
							)}
						</Button>
					</div>
					<div className="text-center text-sm text-stone-400 mt-2">
						Already have an account?{" "}
						<Link to="/sign-in" className="text-stone-200 hover:underline">
							Sign In
						</Link>
					</div>
				</CardFooter>
			</Card>
		</BackgroundLayout>
	);
}
