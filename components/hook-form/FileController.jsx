import { useCallback, useState, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { getBase64 } from './utils';

export function FileController({ name, control, defaultValue, render }) {
  const inputRef = useRef(null);
  const { setValue } = useFormContext();
  const { field } = useController({ name, control });
  const [base64, setBase64] = useState(defaultValue.name);

  const onChange = useCallback(async (event) => {
    if (event.target.files?.[0]) {
      setBase64(await getBase64(event.target.files[0]));
      field.onChange(event.target.files[0]);
    }
  }, [field]);

  return render({
    field: {
      type: 'file',
      name,
      onChange,
      ref: (instance) => {
        field.ref(instance);
        inputRef.current = instance;
      },
    },
    base64,
    select: () => inputRef.current?.click(),
    remove: () => {
      setValue(name, null);
      setBase64(null);
    },
  });
}
