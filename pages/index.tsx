import React, {  } from 'react';
import Head from 'next/head';
import StandardLayout from '../layouts/standard';
import { Alert, AlertTitle, Button, CardHeader, Container, Grid, List, ListItemButton, ListItemText, Paper } from "@mui/material";
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { SITE_NAME } from '../appConfig';
import { api } from '../api';
import Link from 'next/link';

interface HomeProps {
	devices: {
		id: string;
		name: string;
		registered_at: string;
	}[];
}
function Home({devices}: HomeProps) {
  return (
		<StandardLayout title="Home">
			<Head>
				<title>Home | {SITE_NAME}</title>
				<meta
					name="description"
					content={`Monitor patient's vitals remotely ❤️`}
				/>
			</Head>
			<Container>
				<Grid container>
					<Grid item xs={12} md={6}>
						<Paper elevation={6} sx={{
							paddingBottom: 3
						}}>
							<CardHeader title="Devices"></CardHeader>
							{ devices.length === 0 ? 
									<Alert color="info" sx={{marginX: 3}}>
										<AlertTitle>No Devices Added</AlertTitle>
										<Link href="/add-device">
											<a>
											<Button variant="contained" size="small">Add Device</Button>
											</a>
										</Link>
									</Alert> :
									null
							}
							<List>
								{devices.map(device => (
									<Link passHref href={`/monitor/${device.id}`} key={device.id}>
										<ListItemButton component="a">
											<ListItemText>
												{device.name}
											</ListItemText>
										</ListItemButton>
									</Link>
								))}
							</List>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</StandardLayout>
  );
}

export default withAuthUser({
	whenAuthed: AuthAction.RENDER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	authPageURL: '/login'
})(Home);

export const getServerSideProps = withAuthUserTokenSSR({
	whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async (ctx) => {
	const token = await ctx.AuthUser.getIdToken();
	if(token){
		const devices = await api('GET', '/devices',null, token);
		return {
			props: {
				devices
			}
		}
	} else {
		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		}
	}
})