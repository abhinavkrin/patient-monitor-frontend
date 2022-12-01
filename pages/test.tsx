import { useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth"

const Test = () => {
	const user = useAuthUser();
	return <div>You are {user.email}</div>
}

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Test);