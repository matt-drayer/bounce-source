import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { defineCustomElements as ionDefineCustomElements } from '@ionic/core/loader';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { PostHogProvider } from 'posthog-js/react';
import posthog from 'services/client/analytics/posthog';
import { useApollo } from 'utils/client/apolloClient';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';
import { CurrentUserProvider } from 'context/CurrentUserContext';
import { GeoLocationProvider } from 'context/GeoLocationContext';
import { StripeProvider } from 'context/StripeContext';
import { ViewerProvider } from 'context/ViewerContext';
import { VirtualConsoleProvider } from 'context/VirtualConsoleContext';
import GoogleMapsScript from 'components/scripts/GoogleMapsScript';
import ToastContainer from 'components/utilities/ToastContainer';
import UsagePing from 'components/utilities/UsagePing';
// import ThemeProvider from 'context/ThemeProvider';
import 'styles/globals.css';

const APP_VIEWPORT = 'viewport-fit=cover, width=device-width, initial-scale=1';
const WEB_VIEWPORT = 'width=device-width, initial-scale=1';
const GTAG = process.env.GOGOLE_ANALYTICS_TAG;
const META_PIXEL = '135010656344231'; // TODO: move to env

export default function App({ Component, pageProps, err }: AppProps & { err: any }) {
  const apolloClient = useApollo(pageProps);
  const viewport = getIsNativePlatform() ? APP_VIEWPORT : WEB_VIEWPORT;
  const router = useRouter();

  React.useEffect(() => {
    ionDefineCustomElements(window);
  }, []);

  React.useEffect(() => {
    if (router.isReady) {
      const isDarkmode = router.query.darkmode === 'true';
      document.body.classList.toggle('dark', isDarkmode);
      document.documentElement.classList.toggle('dark', isDarkmode);
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <meta name="viewport" content={viewport} />

        {/* meta */}
        <meta name="theme-color" content="#040405" />
        <link rel="manifest" href={`${process.env.APP_URL}/manifest.json`} />
        <link rel="shortcut icon" href={`${process.env.APP_URL}/icons/favicon.png`} />
        <meta name="application-name" content="" />
        <meta name="apple-mobile-web-app-title" content="" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: dark)" />
        {/* <link rel="mask-icon" href="/favicon-mask.svg" color="#FFF" /> */}

        {/* apple */}
        <link rel="apple-touch-icon" href={`${process.env.APP_URL}/icons/apple-icon.png`} />
      </Head>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GTAG}`} />
      <Script id="google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GTAG}');
          `}
      </Script>
      {/* Meta Pixel Code */}
      <Script id="meta-pixel">
        {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL}');
          fbq('track', 'PageView');`}
      </Script>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL}&ev=PageView&noscript=1" />`,
        }}
      />
      <GoogleMapsScript />
      <ViewerProvider>
        {/* <ThemeProvider> */}
        <ApolloProvider client={apolloClient}>
          <CurrentUserProvider>
            <UsagePing>
              <StripeProvider>
                <GeoLocationProvider>
                  <VirtualConsoleProvider>
                    {/**
                     * @todo turn back on if we end up using this
                     */}
                    {/* <IntercomProvider appId={process.env.INTERCOM_APP_ID as string}> */}
                    <PostHogProvider client={posthog}>
                      <Component {...pageProps} err={err} />
                    </PostHogProvider>
                    {/* </IntercomProvider> */}
                  </VirtualConsoleProvider>
                  <ToastContainer />
                </GeoLocationProvider>
              </StripeProvider>
            </UsagePing>
          </CurrentUserProvider>
        </ApolloProvider>
        {/* </ThemeProvider> */}
      </ViewerProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
