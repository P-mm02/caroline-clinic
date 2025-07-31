// src/app/layout.tsx
export const metadata = {
  title: 'Caroline Clinic | คลินิกเสริมความงาม รังสิต, Thammasat Beauty Clinic',
  description:
    'Caroline Clinic คลินิกเสริมความงาม ใกล้มหาวิทยาลัยธรรมศาสตร์ รังสิต ฟิลเลอร์ โบท็อกซ์ เลเซอร์ | beauty clinic near Thammasat University, Rangsit. Fillers, Botox, laser.',
  openGraph: {
    title:
      'Caroline Clinic | คลินิกเสริมความงาม รังสิต, Thammasat Beauty Clinic',
    description:
      'Caroline Clinic คลินิกเสริมความงาม ใกล้มหาวิทยาลัยธรรมศาสตร์ รังสิต ฟิลเลอร์ โบท็อกซ์ เลเซอร์ | beauty clinic near Thammasat University, Rangsit. Fillers, Botox, laser.',
    url: 'https://carolineclinic.netlify.app/',
    images: [
      {
        url: 'https://carolineclinic.netlify.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Caroline Clinic | คลินิกเสริมความงาม',
      },
    ],
    type: 'website',
    locale: 'th_TH', // Or omit, or set 'en_US', doesn't matter much if content is mixed
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Caroline Clinic | คลินิกเสริมความงาม Rangsit, Thammasat Beauty Clinic',
    description:
      'Caroline Clinic คลินิกเสริมความงาม ใกล้มหาวิทยาลัยธรรมศาสตร์ รังสิต ฟิลเลอร์ โบท็อกซ์ เลเซอร์ | beauty clinic near Thammasat University, Rangsit. Fillers, Botox, laser.',
    images: ['https://carolineclinic.netlify.app/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
    ],
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://carolineclinic.netlify.app/'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
