import "./globals.css";
import Script from "next/script";

const TELEGRAM_LINK = "https://t.me/+d9TcoaiEqwQ3M2U1";

export const metadata = {
  title: "STREAMINGKU - Nonton Film Gratis",
  description: "Streaming film terbaru tanpa iklan banner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* OPTIMASI KONEKSI (DNS PREFETCH & PRECONNECT) */}
        <link rel="dns-prefetch" href="https://pl28804322.effectivegatecpm.com" />
        <link rel="dns-prefetch" href="https://s10.histats.com" />
        <link rel="preconnect" href="https://pl28804322.effectivegatecpm.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.weserv.nl" crossOrigin="anonymous" />

        {/* IKLAN ADSTERRA - Siap tempur sebelum interaksi */}
        <Script 
          src="https://pl28804322.effectivegatecpm.com/19/e6/a7/19e6a7bd62bc2b7a01520f263322c8af.js" 
          strategy="beforeInteractive" 
        />

        {/* HISTATS - Statistik pengunjung */}
        <Script id="histats-async" strategy="afterInteractive">
          {`
            var _Hasync= _Hasync|| [];
            _Hasync.push(['Histats.start', '1,5006689,4,0,0,0,00010000']);
            _Hasync.push(['Histats.fasi', '1']);
            _Hasync.push(['Histats.track_hits', '']);
            (function() {
              var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
              hs.src = ('//s10.histats.com/js15_as.js');
              (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
            })();
          `}
        </Script>
      </head>
      <body style={{ margin: 0, backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        {children}

        {/* TOMBOL TELEGRAM MELAYANG */}
        <div style={{ position: 'fixed', bottom: '25px', right: '20px', zIndex: 10000 }}>
          <a 
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '60px',
              height: '60px',
              backgroundColor: '#0088cc',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              textDecoration: 'none'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              backgroundColor: '#ff0000',
              borderRadius: '50%',
              border: '2px solid #fff'
            }}></span>
          </a>
        </div>

        {/* BACKUP HISTATS */}
        <noscript>
          <a href="/" target="_blank">
            <img src="//sstatic1.histats.com/0.gif?5006689&101" alt="histats counter" border="0" />
          </a>
        </noscript>
      </body>
    </html>
  );
}
