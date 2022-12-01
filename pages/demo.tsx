import { AuthAction, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth"
import StandardLayout from "../layouts/standard"

const Demo = () => {
	return (
		<StandardLayout title="Demo">

		</StandardLayout>
	)
}

export default withAuthUser({
	whenAuthed: AuthAction.RENDER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	authPageURL: '/login?redirect=/demo'
})(Demo);

export const getServerSideProps = withAuthUserTokenSSR({
	whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async () => {
	return {
		props: {

		}
	}
})