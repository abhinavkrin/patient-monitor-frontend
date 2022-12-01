/* eslint-disable @next/next/no-img-element */
// @mui
import { styled } from "@mui/material/styles";
import { Card, Link, Container, Typography } from "@mui/material";
// hooks
import useResponsive from "../hooks/useResponsive";
// components
import Logo from "../components/Logo";
// sections
import RouterLink from "next/link";
import { SITE_NAME } from "../appConfig";
import AuthSocial from "../components/auth/AuthSocial";
import { RegisterForm } from "../components/auth/register";
import { useState, useEffect } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	FacebookAuthProvider,
	fetchSignInMethodsForEmail,
	getAuth,
	GoogleAuthProvider,
	linkWithCredential,
	OAuthProvider,
	signInWithPopup,
	updateProfile,
	EmailAuthProvider,
	sendEmailVerification
} from "firebase/auth";
import { useRouter } from "next/router";
import { LoginForm } from "../components/auth/login";
import { useAuth } from "../components/auth/useAuth";
import {withAuthUser} from 'next-firebase-auth';

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
	[theme.breakpoints.up("md")]: {
		display: "flex",
	},
}));

const HeaderStyle = styled("header")(({ theme }) => ({
	top: 0,
	zIndex: 9,
	lineHeight: 0,
	width: "100%",
	display: "flex",
	alignItems: "center",
	position: "absolute",
	padding: theme.spacing(3),
	justifyContent: "space-between",
	[theme.breakpoints.up("md")]: {
		alignItems: "flex-start",
		padding: theme.spacing(7, 5, 0, 7),
	},
}));

const SectionStyle = styled(Card)(({ theme }) => ({
	width: "100%",
	maxWidth: 464,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
	maxWidth: 480,
	margin: "auto",
	minHeight: "100vh",
	display: "flex",
	justifyContent: "center",
	flexDirection: "column",
	padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

function Register() {
	const smUp = useResponsive("up", "sm");

	const mdUp = useResponsive("up", "md");

	const [error, setError] = useState("");
	const [diffCredError, setDiffCredError] = useState(null);
	const [progress, setProgress] = useState(false);
	const router = useRouter();
	const user = useAuth();

	useEffect(() => {
		if(user.id){
			router.push('/');
		}
	},[user.id, router]);

	const onSignUpClick = async ({ fullName, email, password }) => {
		setProgress(true);
		try {
			const result = await createUserWithEmailAndPassword(
				getAuth(),
				email,
				password
			);
			setError("");
			await updateProfile(result.user, { displayName: fullName });
			await sendEmailVerification(result.user)
			router.push("/");
		} catch (error) {
			setProgress(false);
			switch (error.code) {
				case "auth/invalid-email":
					setError("Invalid email");
					break;
				case "auth/weak-password":
					setError("Weak password");
					break;
				case "auth/email-already-in-use":
					setError("Email already in use");
					break;
				case "auth/invalid-display-name":
					setError("Imvalid fullname");
					break;
				default:
					setError("Uknown error occurred");
					console.error(error);
			}
		}
	};

	const registerFormSubmit = async (data) => {
		onSignUpClick(data);
	};

	const doEmailPasswordLogin = async ({ email, password }) => {
		if (progress) {
			return true;
		}
		setProgress(true);
		try {
			const userCred = await signInWithEmailAndPassword(
				getAuth(),
				email,
				password
			);

			if (
				diffCredError?.oldProvider?.providerId ===
				EmailAuthProvider.PROVIDER_ID
			) {
				// The signin was requested to link new credentials with the account
				await linkWithCredential(
					userCred.user,
					OAuthProvider.credentialFromError(diffCredError.error)
				);
			}
		} catch (error) {
			switch (error.code) {
				case "auth/user-not-found":
					setError("User not found");
					break;
				case "auth/wrong-password":
					setError("Incorrect Password");
					break;
				default:
					setError("Unknown error occurred");
			}
		} finally {
			setProgress(false);
		}
	};
	const onLoginFormSubmit = (data) => {
		doEmailPasswordLogin(data);
	};

	const handleProviderSignIn = async (provider) => {
		if (progress) {
			return;
		}
		const auth = getAuth();
		try {
			const userCred = await signInWithPopup(auth, provider);
			if (diffCredError) {
				// The signin was requested to link new credentials with the account
				await linkWithCredential(
					userCred.user,
					OAuthProvider.credentialFromError(diffCredError.error)
				);
			}
		} catch (e) {
			switch (e.code) {
				case "auth/popup-closed-by-user":
				case "auth/cancelled-popup-request":
					break;
				case "auth/popup-blocked":
					setError("Popup blocked by your browser.");
					break;
				case "auth/account-exists-with-different-credential":
					const methods = await fetchSignInMethodsForEmail(
						auth,
						e.customData.email
					);
					setDiffCredError({
						error: e,
						newProviderId: provider.providerId,
						oldProviderId: methods[0],
					});
					setError(`User&apos;s email already exists. Sign in with ${diffCredError.oldProvider.providerId} to link your ${diffCredError.newProvider.providerId} account.`)
					break;
				default:
					setError("Unknown error occurred");
			}
			setProgress(false);
		}
	};

	const onGoogleBtnClick = () => {
		if (progress) {
			return;
		}
		setProgress(true);
		const provider = new GoogleAuthProvider();
		handleProviderSignIn(provider);
	};

	const onFacebookBtnClick = () => {
		if (progress) {
			return;
		}
		setProgress(true);
		const provider = new FacebookAuthProvider();
		handleProviderSignIn(provider);
	};

	return (
		<>
			<RootStyle>
				<HeaderStyle>
					<Logo />
					{smUp && (
						<Typography variant="body2" sx={{ mt: { md: -2 } }}>
							Already have an account? {""}
							<RouterLink href="/login">
								<Link variant="subtitle2">Login</Link>
							</RouterLink>
						</Typography>
					)}
				</HeaderStyle>

				{mdUp && (
					<SectionStyle>
						<Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
							{SITE_NAME} says Hi ❤️
						</Typography>
						<img
							alt="register"
							src="/static/illustrations/illustration_register.png"
						/>
					</SectionStyle>
				)}

				<Container>
					<ContentStyle>
						<Typography variant="h4" gutterBottom>
							Create your {SITE_NAME} account
						</Typography>

						<AuthSocial
							googleHandler={onGoogleBtnClick}
							facebookHandler={onFacebookBtnClick}
							twitterHandler={() => {}}
						/>

						{diffCredError?.oldProvider?.providerId ===
						EmailAuthProvider.PROVIDER_ID ? (
							<LoginForm onSubmit={onLoginFormSubmit} />
						) : (
							<RegisterForm onSubmit={registerFormSubmit} />
						)}

						<Typography
							variant="body2"
							align="center"
							sx={{ color: "red", mt: 3 }}
						>
							{error}
						</Typography>

						<Typography
							variant="body2"
							align="center"
							sx={{ color: "text.secondary", mt: 3 }}
						>
							By registering, I agree to {SITE_NAME}&nbsp;
							<RouterLink href="#">
								<Link underline="always" color="text.primary">
									Terms of Service
								</Link>
							</RouterLink>{" "}
							and{" "}
							<RouterLink href="#">
								<Link underline="always" color="text.primary">
									Privacy Policy
								</Link>
							</RouterLink>
							.
						</Typography>

						{!smUp && (
							<Typography
								variant="body2"
								sx={{ mt: 3, textAlign: "center" }}
							>
								Already have an account?{" "}
								<RouterLink href="/login">
									<Link
										underline="always"
										color="text.primary"
									>
										login
									</Link>
								</RouterLink>
							</Typography>
						)}
					</ContentStyle>
				</Container>
			</RootStyle>
		</>
	);
}

export default withAuthUser()(Register);