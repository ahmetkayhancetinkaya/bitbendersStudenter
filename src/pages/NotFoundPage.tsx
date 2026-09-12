import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>Sayfa bulunamadı.</h1>
      <p>Bu adres için bir sayfa henüz tanımlanmadı.</p>
      <Link className="button" to="/app">Ana panele dön</Link>
    </main>
  )
}
