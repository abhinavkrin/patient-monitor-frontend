import { useEffect, useState } from "react";
import Head from "next/head";
import { SITE_NAME } from "../../appConfig";
import StandardLayout from "../../layouts/standard";
import { Container, Tabs, Tab} from "@mui/material";
import { useAuth } from "../../components/auth/useAuth";
import { useRouter } from "next/router";
import Iconify from "../../components/Iconify";
import Profile from "../../components/account/Profile";
import ChangePassword from "../../components/account/ChangePassword";
import { withAuthUser } from "next-firebase-auth";

const accountNavOptions = [{
		icon: "eva:person-outline",
		text: "Profile",
		path: "profile",
		Component: () => <Profile />
	}, {
		icon: "eva:lock-outline",
		text: "Change Password",
		path: "reset-password",
		Component: () => <ChangePassword />
	}]

export interface IAccountProps {

}

const Account = ({}:IAccountProps) => {

	const user = useAuth();
	const router = useRouter();
	useEffect(() => {
		if(user.clientInitialized){
			if(!user.id){
				router.push(`/login?redirect=/account/profile`)
			}
		}
	},[user.clientInitialized, user.id, router])
	useEffect(() => {
		const idx = accountNavOptions.findIndex(o => o.path === router.query.tab);
		setTabIndex(Math.max(0,idx));
	},[router.query.tab]);

	const [tabIndex,setTabIndex] = useState(() => {
		const idx = accountNavOptions.findIndex(o => o.path === router.query.tab);
		return Math.max(0,idx);
	});
	const CurrentTab = accountNavOptions[tabIndex].Component;
	
	return (
		<StandardLayout title={accountNavOptions[tabIndex].text}>
			<Head>
				<title>{`${accountNavOptions[tabIndex].text} | ${SITE_NAME}`}</title>
				<meta
					name="description"
					content={`${SITE_NAME} IS ALL ABOUT TO PROVIDE BEST BGMI SCRIMS FOR THE ESPORTS PLAYERS ❤️`}
				/>
			</Head>
			<Container>
				<Tabs 
					value={tabIndex}
					aria-label="Account Nav" 
					scrollButtons="auto"
					variant="scrollable"
					allowScrollButtonsMobile={true}
					onChange={(_,newIndex) => {
						setTabIndex(newIndex);
						router.replace(`/account/${accountNavOptions[newIndex].path}`)
					}}
					sx={{
						height: "64px",
						marginBottom: 1
					}}>
					{accountNavOptions.map((option) => (
						<Tab
							key={option.path}
							icon={<Iconify icon={option.icon} />}
							iconPosition="start"
							label={option.text}
						/>
					))}
				</Tabs>
				<CurrentTab />
			</Container>
		</StandardLayout>
	);
}

export default withAuthUser()(Account);
