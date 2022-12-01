import { CardHeader, Container, Grid, Paper, Stack, TextField, Button } from "@mui/material";
import axios from "axios";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth"
import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BASE_API_URL, SITE_NAME } from "../appConfig";
import { ReadingChart } from "../components/chart";
import Iconify from "../components/Iconify";
import StandardLayout from "../layouts/standard"
import { generateRandomReading } from "../utils/generateRandomReading";
import LinearProgress from '@mui/material/LinearProgress';


const SimulateDevice = () => {	
	const user = useAuthUser();

	const [deviceToken, setDeviceToken] = useState("1234");

	const [paused, setPaused] = useState(true);

	const [readings,setReadings] = useState([]);

	const interval = useRef<any>(null);

	const sendData = useCallback(async () => {
		if(paused)
			return;
		const reading = generateRandomReading();
		const newR = {reading, time: new Date()}
		await axios({
			baseURL: BASE_API_URL,
			url: '/readings',
			headers: {
				DeviceToken: deviceToken
			},
			data: {
				r: reading
			},
			method: "POST"
		})
		setReadings(r => {
			const nr = r.concat([newR]);
			if(nr.length >= 100){
				nr.shift()
			}
			return nr;
		});
	},[deviceToken, paused])

	useEffect( () => {
		if(interval.current)
			return;
		interval.current = setInterval(sendData,2000);
		return () => {
			clearInterval(interval.current)
			interval.current = null;
		};
	},[sendData])

	const pulseChartData = useMemo(() => {
		const labels = [];
		const data = [];
		readings
			.filter(r => r.reading.n === "pulse")
			.sort((a,b) => a.time.getTime() - b.time.getTime())
			.slice(-20)
			.forEach(r => {
				const d = r.time;
				const time = `${d.getMinutes()}:${d.getSeconds()}`;
				labels.push(time);
				data.push(r.reading.v);
			});
		return {labels,data};
	}, [readings])

	const bpChartData = useMemo(() => {
		const labels = [];
		const data = [[],[]];
		readings
			.filter(r => r.reading.n === "bp")
			.sort((a, b) => a.time.getTime() - b.time.getTime())
			.slice(-20)
			.forEach(r => {
				const d = r.time;
				const time = `${d.getMinutes()}:${d.getSeconds()}`;
				labels.push(time);
				data[0].push(r.reading.v.s);
				data[1].push(r.reading.v.d);
			});
		return { labels, data };
	}, [readings])

	const o2satChartData = useMemo(() => {
		const labels = [];
		const data = [];
		readings
			.filter(r => r.reading.n === "o2sat")
			.sort((a, b) => a.time.getTime() - b.time.getTime())
			.slice(-20)
			.forEach(r => {
				const d = r.time;
				const time = `${d.getMinutes()}:${d.getSeconds()}`;
				labels.push(time);
				data.push(r.reading.v);
			});
		return { labels, data };
	}, [readings])

	const tempChartData = useMemo(() => {
		const labels = [];
		const data = [];
		readings
			.filter(r => r.reading.n === "temp")
			.sort((a,b) => a.time.getTime() - b.time.getTime())
			.slice(-20)
			.forEach(r => {
				const d = r.time;
				const time = `${d.getMinutes()}:${d.getSeconds()}`;
				labels.push(time);
				data.push(r.reading.v);
			});
		return {labels,data};
	}, [readings])

	if (!user.id) {
		return null;
	}
	return (
		<StandardLayout title="Simulate Device">
			<Head>
				<title>{`Simulate Device | ${SITE_NAME}`}</title>
			</Head>
			<Container>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Paper elevation={6}>
							<CardHeader title="Simulate device" />
							<Stack
								direction="column"
								spacing={2}
								sx={{ paddingX: 3, paddingY: 2 }}
							>
								<TextField
									disabled
									value={deviceToken}
									onChange={(e) =>
										setDeviceToken(e.target.value.trim())
									}
									label="Device Token"
								/>
								<Stack direction="row" spacing={2}>
									{/* <Button
										startIcon={<Iconify icon="bi:robot" />}
										variant="contained"
										onClick={simulate}
									>
										Simulate
									</Button> */}
									<Button
										startIcon={
											<Iconify
												icon={
													paused
														? "material-symbols:play-arrow"
														: "material-symbols:pause-outline"
												}
											/>
										}
										variant="contained"
										onClick={() => setPaused((p) => !p)}
									>
										{paused ? "Resume" : "Pause"}
									</Button>
								</Stack>
								{
									!paused ?
										<LinearProgress /> :
										null
								}
							</Stack>
						</Paper>
					</Grid>
					<Grid item container xs={12} spacing={2}>
						<Grid item xs={12} md={6}>
							<Paper elevation={6}>
								<ReadingChart
									title="Pulse"
									subheader=""
									unit="bpm"
									chartLabels={pulseChartData.labels}
									chartData={[
										{
											name: "pulse",
											type: 'line',
											data: pulseChartData.data,
										},
									]}
								/>
							</Paper>
						</Grid>
						<Grid item xs={12} md={6}>
							<Paper elevation={6}>
								<ReadingChart
									unit="%"
									title="O2 Sat"
									subheader=""
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
						<Grid item xs={12} md={6}>
							<Paper elevation={6}>
								<ReadingChart
									unit="F"
									title="Body Temperature"
									subheader=""
									chartLabels={tempChartData.labels}
									chartData={[
										{
											name: "Temp",
											type: 'line',
											data: tempChartData.data,
										},
									]}
								/>
							</Paper>
						</Grid>
						<Grid item xs={12} md={6}>
							<Paper elevation={6}>
								<ReadingChart
									title="Blood Pressure"
									subheader=""
									chartLabels={bpChartData.labels}
									unit="mmHg"
									chartData={
										bpChartData.data.map((d, idx) => ({
											name: idx === 0 ? "Systolic" : "Diastolic",
											type: 'line',
											data: d,
										}))}
										/>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</StandardLayout>
	);
}

export default withAuthUser({
	whenAuthed: AuthAction.RENDER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	authPageURL: '/login?redirect=/simulate'
})(SimulateDevice);