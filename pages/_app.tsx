import { BaseOptionChartStyle } from '../components/chart/BaseOptionChart'
import ScrollToTop from '../components/ScrollToTop'
import '../styles/globals.css'
import '../styles/nprogress.css'
import ThemeProvider from '../theme/'
import { getAnalytics } from 'firebase/analytics';
import { initAuth } from '../firebase';
import { Router } from 'next/router';
import nProgress from 'nprogress';
import AuthObserver from '../components/auth/AuthObserver'

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

initAuth()
if (typeof window !== 'undefined') {
  getAnalytics();
}

// const store = configureAppStore();

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Component {...pageProps} />
      <AuthObserver/>
    </ThemeProvider>
  )
}

export default MyApp
