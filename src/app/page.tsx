import Services from './services/PageClient'
import About from './about/PageClient'
import Review from './review/PageClient'
import Promotion from './promotion/PageClient'
import Article from './article/PageClient'
import Hero from './Hero/Hero'

export const metadata = {
  title: 'หน้าแรก | Caroline Clinic',
}

export default function HomePage() {
  return (
<main style={{
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #ffeafd 0%, #fbeaff 20%, #e9f6ff 40%, #e3fff9 60%, #fffdda 80%, #ffeede 100%)'
}}>
  <Hero />
  <Services />
  <About />
  <Review limit={3} />
  <Promotion limit={6} />
  <Article />
</main>
  )
}
