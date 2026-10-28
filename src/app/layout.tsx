import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const metaPixelId = "1727754728465550";

export const metadata: Metadata = {
  title: "Land a $120K+ Data Privacy Job | DataVerse Solutions",
  description:
    "Learn the DataVerse career transition blueprint for a $120K+ Data Privacy role, plus join the free live masterclass on Saturday, November 7th at 12:00 PM Eastern Time, 9:00 AM Pacific Time.",
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
          fbq('track', 'PageView');`}
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
