import ModuleLinks from '../components/ModuleLinks'

export default function DashboardPage() {
  return (
    <section>
      <span className="eyebrow">KAMPÜS KİTİN</span>
      <h1>Ana panel</h1>
      <p className="intro">Geliştirmeye başlamak için bir modül seç. Özet kartları ve veri bağlantıları daha sonra eklenecek.</p>
      <ModuleLinks />
    </section>
  )
}
