// src/app/head.tsx

export default function Head() {
  return (
    <>
      {/* Basic Meta */}
      <title>Caroline Clinic</title>
      <meta
        name="description"
        content="Caroline Clinic offers a full range of beauty services provided by expert physicians and modern equipment."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Favicon - legacy and modern */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      {/* Apple Touch Icon */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* Web Manifest for PWA */}
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#ffffff" />

      {/* SEO: Canonical URL */}
      <link rel="canonical" href="https://carolineclinic.netlify.app/" />

      {/* Open Graph (Facebook, LINE, etc) */}
      <meta property="og:title" content="Caroline Clinic" />
      <meta
        property="og:description"
        content="Caroline Clinic offers a full range of beauty services provided by expert physicians and modern equipment"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://carolineclinic.netlify.app/" />
      <meta
        property="og:image"
        content="https://carolineclinic.netlify.app/og-image.png"
      />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Caroline Clinic" />
      <meta
        name="twitter:description"
        content="Short description of your website."
      />
      <meta
        name="twitter:image"
        content="https://carolineclinic.netlify.app/og-image.png"
      />

      {/* Extra: Mobile browser address bar color */}
      <meta name="theme-color" content="#ffffff" />
    </>
  )
}
