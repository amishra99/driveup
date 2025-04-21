import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>
          DriveUp – Compare Cars, Get AI Recommendations & Drive Smarter
        </title>
        <meta
          name="description"
          content="DriveUp is your ultimate car companion — helping you explore, compare, and choose smarter. From buying to owning, we’ve got you covered."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/driveup_fav.png" />

        {/* ✅ Open Graph (Facebook / LinkedIn) */}
        <meta property="og:site_name" content="DriveUp" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="DriveUp – Compare Cars, Get AI Recommendations & Drive Smarter"
        />
        <meta
          property="og:description"
          content="DriveUp is your ultimate car companion — helping you explore, compare, and choose smarter. From buying to owning, we’ve got you covered."
        />
        <meta property="og:url" content="https://www.driveup.in" />
        <meta
          property="og:image"
          content="https://www.driveup.in/og-image.png"
        />

        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="DriveUp – Compare Cars, Get AI Recommendations & Drive Smarter"
        />
        <meta
          name="twitter:description"
          content="DriveUp is your ultimate car companion — helping you explore, compare, and choose smarter. From buying to owning, we’ve got you covered."
        />
        <meta
          name="twitter:image"
          content="https://www.driveup.in/og-image.png"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
