import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import BackgroundLayout from "@/components/custom/BackgroundLayout";
import { signInSchema, type SignInFormValues } from "@/schemas/signInSchema";
import { signInUser } from "@/api/authApi";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	CardAction,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, XCircleIcon } from "lucide-react";
import { Link, useLocation, useNavigate, type Location } from "react-router";
import useAuth from "@/store/auth";

export default function SignInPage() {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const fromLocation = (location.state as { from?: Location })?.from;
	const from = fromLocation
		? `${fromLocation.pathname}${fromLocation.search || ""}`
		: "/home";
	const login = useAuth((state)=>state.actions.login)
	// const logStore = useAuth((state)=>state.actions.logStore)

	const form = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const mutation = useMutation({
		mutationFn: signInUser,
		onSuccess: (data) => {
			login(data.accessToken, data.user);
			toast.add({
				title: "Signed in successful",
				type: "success",
			});
			// logStore();
			navigate(from, { replace: true });
		},
		onError: (error) => {
			toast.add({
				title: "Sign in failed",
				description: error.message,
				type: "error",
			});
		},
	});

	function onSubmit(data: SignInFormValues) {
		mutation.mutate(data);
	}
	return (
		<BackgroundLayout>
			<Card className="w-full sm:max-w-md bg-black/75 text-stone-200 backdrop-blur-md rounded-2xl">
				<CardHeader className="space-y-2">
					<CardTitle className="text-3xl font-semibold tracking-tight text-stone-200 text-center">
						Sign In
					</CardTitle>
					<CardDescription className="text-stone-300 text-center text-sm">
						Enter your username and password to access your account.
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
					<form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup className="gap-5">
							<Controller
								name="username"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel
											htmlFor="signin-username"
											className="text-stone-200 text-sm font-medium"
										>
											Username
										</FieldLabel>
										<Input
											{...field}
											id="signin-username"
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
								name="password"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel
											htmlFor="signin-password"
											className="text-stone-200 text-sm font-medium"
										>
											Password
										</FieldLabel>
										<div className="relative flex items-center">
											<Input
												{...field}
												id="signin-password"
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												aria-invalid={fieldState.invalid}
												autoComplete="current-password"
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
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between gap-4 pt-2 flex-col">
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
							form="signin-form"
							disabled={mutation.isPending}
							className="w-[45%] rounded-full bg-black text-white hover:bg-stone-100 hover:text-black border border-stone-700 transition-colors duration-200 font-medium"
						>
							{mutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing In...
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</div>
					<div className="text-center text-sm text-stone-400 mt-2">
						Don't have an account?{" "}
						<Link to="/sign-up" className="text-stone-200 hover:underline">
							Sign Up
						</Link>
					</div>
				</CardFooter>
			</Card>
		</BackgroundLayout>
	);
}
