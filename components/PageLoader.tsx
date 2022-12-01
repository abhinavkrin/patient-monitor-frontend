import { CircularProgress, Container } from "@mui/material"

export const PageLoader = () => {
	return (
		<Container sx={{
			height: "100vh",
			width: '100vw',
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center"
		}}>
			<CircularProgress size={"128px"} />
		</Container>
	)
}