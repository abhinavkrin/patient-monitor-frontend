export default function Account(){
	return null;
}
export const getServerSideProps = () => {
	return {
		redirect: {
			destination: '/account/profile'
		}
	}
}