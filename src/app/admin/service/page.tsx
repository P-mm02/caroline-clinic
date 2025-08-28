import './page.css'

type Mode = 'maintenance' | 'building'

function titleByMode(mode: Mode) {
  return mode === 'maintenance'
    ? 'Scheduled Maintenance'
    : 'We’re Building Something New'
}

function subtitleByMode(mode: Mode) {
  return mode === 'maintenance'
    ? 'We’re performing updates to improve performance and reliability.'
    : 'This area is under active development. Exciting updates are coming.'
}

function thaiTitle(mode: Mode) {
  return mode === 'maintenance'
    ? 'อยู่ระหว่างบำรุงรักษาระบบ'
    : 'กำลังก่อสร้าง / ปรับปรุงระบบ'
}

function thaiSubtitle(mode: Mode) {
  return mode === 'maintenance'
    ? 'กำลังปรับปรุงประสิทธิภาพและความเสถียรของระบบ'
    : 'กำลังพัฒนาฟีเจอร์ใหม่ ๆ โปรดรอสักครู่'
}

function parseEtaParts(etaISO?: string | null) {
  if (!etaISO) return { hasEta: false as const }
  let eta: Date | null = null
  try {
    eta = new Date(etaISO)
    if (isNaN(eta.getTime())) eta = null
  } catch {
    eta = null
  }
  if (!eta) return { hasEta: false as const }

  const now = new Date()
  const ms = Math.max(0, eta.getTime() - now.getTime())
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    hasEta: true as const,
    days,
    hours,
    minutes,
    seconds,
    etaText: eta.toLocaleString(),
  }
}

function getStr(
  sp: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const v = sp[key]
  if (Array.isArray(v)) return v[0]
  return v
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const modeParam = (getStr(sp, 'mode') || 'maintenance').toLowerCase() as Mode
  const mode: Mode = modeParam === 'building' ? 'building' : 'maintenance'

  const percentRaw = getStr(sp, 'percent')
  const percent =
    percentRaw !== undefined && percentRaw !== null && percentRaw !== ''
      ? Math.max(0, Math.min(100, Number(percentRaw)))
      : null

  const etaParam = getStr(sp, 'eta') // ISO 8601 string
  const eta = parseEtaParts(etaParam)

  const contact = getStr(sp, 'contact') || 'support@yourdomain.com'
  const backHref = getStr(sp, 'back') || '/'

  return (
    <section className={`hold-wrap ${mode}`}>
      <section className="hold-card">
        <div className="hold-icon" aria-hidden>
          {/* Simple inline SVG icon switches with mode */}
          {mode === 'maintenance' ? (
            <svg viewBox="0 0 24 24" className="svg-hero">
              <path d="M21.9 19.1l-7.8-7.8a6 6 0 11-2.1 2.1l7.8 7.8a1.5 1.5 0 002.1-2.1zM10 14a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="svg-hero">
              <path d="M3 19h18v2H3v-2zm2-2h14l-7-12-7 12zM12 9l3.5 6h-7L12 9z" />
            </svg>
          )}
        </div>

        <h1 className="hold-title">{titleByMode(mode)}</h1>
        <p className="hold-subtitle">{subtitleByMode(mode)}</p>

        <h2 className="hold-title-th">{thaiTitle(mode)}</h2>
        <p className="hold-subtitle-th">{thaiSubtitle(mode)}</p>

        {typeof percent === 'number' && !Number.isNaN(percent) && (
          <div className="progress">
            <div className="progress-bar" style={{ width: `${percent}%` }} />
            <div className="progress-label">{percent}%</div>
          </div>
        )}

        {eta.hasEta && (
          <div className="eta-box">
            <div className="eta-line">
              <strong>Estimated back by:</strong> {eta.etaText}
            </div>
            <div className="eta-counts" role="timer" aria-live="polite">
              <div className="eta-chip">
                <span>{eta.days}</span> d
              </div>
              <div className="eta-chip">
                <span>{eta.hours}</span> h
              </div>
              <div className="eta-chip">
                <span>{eta.minutes}</span> m
              </div>
              <div className="eta-chip">
                <span>{eta.seconds}</span> s
              </div>
            </div>
            <div className="eta-line-th">
              <strong>คาดว่าจะกลับมา:</strong> {eta.etaText}
            </div>
          </div>
        )}

        <div className="hold-actions">
          <a className="btn btn-primary" href={backHref}>
            Back to Home
          </a>
          <a className="btn btn-ghost" href={`mailto:${contact}`}>
            Contact Support
          </a>
        </div>

        <div className="fineprint">
          Status: <span className={`badge ${mode}`}>{mode}</span>
          <span className="dot">•</span>
          Need help? <a href={`mailto:${contact}`}>{contact}</a>
        </div>
      </section>
    </section>
  )
}
