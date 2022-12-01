import { useAuthUser, withAuthUser } from "next-firebase-auth"
import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthObserver = () => {
	const user = useAuthUser();
	const router = useRouter();
	useEffect(() => {
		//logic goes here
	},[router, user.id])
	return null;
}

export default withAuthUser()(AuthObserver);