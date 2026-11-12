import type { Metadata } from "next";
import Script from "next/script";
import { metaPixelId, metaTestStorageKey } from "@/lib/meta";
import "./globals.css";

export const metadata: Metadata = {
  title: "Land a $120K+ Data Privacy Job | DataVerse Solutions",
  description:
    "Learn the DataVerse career transition blueprint for a $120K+ Data Privacy role, plus join the free live masterclass on Saturday, November 21st at 12:00 PM Eastern Time, 9:00 AM Pacific Time.",
  icons: { icon: "/sites/dataverse/DATAVERSELOGO.jpeg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${metaPixelId}');
          (function () {
            var testCode;
            try {
              var fromUrl = new URLSearchParams(location.search).get('${metaTestStorageKey}');
              if (fromUrl) sessionStorage.setItem('${metaTestStorageKey}', fromUrl);
              testCode = sessionStorage.getItem('${metaTestStorageKey}') || undefined;
            } catch (e) {}
            var eventId = crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2);
            fbq('track', 'PageView', {}, { eventID: eventId });
            // Server copy for the Conversions API; the delay lets the pixel set its _fbp cookie first.
            setTimeout(function () {
              fetch('/api/meta-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                keepalive: true,
                body: JSON.stringify({ event_name: 'PageView', event_id: eventId, event_source_url: location.href, test_event_code: testCode })
              }).catch(function () {});
            }, 1000);
          })();`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            alt=""
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  );
}
