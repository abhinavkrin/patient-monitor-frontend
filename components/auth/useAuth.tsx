import { useAuthUser } from "next-firebase-auth"

export const useAuth = () => {
	const user = useAuthUser();
	return user;
}