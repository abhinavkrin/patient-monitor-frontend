/* eslint-disable @next/next/no-img-element */
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/Logo';
import RouterLink from 'next/link';
import { useAuth } from '../components/auth/useAuth';
import { withAuthUser } from 'next-firebase-auth';
import ResetPasswordForm from '../components/auth/resetPassword/ResetPasswordForm';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex',
	},
}));

const HeaderStyle = styled('header')(({ theme }) => ({
	top: 0,
	zIndex: 9,
	lineHeight: 0,
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	position: 'absolute',
	padding: theme.spacing(3),
	justifyContent: 'space-between',
	[theme.breakpoints.up('md')]: {
		alignItems: 'flex-start',
		padding: theme.spacing(7, 5, 0, 7),
	},
}));

const SectionStyle = styled(Card)(({ theme }) => ({
	width: '100%',
	maxWidth: 464,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
	maxWidth: 480,
	margin: 'auto',
	minHeight: '100vh',
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default withAuthUser()(function Login() {
	const smUp = useResponsive('up', 'sm');

	const mdUp = useResponsive('up', 'md');

	const user = useAuth();

	return (
		<>
			<RootStyle>
				<HeaderStyle>
					<Logo />

					{smUp && (
						<Typography variant="body2" sx={{ mt: { md: -2 } }}>
							{
								user.id ?
									<RouterLink href="/account">
										<Link variant="subtitle2">Back to Account</Link>
									</RouterLink>
								:
									<RouterLink href="/login">
										<Link variant="subtitle2">Back to Login</Link>
									</RouterLink>
							}
						</Typography>
					)}
				</HeaderStyle>

				{mdUp && (
					<SectionStyle>
						<Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
							Hi, Welcome Back
						</Typography>
						<img
							src="/static/illustrations/illustration_login.png"
							alt="login"
						/>
					</SectionStyle>
				)}

				<Container maxWidth="sm">
					<ContentStyle>
						<Typography variant="h4" gutterBottom>
							Reset your password
						</Typography>

						<ResetPasswordForm />
					</ContentStyle>
				</Container>
			</RootStyle>
		</>
	);
})
