import Services from './services/PageClient'
import About from './about/PageClient'
import Review from './review/PageClient'
import Promotion from './promotion/PageClient'
import Contact from './contact/PageClient'
import Article from './article/PageClient'

export const metadata = {
  title: 'หน้าแรก | Caroline Clinic',
}

export default function HomePage() {
  return (
    <main>
      {/* 💡 Each section follows AIRI's homepage layout */}
      <Services />
      <About />
      <Review />
      <Promotion />
      <Article />
      <Contact />
    </main>
  )
}
