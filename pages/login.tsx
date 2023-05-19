/* eslint-disable @next/next/no-img-element */
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/Logo';
import AuthSocial from '../components/auth/AuthSocial';
import {LoginForm} from '../components/auth/login';
import RouterLink  from 'next/link';
import {useRouter} from 'next/router';
import {useAuth} from '../components/auth/useAuth';
import {withAuthUser} from 'next-firebase-auth';
import {SITE_NAME} from '../appConfig';
import { useState, useEffect } from 'react';
import { 
  EmailAuthProvider, 
  FacebookAuthProvider, 
  fetchSignInMethodsForEmail, 
  getAuth, 
  GoogleAuthProvider, 
  linkWithCredential, 
  OAuthProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default withAuthUser()(function Login() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const [error, setError] = useState("");
  const [diffCredError, setDiffCredError] = useState(null);
  const [progress, setProgress] = useState(false);
  
  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
		if (user.id) {
      router.push('/');
		}
  }, [user.id, router]);

  const doEmailPasswordLogin = async ({email,password}) => {
    if (progress) {
      return true;
    }
    setProgress(true);
    try {
      const userCred = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
      );

      if (
        diffCredError?.oldProvider?.providerId === EmailAuthProvider.PROVIDER_ID
      ) {
        // The signin was requested to link new credentials with the account
        await linkWithCredential(
          userCred.user,
          OAuthProvider.credentialFromError(diffCredError.error)
        );
      }
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setError("User not found");
          break;
        case "auth/wrong-password":
          setError("Incorrect Password");
          break;
        default:
          setError("Unknown error occurred");
      }
    } finally {
      setProgress(false);
    }
  };
  const onLoginFormSubmit = (data) => {
    doEmailPasswordLogin(data);
  }
  const handleProviderSignIn = async (provider) => {
    if (progress) {
      return;
    }
    const auth = getAuth();
    try {
      const userCred = await signInWithPopup(auth, provider);
      if (diffCredError) {
        // The signin was requested to link new credentials with the account
        await linkWithCredential(
          userCred.user,
          OAuthProvider.credentialFromError(diffCredError.error)
        );
      }
    } catch (e) {
      switch (e.code) {
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
          break;
        case "auth/popup-blocked":
          setError("Popup blocked by your browser.");
          break;
        case "auth/account-exists-with-different-credential":
          const methods = await fetchSignInMethodsForEmail(
            auth,
            e.customData.email
          );
          setDiffCredError({
            error: e,
            newProviderId: provider.providerId,
            oldProviderId: methods[0],
          });
          break;
        default:
          setError("Unknown error occurred");
      }
      setProgress(false);
    }
  };

  const onGoogleBtnClick = () => {
    if (progress) {
      return;
    }
    setProgress(true);
    const provider = new GoogleAuthProvider();
    handleProviderSignIn(provider);
  };

  const onFacebookBtnClick = () => {
    if (progress) {
      return;
    }
    setProgress(true);
    const provider = new FacebookAuthProvider();
    handleProviderSignIn(provider);
  };

  return (
      <>
          <RootStyle>
              <HeaderStyle>
                  <Logo />

                  {smUp && (
                      <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                          Don’t have an account? {""}
                          <RouterLink href="/register">
                              <Link variant="subtitle2">Get started</Link>
                          </RouterLink>
                      </Typography>
                  )}
              </HeaderStyle>

              {mdUp && (
                  <SectionStyle>
                      <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                          Hi, Welcome Back
                      </Typography>
                      <img
                          src="/static/illustrations/illustration_login.png"
                          alt="login"
                      />
                  </SectionStyle>
              )}

              <Container maxWidth="sm">
                  <ContentStyle>
                      <Typography variant="h4" gutterBottom>
                          Sign in to {SITE_NAME}
                      </Typography>

                      <Typography sx={{ color: "text.secondary", mb: 5 }}>
                          Enter your details below.
                      </Typography>

                      <AuthSocial
                          facebookHandler={onFacebookBtnClick}
                          googleHandler={onGoogleBtnClick}
                          twitterHandler={() => {}}
                      />

                      <LoginForm onSubmit={onLoginFormSubmit} />
                      <Typography
                          variant="body2"
                          align="center"
                          sx={{ color: "red", mt: 3 }}
                      >
                          {error}
                      </Typography>
                      {!smUp && (
                          <Typography
                              variant="body2"
                              align="center"
                              sx={{ mt: 3 }}
                          >
                              Don’t have an account?{" "}
                              <RouterLink href="/register">
                                  <Link variant="subtitle2">Get started</Link>
                              </RouterLink>
                          </Typography>
                      )}
                  </ContentStyle>
              </Container>
          </RootStyle>
      </>
  );
})
