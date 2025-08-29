import type { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HelmetProvider>
      <Component {...pageProps} />
    </HelmetProvider>
  );
}