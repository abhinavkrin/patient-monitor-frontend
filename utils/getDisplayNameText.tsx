export const getDisplayNameText = (user) => {
	return (
		<div style={{
			display: "inline-flex",
			flexDirection: "row",
			alignItems: "center",
			gap: "0.5rem"
		}}>
			{user.displayName}
		</div>
	)
}
