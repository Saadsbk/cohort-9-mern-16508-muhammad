import { create } from "zustand";

export interface User {
	id: string;
	email: string;
	username: string;
}

export interface AuthState {
	accessToken: string | null;
	user: User | null;
	isLoading: boolean;
	actions: {
		setAccessToken: (accessToken: string) => void;
		setUser: (user: User) => void;
		login: (accessToken: string, user: User) => void;
		logout: () => void;
		logStore: () => void;
		storeCreated: () => boolean;
		setLoading: (isLoading: boolean) => void;
	};
}

const useAuth = create<AuthState>((set) => ({
	accessToken: null,
	user: null,
	isLoading: false,
	actions: {
		setAccessToken: (accessToken) => set({ accessToken }),
		setUser: (user) => set({ user }),
		login: (accessToken, user) => set({ accessToken, user, isLoading: false }),
		logout: () =>
			set({
				accessToken: null,
				user: null,
				isLoading: false,
			}),
		logStore: () => {
			console.log("Access Token: ", useAuth.getState()?.accessToken);
			console.log("User: ", useAuth.getState()?.user);
		},
		storeCreated: (): boolean => {
			const { accessToken, user } = useAuth.getState();
			return Boolean(accessToken && user?.id && user.email && user.username);
		},
		setLoading: (isLoading) => set({ isLoading }),
	},
}));

export default useAuth;

