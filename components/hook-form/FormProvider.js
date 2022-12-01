import PropTypes from 'prop-types';
// form
import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
  methods: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  autoComplee: PropTypes.bool
};

export default function FormProvider({ children, onSubmit, methods, ...other }) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} {...other}>{children}</form>
    </Form>
  );
}
