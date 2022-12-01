import { CardHeader, Container, Grid, Paper, Typography } from "@mui/material";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth"
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SITE_NAME } from "../../appConfig";
import { PageLoader } from "../../components/PageLoader";
import StandardLayout from "../../layouts/standard"
import { getDatabase, ref, query, orderByChild, limitToLast, onChildAdded } from "firebase/database";
import { ReadingChart } from "../../components/chart";
import { fDateTimeSuffix } from "../../utils/formatTime";
import { api } from "../../api";

const Monitor = () => {
	const router = useRouter();
	const user = useAuthUser();
	const deviceId = router.query.deviceId;
	const [pulseReadings, setPulseReadings] = useState([]);
	const [o2satReadings, setO2satReadings] = useState([]);
	const removePulseListener = useRef(null);
	const removeO2satListener = useRef(null);
	const [deviceInfo, setDeviceInfo] = useState({
		name: 'Unknown Device',
		id: "Unknown Id",
		registered_at: new Date().toString()
	});

	useEffect( () => {
		if(user.clientInitialized && user.id){
			const db = getDatabase();
			const recentPulseReadings = query(
				ref(db, "devices/" + deviceId + "/readings/pulse"),
				orderByChild("time"),
				limitToLast(20)
			);
			removePulseListener.current = onChildAdded(recentPulseReadings,(snapshot) => {
				setPulseReadings(pr => pr.concat([snapshot.val()]).slice(-30));
			});
		}
		return removePulseListener.current;
	},[deviceId, user.clientInitialized, user.id]);

	useEffect(() => {
		if (user.clientInitialized && user.id) {
			const db = getDatabase();
			const recentO2satReadings = query(
				ref(db, "devices/" + deviceId + "/readings/o2sat"),
				orderByChild("time"),
				limitToLast(20)
			);
			removeO2satListener.current = onChildAdded(recentO2satReadings, (snapshot) => {
				setO2satReadings(pr => pr.concat([snapshot.val()]).slice(-30));
			});
			api('GET', `/devices/${deviceId}`)
				.then(setDeviceInfo)
				.catch(console.error);
		}
		return removeO2satListener.current;
	}, [deviceId, user.clientInitialized, user.id]);

	const pulseChartData = useMemo(() => {
		const labels = [];
		const data = [];
		const readings = pulseReadings
			.sort((a, b) => a.time - b.time)
			.slice(-20);
		readings
			.forEach(r => {
				const d = new Date(r.time);
				const time = `${d.getMinutes()}:${d.getSeconds()}`;
				labels.push(time);
				data.push(r.value);
			});
		return {
			labels,
			data,
			lastUpdated: fDateTimeSuffix(
				new Date(readings[readings.length - 1]?.time || new Date())
			),
		};
	}, [pulseReadings]);

	const o2satChartData = useMemo(() => {
		const labels = [];
		const data = [];
		const readings = o2satReadings
			.sort((a, b) => a.time - b.time)
			.slice(-20);
		readings
			.forEach(r => {
				const d = new Date(r.time);
				const time = `${d.getMinutes()}:${d.getSeconds()}`;
				labels.push(time);
				data.push(r.value);
			});
		return {
			labels,
			data,
			lastUpdated: fDateTimeSuffix(
				new Date(readings[readings.length - 1]?.time || new Date())
			),
		};
	}, [o2satReadings]);


	if (!user.id) {
		return null;
	}
	return (
		<StandardLayout title="Monitor Device">
			<Head>
				<title>{`Monitor Device | ${SITE_NAME}`}</title>
			</Head>
			<Container>
				<Grid container>
					<Grid item xs={12} md={6}>
						<Paper elevation={6} sx={{
							paddingBottom: 2
						}}>
							<CardHeader title="Monitor Device" />
							<Typography sx={{paddingX: 3}} variant="body2">Device ID: {deviceId}</Typography>
							<Typography sx={{paddingX: 3}} variant="body2">Name: {deviceInfo.name}</Typography>
							<Typography sx={{paddingX: 3}} variant="body2">Reg. Date: {fDateTimeSuffix(deviceInfo.registered_at)}</Typography>
						</Paper>
					</Grid>
					<Grid item container sx={{
						marginY: 2
					}}>
						<Grid item container xs={12} spacing={2}>
							<Grid item xs={12} md={6}>
								<Paper elevation={6}>
									<ReadingChart
										title="Pulse"
										subheader={
											<>
												<Typography sx={{
													fontSize: "2rem"
												}}>
													{(pulseChartData.data.slice(-1)[0] || "") + ` bpm`}
												</Typography>
												<Typography variant="body2">
													Last updated {pulseChartData.lastUpdated}
												</Typography>
											</>
										}
										chartLabels={pulseChartData.labels}
										chartData={[
											{
												name: "pulse",
												type: 'line',
												data: pulseChartData.data,
											},
										]}
										unit="bpm"
									/>
								</Paper>
							</Grid>
							<Grid item xs={12} md={6}>
								<Paper elevation={6}>
									<ReadingChart
										title="O2 Sat"
										subheader={
											<>
												<Typography sx={{
													fontSize: "2rem"
												}}>
													{(o2satChartData.data.slice(-1)[0] || "") + `%`}
												</Typography>
												<Typography variant="body2">
													Last updated {o2satChartData.lastUpdated}
												</Typography>
											</>
										}
										unit="%"
										chartLabels={o2satChartData.labels}
										chartData={[
											{
												name: "O2 sat",
												type: 'line',
												data: o2satChartData.data,
											},
										]}
									/>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</StandardLayout>
	)
}

export default withAuthUser({
	whenAuthed: AuthAction.RENDER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	authPageURL: '/login?redirect=/monitor',
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
	LoaderComponent: PageLoader
})(Monitor);