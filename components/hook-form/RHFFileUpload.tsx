/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box, Stack, useTheme} from "@mui/system";
import {makeId} from '../../utils/makeId';
// ----------------------------------------------------------------------


RHFFileUpload.propTypes = {
	name: PropTypes.string,
};

const FileInput = ({ field, ...other }) => {
		const ctx = useFormContext();
		const [id,setId] = useState('')
		const theme = useTheme();
		const {value}  =  field;
		const [logoUrl,setLogoUrl] = useState(null);
		const [lastFile,setLastFile] = useState(null);
		
		useEffect(() => setId(makeId()),[]);
		useEffect(() => {
			if(value === logoUrl)
				return;
			if(typeof value === 'string'){
				setLogoUrl(value);
			}
			else if(value instanceof FileList){
				if (lastFile !== value[0]){
					const u = value[0] && URL.createObjectURL(value[0]);
					setLogoUrl(u);
					setLastFile(value[0]);
				}
			}
		},[value, setLogoUrl, logoUrl, lastFile]);

		const handleClick = () => {
			document.getElementById(`${id}`).click();
		}

		return (
			<React.Fragment>
				<input
					name={field.name}
					onBlur={field.onBlur}
					onChange={e => ctx.setValue(field.name,e.target.files)}
					ref={field.ref}
					id={id}
					className="react-hook-form-file-upload"
					type="file"
					accept="image/png,image/jpeg,image/jpg,image/webp"
					style={{ display: "none" }}
					{...other}
				/>
				{logoUrl && 
					<Box
						sx={{
							border: `1px solid ${theme.palette.primary.light}`,
							borderRadius: 1,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							padding: 2,
							gap: 1,
							marginBottom: 1
						}}
					>
						<img
							src={logoUrl}
							alt="Image Upload"
							height={250}
							width={250}
						/>
					</Box>
				}
				<Box>
					<Button
						variant="outlined"
						color="primary"
						onClick={handleClick}>
						UPLOAD
					</Button>
				</Box>
			</React.Fragment>
		)
			
}
export default function RHFFileUpload({ name, hint, ...other }) {
	const theme  = useTheme();
	const { control, getFieldState } = useFormContext();
	const [isAdancedUpload, setIsAdvancedUpload] = useState(false);
	const [isDragOver, setDragOver] = useState(false);
	const ctx = useFormContext();
	useEffect(() => {
		var div = document.createElement("div");
		setIsAdvancedUpload(
			("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
			"FormData" in window &&
			"FileReader" in window
		);
	}, [setIsAdvancedUpload])
	if(isAdancedUpload)
		return (
			<Box
				onDragOver={(e) => {
					e.preventDefault();
					setDragOver(true)
				}}
				onDragEnter={(e) => {
					e.preventDefault();
					setDragOver(true)
				}}
				onDragLeave={(e) => {
					e.preventDefault();
					setDragOver(false)
				}}
				onDragEnd={(e) => {
					e.preventDefault();
					setDragOver(false)
				}}
				onDrop={(e) => {
					e.preventDefault();
					setDragOver(false);
					const files = e.dataTransfer.files;
					ctx.setValue(name, files);
				}}
				sx={{
					background: isDragOver ? "#ddd" : theme.palette.primary.lighter,
					borderRadius: theme.spacing(1),
					minHeight: "200px",
					width: "100",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					padding: 3
				}}
			>
				<Typography color="text.secondary" variant="subtitle1">
					Drag &amp; drop image here
				</Typography>
				<Stack direction="row" sx={{ padding: 2 }}>
					<div
						style={{
							width: "50px",
							borderBottom:
								"1px solid" + theme.palette.text.secondary,
							transform: "translateY(-45%)",
							marginRight: "1rem",
						}}
					/>
					OR
					<div
						style={{
							width: "50px",
							borderBottom:
								"1px solid" + theme.palette.text.secondary,
							transform: "translateY(-45%)",
							marginLeft: "1rem",
						}}
					/>
				</Stack>
				<Controller
					name={name}
					control={control}
					render={({ field, }) => (
						<FileInput
							field={field}
							{...other}
						/>
					)}
				/>

				<Typography color="text.secondary" variant="caption" sx={{margin: 1}}>
					{hint}
				</Typography>
				<Typography color="error" variant="caption" sx={{ margin: 1 }}>
					{getFieldState(name).error?.message || "" }
				</Typography>
			</Box>
		);
	else return (
		<Controller
			name={name}
			control={control}
			render={({ field}) => (
				<FileInput
					field={field}
				/>
			)}
		/>
	);
}
