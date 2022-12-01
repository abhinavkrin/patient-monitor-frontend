// material
import { Stack, Button, Divider, Typography } from '@mui/material';
// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------
interface AuthSocialProps {
  googleHandler?: any;
  facebookHandler?: any;
  twitterHandler?: any;
}
export default function AuthSocial({
    googleHandler,
    facebookHandler
  }: AuthSocialProps) {
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={googleHandler}>
          <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
          <span style={{marginLeft: "0.25rem"}}>Log in with Google</span>
        </Button>
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={facebookHandler}>
          <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
          <span style={{ marginLeft: "0.25rem" }}>Log in with Facebook</span>
        </Button>
{/* 

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={twitterHandler}>
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
        </Button> */}
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
