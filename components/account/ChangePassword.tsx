import React, { useEffect } from "react";
import { Grid, Card, Typography} from "@mui/material";
import { useRouter } from "next/router";
import {useAuth} from '../auth/useAuth';
import ResetPasswordForm from "../auth/resetPassword/ResetPasswordForm";
export interface IChangePasswordProps {

}


const ChangePassword = () => {

	const user = useAuth();
	const router = useRouter();
	
	useEffect(() => {
		if (user.clientInitialized) {
			if (!user.id) {
				router.push(`/login?redirect=/account`)
			}
		}
	}, [user.clientInitialized, user.id, router])
	return (
		<Grid container>
			<Grid item xs={12} md={6} sx={{ padding: 1 }}>
				<Card sx={{
					padding: 2,
				}}>
					<Typography variant="subtitle1" gutterBottom>
						Change Password
					</Typography>
					<ResetPasswordForm />
				</Card>
			</Grid>
		</Grid>
	)
}

export default ChangePassword;
