import { LoadingButton } from "@mui/lab";
import { CardHeader, Container, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth"
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEventHandler, useRef, useState } from "react";
import { api } from "../api";
import { SITE_NAME } from "../appConfig";
import { PageLoader } from "../components/PageLoader";
import StandardLayout from "../layouts/standard"

const AddDevice = () => {
	const user = useAuthUser();

	const [deviceToken,setDeviceToken] = useState("");
	const [name,setName] = useState("");

	const [error, setError] = useState("");

	const [loading, setLoading] = useState(false);

	const apiCalling = useRef(false);

	const router = useRouter();

	const onSubmit: FormEventHandler<HTMLFormElement>= async (e) => {
		e.preventDefault();
		if(apiCalling.current)
			return;
		setLoading(true);
		apiCalling.current = true;
		setError("");
		try {
			const deviceId = (await api('POST', '/devices', {
				deviceToken,
				name: name.trim()
			})).deviceId;
			router.push(`monitor/${deviceId}`);
		} catch(e){
			console.error(e);
			if(e instanceof AxiosError){
				setError(e?.response?.data?.msg || e.message);
			} else {
				setError(e.message);
			}
		} finally {
			apiCalling.current = false;
			setLoading(false);
		}
	} 
	if(!user.id){
		return null;
	}
	return (
		<StandardLayout title="Add Device">
			<Head>
				<title>{`Add Device | ${SITE_NAME}`}</title>
			</Head>
			<Container>
				<Grid container>
					<Grid item xs={12} md={6}>
						<Paper elevation={6}>
							<CardHeader title="Add device"/>
							<form onSubmit={onSubmit} style={{display: "contents"}}>
								<Stack direction="column" spacing={2} sx={{paddingX: 3, paddingY: 2}}>
									<TextField
									value={deviceToken}
									onChange={e => setDeviceToken(e.target.value.trim())} 
									label="Device Token"/>
									<TextField
										value={name}
										onChange={e => setName(e.target.value)}
										label="Name" />
									<LoadingButton variant="contained" type="submit" disabled={loading} loading={loading}>
										Add Device
									</LoadingButton>
									<Typography variant="body2" color="error">{error}</Typography>
								</Stack>
							</form>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</StandardLayout>
	)
}

export default withAuthUser({
	whenAuthed: AuthAction.RENDER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	authPageURL: '/login?redirect=/add-device',
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
	LoaderComponent: PageLoader
})(AddDevice);