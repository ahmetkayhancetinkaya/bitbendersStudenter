import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="landing">
      <header><Link className="brand" to="/">KampüsKit<span>.</span></Link><span className="badge">Proje iskeleti</span></header>
      <main>
        <span className="eyebrow">BİTBENDERS · STUDENTER</span>
        <h1>Kampüs hayatı,<br />bir arada.</h1>
        <p className="intro">Ders, bütçe, barınma ve kampüs yaşamı için öğrenci toolkit projesi.</p>
        <Link className="button" to="/app">Araç iskeletini aç →</Link>
        <p className="status-note">Bu sürüm yalnızca başlangıç yapısını içerir. Hesap, veri kaydetme ve bildirim özellikleri henüz geliştirilmedi.</p>
      </main>
    </div>
  )
}
