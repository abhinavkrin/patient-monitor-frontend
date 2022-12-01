import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Alert, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { useAuth } from '../useAuth';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
// ----------------------------------------------------------------------

export default function ResetPasswordForm() {

	const user = useAuth();
	const [error,setError] = useState('');
	const [emailIsSent, setEmailIsSent] = useState(false);
	const ResetPasswordSchema = Yup.object().shape({
		email: Yup.string().email('Email must be a valid email address').required('Email is required')
	});

	const defaultValues = {
		email: user.email || '',
	};

	const methods = useForm({
		resolver: yupResolver(ResetPasswordSchema),
		defaultValues,
	});
	
	const {
		handleSubmit,
		formState: { isSubmitting },
		watch,
		setValue
	} = methods;

	useEffect(()=>{
		setValue('email',user.email || '')
	},[user.email, setValue])
	
	const {email} = watch();

	const onSubmit = useCallback(async ({email}) => {
		try {
			await sendPasswordResetEmail(getAuth(),email);
			setEmailIsSent(true);
		} catch(e){
			console.error(e);
			setError("Could not sent verification email.");
		}
	},[])
	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3}>
				{!user.email && user.id ? (
					<Typography>
						Please update your email in profile settings
					</Typography>
				) : (
					<RHFTextField
						name="email"
						label="Email address"
						disabled={!!user.email}
					/>
				)}

				{!(!user.email && user.id) && !error &&
					(emailIsSent ? (
						<Alert severity="success">
							A verification email was sent to <strong>{email}</strong>. Please also check your spam folder if you don&apos;t receive email in your inbox.
						</Alert>
					) : (
						email && <Typography variant="body1">
							A verification email will be sent to <strong>{email}</strong>.
						</Typography>
				))}
				{
					error &&
						<Typography
							variant="body2"
							align="center"
							sx={{ color: "red", mt: 3 }}
						>
						{error}
					</Typography>
				}
				<LoadingButton
					fullWidth
					size="large"
					type="submit"
					variant="contained"
					loading={isSubmitting}
				>
					{emailIsSent
						? "Resend Password Reset Link"
						: "Send Password Reset Link"}
				</LoadingButton>

			</Stack>
		</FormProvider>
	);
}
