import { useEffect, useRef, useState } from "react";
import { Grid, Typography, Avatar, Stack, FormGroup, useTheme, FormHelperText, Box, Paper } from "@mui/material";
import { useAuth } from "../auth/useAuth";
import { useRouter } from "next/router";
import Iconify from "../Iconify";
import { updateProfile, verifyBeforeUpdateEmail, } from "firebase/auth";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import image_reducer from 'image-blob-reduce';
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { FormProvider, RHFTextField } from "../hook-form";
import { grey } from "@mui/material/colors";
const reducer = image_reducer();
reducer._create_blob = function (env) {
	return this.pica.toBlob(env.out_canvas, 'image/webp', 0.8)
		.then(function (blob) {
			env.out_blob = blob;
			return env;
		});
};

const Profile = () => {

	const user = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (user.clientInitialized) {
			if (!user.id) {
				router.push(`/login?redirect=/account`)
			}
		}
	})
	const fileUploadRef = useRef<HTMLInputElement>();
	const [isPictureUploadPending, setPictureUploadPending] = useState(false);
	const [pendingPicture, setPendingPicture] = useState<File>(null);
	const [pendingPictureUrl, setPendingPictureUrl] = useState(null);
	const [isPictureUploading, setPictureUploading] = useState(false);
	const [emailChangeMessage, setEmailChangeMessage] = useState(null);
	const theme = useTheme();

	const handlePictureUpload = async () => {
		if (!isPictureUploadPending) {
			fileUploadRef.current?.click();
		} else {
			setPictureUploading(true)
			const photoBlob = await reducer.toBlob(pendingPicture, { max: 250 });
			const storage = getStorage();
			const logoRef = ref(storage, `users/${user.id}/photo.webp`);
			const newMetadata = {
				cacheControl: `public,max-age=${3600 * 24 * 30}`,
				contentType: 'image/webp'
			};
			await uploadBytes(logoRef, photoBlob, newMetadata);
			const photoURL = await getDownloadURL(logoRef);
			await updateProfile(user.firebaseUser, {
				photoURL
			});
			user.firebaseUser.reload();
			setPictureUploading(false);
			setPictureUploadPending(false);
		}
	}

	const RegisterSchema = Yup.object().shape({
		displayName: Yup.string().required("Full name required"),
		email: Yup.string().email().required("Email is required"),
	});

	const [defaultValues,] = useState(() => ({
		displayName: user.displayName || '',
		email: user.email || '',
	}));


	const methods = useForm({
		resolver: yupResolver(RegisterSchema),
		defaultValues,
	});


	const {
		handleSubmit,
		formState: { isSubmitting },
		setValue,
	} = methods;


	useEffect(() => {
		if (user.clientInitialized && user.id)
			setValue("displayName", user.displayName || '');
		if (!emailChangeMessage)
			setValue("email", user.email || '');
	}, [setValue, user.clientInitialized, user.displayName, user.email, user.id, emailChangeMessage]);

	const onProfileSave = async ({
		displayName,
		email,
	}) => {
		if (user.displayName !== displayName) {
			await updateProfile(user.firebaseUser, { displayName });
		}
		if (user.email != email) {
			await verifyBeforeUpdateEmail(user.firebaseUser, email);
			setEmailChangeMessage(
				<span>
					We have sent a verification email to <strong>{email}</strong>. Your email will be updated only after verification. Please check spam folder, if you do not find email in inbox.
				</span>
			)
		}
		await user.firebaseUser.reload();
	}

	return (
		<Grid container
			spacing={2}
			sx={{
				boxSizing: "border-box",
				display: "flex",
				flexFlow: "row wrap",
			}}>
			<Grid item xs={12} md={4} sx={{ padding: 1 }} container>
				<Paper
					elevation={6}
					sx={{
						width: "100%",
						padding: 2,
						background: isPictureUploadPending ? theme.palette.action.selected : theme.palette.background.paper
					}}>
					<Typography variant="subtitle2">Profile Picture</Typography>
					<Stack sx={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						paddingY: 5,
						paddingX: 3
					}}
						gap={2}>
						<Box
							sx={{
								borderColor: grey[500],
								borderRadius: "50%",
								borderWidth: 1,
								borderStyle: "dashed",
								padding: 0.5
							}}>
							<Avatar
								src={isPictureUploadPending ? pendingPictureUrl : user.photoURL}
								alt="photoURL"
								sx={{
									height: "12rem",
									width: "12rem"
								}}
							/>
						</Box>
						<Typography
							variant="caption"
							sx={{
								color: grey[600],
								textAlign: "center"
							}}
						>
							Allowed *.jpeg, *.jpg, *.png, <br /> Maximum size: 2Mb
						</Typography>
						<input
							ref={fileUploadRef}
							onChange={e => {
								if (e.target.files?.length) {
									setPendingPicture(e.target.files[0]);
									const url = URL.createObjectURL(e.target.files[0]);
									setPendingPictureUrl(url);
									setPictureUploadPending(true);
								}
							}}
							type="file"
							style={{ display: "none" }}
							accept="image/*" />
						<LoadingButton
							onClick={handlePictureUpload}
							endIcon={<Iconify icon="eva:camera-outline" />}
							variant="contained"
							size="small"
							disabled={isPictureUploading}
							loading={isPictureUploading}
						>
							{isPictureUploadPending ? "Save" : "Upload"}
						</LoadingButton>
					</Stack>
				</Paper>
			</Grid>

			<Grid item xs={12} md={8} sx={{ padding: 1 }}>
				<Paper
					elevation={6}
					sx={{
						padding: 2,
					}}>
					<Typography variant="subtitle2">Profile</Typography>
					<FormProvider methods={methods} onSubmit={handleSubmit(onProfileSave)}>
						<Stack spacing={3}>
							<Box
								sx={{
									width: "100%",
									marginY: 2,
									padding: 2,
									border: `1px solid ${theme.palette.grey[400]}`,
									borderRadius: 1,
									display: "flex",
									justifyContent: "center",
								}}
							>
								<Typography variant="body1" component="span">
									USER ID:  {user.id}
								</Typography>
							</Box>
							<Stack sx={{
								display: "flex",
								flexDirection: "column",
								gap: 3,
								[theme.breakpoints.up("sm")]: {
									flexDirection: "row",
									alignItems: "center",
									gap: 2
								}
							}}>
								<RHFTextField name="displayName" label="Display Name" disabled={isSubmitting} fullWidth />
							</Stack>
							<FormGroup>
								<RHFTextField name="email" label="Email" disabled={isSubmitting} />
								<FormHelperText>{emailChangeMessage}</FormHelperText>
							</FormGroup>
							<Stack
								sx={{
									width: "100%",
									display: "flex",
									flexDirection: "row",
									justifyContent: "flex-end",
									alignItems: "center",
								}}>
								<LoadingButton
									fullWidth={false}
									type="submit"
									variant="contained"
									loading={isSubmitting}
									disabled={isSubmitting}
								>
									Save Profile
								</LoadingButton>
							</Stack>

						</Stack>
					</FormProvider>
				</Paper>
			</Grid>
		</Grid>
	)
}

export default Profile;
