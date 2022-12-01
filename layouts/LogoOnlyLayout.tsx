// material
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { SITE_NAME } from '../appConfig';
// components
import Logo from '../components/Logo';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));
const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});
// ----------------------------------------------------------------------

export default function LogoOnlyLayout({children, title}) {
  return (
    <RootStyle>
      <Head>
        <title>
          {title || SITE_NAME}
        </title>
      </Head>
      <HeaderStyle>
        <Logo />
      </HeaderStyle>
      {children}
    </RootStyle>
  );
}
