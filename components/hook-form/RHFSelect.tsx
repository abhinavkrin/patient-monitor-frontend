// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';

// ----------------------------------------------------------------------

interface ISelectOption {
	label: string;
	value: any;
	disabled?: boolean;
}
interface RHFSelectProps extends SelectProps {
	name: string;
	options: ISelectOption[]
};

export default function RHFSelect({ name,options,label, ...other }: RHFSelectProps) {
	const { control, setValue } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error }, }) => (
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">{label}</InputLabel>
					<Select
						{...field}
						onChange={e => setValue(name,e.target.value)}
						fullWidth
						value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
						label={label}
						error={!!error}
						labelId="demo-simple-select-label"
						{...other}
					>
						{options?.map(o => <MenuItem value={o.value} key={o.value} disabled={!!o.disabled}>{o.label}</MenuItem>)}
					</Select>
					<FormHelperText error={!!error}>{error?.message}</FormHelperText>
				</FormControl>
			)}
		/>
	);
}
