// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Box, Chip, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { KeyboardEvent, useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
// ----------------------------------------------------------------------

export default function RHFTextArray({ name, defaultValue = undefined, ...other }) {
  const { control, setValue, watch} = useFormContext();
  const values: string[] = watch(name);
  useEffect(() => {
    if(defaultValue)
      setValue(name,defaultValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  const addValueToList = (value) => {
    setValue(name, [...values, value]);
    setTextValue("");
  }
  const [textValue,setTextValue] = useState('');
  const onEnter = (e: KeyboardEvent) => {
    if (e.code === "Enter"){
      e.preventDefault();
      addValueToList(textValue);
    }
  }
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <TextField
            {...field}
            fullWidth
            onChange={e => setTextValue(e.target.value)}
            value={textValue}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" >
                  <IconButton
                    onClick={() => textValue?.trim() && addValueToList(textValue?.trim())}
                    aria-label="Add to list"
                    onMouseDown={null}
                    edge="end"
                  >
                    <Add/>
                  </IconButton>
                </InputAdornment>
                )
            }}
            error={!!error}
            helperText={error?.message}
            onKeyDown={onEnter}
            {...other}
          />
          <Typography variant={"caption"} sx={{px: 1}}>
            Total: {values.length}
          </Typography>
          <Box flexDirection="row">
            {values.map( (v,i) => (
              <Chip key={v+i} label={v} 
                sx={{margin: 0.25}}
                onDelete={() => {
                  const newValues = values.filter((_,idx) => idx !== i);
                  setValue(name,newValues);
                }}/>
            ))}
          </Box>
        </Box>
      )}
    />
  );
}
