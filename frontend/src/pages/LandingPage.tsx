import { Link } from "react-router";
import BackgroundLayout from "@/components/custom/BackgroundLayout";

const LandingPage = () => {
	return (
		<BackgroundLayout>
			<div className="z-10 max-w-2xl">
				<h1 className="text-5xl font-semibold tracking-tight text-stone-200 md:text-6xl">
					Notely
				</h1>

				<p className="mt-5 text-lg leading-relaxed text-stone-200">
					A minimalist & simple note taking application.
				</p>
			</div>

			<div className="z-10 flex gap-10">
				<Link
					to="/sign-up"
					className="bg-black text-white border border-0.1 border-stone-700 hover:bg-stone-100 hover:text-black transition-colors duration-200 justify-center items-center flex rounded-full px-4 py-2 min-w-24"
				>
					Sign Up
				</Link>
				<Link
					to="/sign-in"
					className="bg-black text-white border border-0.1 border-stone-700 hover:bg-stone-100 hover:text-black transition-colors duration-200 justify-center items-center flex rounded-full px-4 py-2 min-w-24"
				>
					Sign In
				</Link>
			</div>
		</BackgroundLayout>
	);
}

export default LandingPage;
