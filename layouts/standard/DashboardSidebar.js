import PropTypes from 'prop-types';
import { useEffect } from 'react';
import * as NextLink from 'next/link';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, useTheme, alpha } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import {navConfig, adminNavConfig} from './NavConfig';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth/useAuth';
import { SITE_NAME } from '../../appConfig';
import { getDisplayNameText } from '../../utils/getDisplayNameText';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[200],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useRouter();
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const account = useAuth();

  const match = (path) => (path ? (pathname.startsWith(path)) : false);

  const active = match(`/org/${account.userName}`);

  const theme = useTheme();
  
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
        <Typography variant="h4" sx={{paddingX: 2}}>
          {SITE_NAME}
        </Typography>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <NextLink href={account.userName ? `/@${account.userName}` : "/account"}>
          <Link underline="none">
            <AccountStyle
              sx={
                active &&
                {
                  bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
                }
              }>
              <Avatar src={account.photoURL} alt="photoURL" />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={
                  active ?  
                  {
                    color: theme.palette.primary.main,
                  } :
                  { color: 'text.primary' }}>
                  {account.displayName ? getDisplayNameText(account) : 'Guest'}
                </Typography>
              </Box>
            </AccountStyle>
          </Link>
        </NextLink>
      </Box>

      <NavSection navConfig={navConfig} />
      {
        ["admin","manager"].includes(account?.claims?.role) && 
        <>
          <Box sx={{ paddingX: 1, marginBottom: -1 }}>
            <Typography variant="subtitle2" sx={{ paddingX: 2.5, }}>
              ADMIN
            </Typography>
          </Box>
          <NavSection navConfig={adminNavConfig.filter(nav => account.claims?.role !== "admin" ? !nav.adminOnly : true)} />
        </>
      }
      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
