import PropTypes from 'prop-types';
import Link from 'next/link';
import Iconify from './Iconify';

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, }) {
  const logo = (
    <Iconify
      icon={"mdi:doctor"} 
      height={40} 
      width={40}  
      sx={{borderRadius: "0.5rem", cursor: "pointer"}} />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link href="/" passHref>
      <a>
        {logo}
      </a>
    </Link>
  );
}
