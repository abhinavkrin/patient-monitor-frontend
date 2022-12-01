import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Switch } from '@mui/material';
import { useMemo } from 'react';
import { makeId } from '../../utils/makeId';

// ----------------------------------------------------------------------

RHFSwitch.propTypes = {
  name: PropTypes.string,
};

export default function RHFSwitch({ name, label, ...other }) {
  const { control } = useFormContext();
  const id = useMemo(() => makeId(), []);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field}) => {
        return (
          <div>
            <Switch
              id={id}
              {...field}
              checked={field.value}
              {...other}
            />
            <label htmlFor={id}>{label}</label>
          </div>
        )
      }}
    />
  );
}
