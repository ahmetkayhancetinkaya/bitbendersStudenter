import { modules } from '../config/modules'
import type { ModuleId } from '../config/modules'

export default function ModulePlaceholder({ id }: { id: ModuleId }) {
  const module = modules[id]
  return (
    <section>
      <span className="eyebrow">KAMPÜS ARAÇLARI</span>
      <h1>{module.title}</h1>
      <p className="intro">{module.description}</p>
      <div className="placeholder">
        <span className="badge">Geliştirilecek</span>
        <h2>Bu modülün başlangıç sayfası hazır.</h2>
        <p>Liste, form ve veri bağlantıları burada geliştirilecek.</p>
      </div>
    </section>
  )
}
