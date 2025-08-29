import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-TileColor" content="#667eea" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://texttoreels.in/#website',
                  url: 'https://texttoreels.in',
                  name: 'TextToReels.in',
                  description: 'AI-Powered Text to Video Generator - Create stunning social media content in seconds',
                  publisher: {
                    '@id': 'https://texttoreels.in/#organization'
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://texttoreels.in/search?q={search_term_string}'
                    },
                    'query-input': 'required name=search_term_string'
                  }
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://texttoreels.in/#organization',
                  name: 'TextToReels.in',
                  url: 'https://texttoreels.in',
                  logo: {
                    '@type': 'ImageObject',
                    '@id': 'https://texttoreels.in/#logo',
                    url: 'https://texttoreels.in/logo.png',
                    width: 512,
                    height: 512
                  },
                  sameAs: [
                    'https://twitter.com/texttoreels',
                    'https://instagram.com/texttoreels',
                    'https://youtube.com/texttoreels',
                    'https://facebook.com/texttoreels'
                  ]
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'TextToReels.in AI Video Generator',
                  applicationCategory: 'MultimediaApplication',
                  operatingSystem: 'Web Browser',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD'
                  },
                  featureList: [
                    'AI-powered video generation',
                    '50+ language support',
                    '1M+ content templates',
                    'Instagram Reels creator',
                    'YouTube Shorts generator',
                    'Social media automation'
                  ]
                }
              ]
            })
          }}
        />
        
        {/* Google Analytics - Replace with your tracking ID */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_TRACKING_ID', {
                page_title: 'TextToReels.in - AI Video Generator',
                custom_map: { dimension1: 'user_type' }
              });
            `
          }}
        />
        
        {/* Microsoft Clarity - Replace with your tracking ID */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "CLARITY_ID");
            `
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        
        {/* Additional Performance Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Preload critical resources
              if ('requestIdleCallback' in window) {
                requestIdleCallback(function() {
                  const link = document.createElement('link');
                  link.rel = 'prefetch';
                  link.href = '/api/pages/random?limit=12';
                  document.head.appendChild(link);
                });
              }
            `
          }}
        />
      </body>
    </Html>
  );
}