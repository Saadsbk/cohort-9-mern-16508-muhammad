import { Link } from "react-router";
import BackgroundLayout from "@/components/custom/BackgroundLayout";

const LandingPage = () => {
	return (
		<BackgroundLayout>
			<div className="flex flex-col ">
				<div className="z-10 max-w-2xl mb-10">
					<h1 className="text-5xl font-semibold tracking-tight text-stone-200 md:text-6xl">
						Notely
					</h1>

					<p className="mt-5 text-lg leading-relaxed text-stone-200">
						A minimalist & simple note taking application.
					</p>
				</div>
				<div >
					<div className="z-10 flex justify-evenly">
						<Link
							to="/sign-up"
							className="w-[30%] bg-black text-white border border-0.1 border-stone-700 hover:bg-stone-100 hover:text-black transition-colors duration-200 text-center rounded-full px-4 py-2 min-w-24"
						>
							Sign Up
						</Link>
						<Link
							to="/sign-in"
							className="w-[30%] bg-black text-white border border-0.1 border-stone-700 hover:bg-stone-100 hover:text-black transition-colors duration-200 text-center rounded-full px-4 py-2 min-w-24"
						>
							Sign In
						</Link>
				</div>
				</div>
			</div>
		</BackgroundLayout>
	);
}

export default LandingPage;
